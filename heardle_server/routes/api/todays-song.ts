import { FreshContext } from "$fresh/server.ts";
import { randomSeeded, shuffle } from "@std/random";
import * as pathTools from "node:path";
import * as os from "node:os";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const START_DATE = new Date(Date.UTC(2025, 7, 25)); // when adding a new song, step back accordingly to account for it

function loadSongData(): Array<object> {
  const decoder = new TextDecoder("utf-8");

  const dataPath = pathTools.resolve(os.homedir(), "loona_track_info.json");
  const rawData = Deno.readFileSync(dataPath);
  const jsonData = decoder.decode(rawData);

  return JSON.parse(jsonData);
}

function randomDateIndex(max: number) {
  const todaysDate = new Date();

  const daysDiff = Math.ceil(
    Math.abs(todaysDate.getTime() - START_DATE.getTime()) / MS_PER_DAY,
  );

  const indices = Array.from({ length: max }, (_, i) => i);
  const shuffledIndices = shuffle(indices, { prng: randomSeeded(42n) });

  return shuffledIndices[daysDiff % max]; // todo: only works if the underlying array remains the same length...
}

export const handler = (_req: Request, _ctx: FreshContext): Response => {
  const body = loadSongData();
  const selectedIndex = randomDateIndex(body.length);
  return new Response(JSON.stringify(body[selectedIndex]));
};
