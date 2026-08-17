import { Handlers } from "$fresh/server.ts";

const CACHE_DIR = "./tile_cache";
const MEMORY_CACHE = new Map<string, Uint8Array>();
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
const CACHE_METADATA_FILE = `${CACHE_DIR}/.cache_metadata.json`;

interface CacheMetadata {
  tiles: Record<string, { size: number; accessTime: number }>;
  totalSize: number;
}

let cacheMetadata: CacheMetadata = { tiles: {}, totalSize: 0 };
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Cleanup every 5 minutes

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await Deno.stat(CACHE_DIR);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(CACHE_DIR, { recursive: true });
    }
  }
}

// Load cache metadata from disk
async function loadCacheMetadata() {
  try {
    const data = await Deno.readTextFile(CACHE_METADATA_FILE);
    cacheMetadata = JSON.parse(data);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error("Error loading cache metadata:", error);
    }
    cacheMetadata = { tiles: {}, totalSize: 0 };
  }
}

// Save cache metadata to disk
async function saveCacheMetadata() {
  try {
    await Deno.writeTextFile(
      CACHE_METADATA_FILE,
      JSON.stringify(cacheMetadata, null, 2),
    );
  } catch (error) {
    console.error("Error saving cache metadata:", error);
  }
}

// Get cache file path
function getCachePath(z: string, x: string, y: string): string {
  return `${CACHE_DIR}/${z}/${x}/${y}.png`;
}

// Get metadata key
function getMetadataKey(z: string, x: string, y: string): string {
  return `${z}-${x}-${y}`;
}

// Get tile from memory cache
function getMemoryCache(z: string, x: string, y: string): Uint8Array | null {
  const key = `${z}-${x}-${y}`;
  return MEMORY_CACHE.get(key) || null;
}

// Set tile in memory cache
function setMemoryCache(z: string, x: string, y: string, data: Uint8Array) {
  const key = `${z}-${x}-${y}`;
  MEMORY_CACHE.set(key, data);
}

// Get tile from file cache and update access time
async function getFileCache(
  z: string,
  x: string,
  y: string,
): Promise<Uint8Array | null> {
  try {
    const path = getCachePath(z, x, y);
    const data = await Deno.readFile(path);
    // Load into memory cache for faster access
    setMemoryCache(z, x, y, data);

    // Update access time in metadata
    const key = getMetadataKey(z, x, y);
    if (cacheMetadata.tiles[key]) {
      cacheMetadata.tiles[key].accessTime = Date.now();
    }

    return data;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error("Error reading cache file:", error);
    }
    return null;
  }
}

// Evict least recently used tiles when cache exceeds limit
async function evictOldestTiles() {
  const now = Date.now();

  // Only run cleanup periodically
  if (now - lastCleanupTime < CLEANUP_INTERVAL) {
    return;
  }

  lastCleanupTime = now;

  if (cacheMetadata.totalSize > MAX_CACHE_SIZE) {
    // Sort tiles by access time, oldest first
    const sortedTiles = Object.entries(cacheMetadata.tiles).sort(
      (a, b) => a[1].accessTime - b[1].accessTime,
    );

    console.log(
      `Cache size ${
        (cacheMetadata.totalSize / 1024 / 1024).toFixed(1)
      }MB exceeds limit. Evicting old tiles...`,
    );

    // Evict tiles until we're below 80% of max size
    const targetSize = MAX_CACHE_SIZE * 0.8;
    for (const [key, metadata] of sortedTiles) {
      if (cacheMetadata.totalSize <= targetSize) break;

      const [z, x, y] = key.split("-");
      const path = getCachePath(z, x, y);

      try {
        await Deno.remove(path);
        cacheMetadata.totalSize -= metadata.size;
        delete cacheMetadata.tiles[key];
        MEMORY_CACHE.delete(key);
        console.log(`Evicted tile: ${key}`);
      } catch (error) {
        console.error(`Error evicting tile ${key}:`, error);
      }
    }

    // Clean up empty directories
    try {
      const entries = Deno.readDir(CACHE_DIR);
      for await (const entry of entries) {
        if (entry.isDirectory && entry.name !== ".") {
          try {
            await Deno.remove(`${CACHE_DIR}/${entry.name}`, {
              recursive: true,
            });
          } catch {
            // Directory not empty, skip
          }
        }
      }
    } catch {
      // Ignore errors during directory cleanup
    }

    await saveCacheMetadata();
  }
}

// Save tile to file cache and track size
async function setFileCache(
  z: string,
  x: string,
  y: string,
  data: Uint8Array,
) {
  try {
    const path = getCachePath(z, x, y);
    const dir = `${CACHE_DIR}/${z}/${x}`;
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeFile(path, data);

    // Update metadata
    const key = getMetadataKey(z, x, y);
    const size = data.byteLength;

    // If tile already existed, subtract old size
    if (cacheMetadata.tiles[key]) {
      cacheMetadata.totalSize -= cacheMetadata.tiles[key].size;
    }

    cacheMetadata.tiles[key] = { size, accessTime: Date.now() };
    cacheMetadata.totalSize += size;

    await saveCacheMetadata();

    // Check if we need to evict tiles
    await evictOldestTiles();
  } catch (error) {
    console.error("Error writing cache file:", error);
  }
}

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const z = url.searchParams.get("z");
    const x = url.searchParams.get("x");
    const y = url.searchParams.get("y");

    if (!z || !x || !y) {
      return new Response("Missing z, x, or y parameter", { status: 400 });
    }
    const API_KEY = Deno.env.get("OS_MAPS_API_KEY");
    if (!API_KEY) {
      console.warn("OS_MAPS_API_KEY environment variable not set");
      return new Response("API key not configured", { status: 500 });
    }

    try {
      // Check memory cache first
      let tileData = getMemoryCache(z, x, y);

      if (!tileData) {
        // Check file cache
        tileData = await getFileCache(z, x, y);
      }

      // If not in cache, fetch from API
      if (!tileData) {
        const tileUrl =
          `https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/${z}/${x}/${y}.png?key=${API_KEY}`;
        const response = await fetch(tileUrl);

        if (!response.ok) {
          return new Response("Failed to fetch tile", {
            status: response.status,
          });
        }

        tileData = new Uint8Array(await response.arrayBuffer());

        // Store in both caches
        setMemoryCache(z, x, y, tileData);
        await setFileCache(z, x, y, tileData);
      }

      return new Response(tileData, {
        headers: {
          "content-type": "image/png",
          "cache-control": `public, max-age=${CACHE_TTL_MS / 1000}`,
        },
      });
    } catch (error) {
      console.error("Error fetching map tile:", error);
      return new Response("Error fetching tile", { status: 500 });
    }
  },
};

// Initialize cache directory and metadata on startup
ensureCacheDir().catch((err) =>
  console.error("Failed to create cache dir:", err)
);
loadCacheMetadata().catch((err) =>
  console.error("Failed to load cache metadata:", err)
);
