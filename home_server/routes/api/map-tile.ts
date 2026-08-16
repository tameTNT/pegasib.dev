import { Handlers } from "$fresh/server.ts";

const API_KEY = Deno.env.get("OS_MAPS_API_KEY");

if (!API_KEY) {
  console.warn("OS_MAPS_API_KEY environment variable not set");
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

    if (!API_KEY) {
      return new Response("API key not configured", { status: 500 });
    }

    try {
      const tileUrl =
        `https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/${z}/${x}/${y}.png?key=${API_KEY}`;
      const response = await fetch(tileUrl);

      if (!response.ok) {
        return new Response("Failed to fetch tile", {
          status: response.status,
        });
      }

      const imageData = await response.arrayBuffer();
      return new Response(imageData, {
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=86400",
        },
      });
    } catch (error) {
      console.error("Error fetching map tile:", error);
      return new Response("Error fetching tile", { status: 500 });
    }
  },
};
