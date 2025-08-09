import { FreshContext } from "$fresh/server.ts";

import pathTools from "node:path";
import os from "node:os";

function loadSongData(): Array<Song> {
  const decoder = new TextDecoder("utf-8");

  const dataPath = pathTools.resolve(os.homedir(), "loona_track_info.json");
  try {
    const rawData = Deno.readFileSync(dataPath);
    const jsonData = decoder.decode(rawData);
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error which loading song data from disk:", error);
    throw error;
  }
}

export const handler = (_req: Request, ctx: FreshContext<SongDataState>) => {
  try {
    ctx.state.songData = loadSongData();
    return ctx.next();
  } catch (_error) {
    return new Response("Failed to load song data.", {status: 500}); // Return an Internal Server Error
  }
};
