import { FreshContext } from "$fresh/server.ts";

import pathTools from "node:path";
import os from "node:os";

function loadSongData(): Array<Song> {
  const decoder = new TextDecoder("utf-8");

  const dataPath = pathTools.resolve(os.homedir(), "loona_track_info.json");
  const rawData = Deno.readFileSync(dataPath);
  const jsonData = decoder.decode(rawData);

  return JSON.parse(jsonData);
}

export const handler = (_req: Request, ctx: FreshContext<SongDataState>) => {
  ctx.state.songData = loadSongData();
  return ctx.next();
};
