import { FreshContext } from "$fresh/server.ts";

import pathTools from "node:path";
import os from "node:os";

function loadSongData(artist: string): Array<Song> {
  const decoder = new TextDecoder("utf-8");

  const dataPath = pathTools.resolve(os.homedir(), `heardle_${artist}_track_info.json`);
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
  if (["LOONA", "GFriend"].indexOf(ctx.params.artist) < 0) {
    return new Response(`Invalid artist name: '${ctx.params.artist}'.`, { status: 400 }); // Return Bad Request status
  }
  try {
    ctx.state.songData = loadSongData(ctx.params.artist);
    return ctx.next();
  } catch (_error) {
    return new Response("Failed to load song data.", { status: 500 }); // Return an Internal Server Error
  }
};
