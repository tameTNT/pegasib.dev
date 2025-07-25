import { FreshContext } from "$fresh/server.ts";
import { randomSeeded, shuffle } from "@std/random";
import * as pathTools from "node:path";
import * as os from "node:os";


const MILLISENDS_IN_DAY = 24 * 60 * 60 * 1000;

function loadSongData(): Array<object> {
  const decoder = new TextDecoder("utf-8");

  const dataPath = pathTools.resolve(os.homedir(), "loona_track_info.json")
  const rawData = Deno.readFileSync(dataPath);
  const jsonData = decoder.decode(rawData);

  return JSON.parse(jsonData);
}

function randomDateIndex(max: number) {
  // for(let i = 0; i < 2*max; i++) {
  const startDate = new Date(Date.UTC(2025, 7, 25));
  const todayDate = new Date();
  // const todayDate = new Date(Date.UTC(2025, 7, 25) + i*MILLISENDS_IN_DAY);
  const daysDiff = Math.ceil(Math.abs(todayDate.getTime() - startDate.getTime()) / MILLISENDS_IN_DAY);

  const indices = Array.from({length: max}, (_, i) => i);
  const shuffledIndices = shuffle(indices, {prng: randomSeeded(42n)});
    // console.log(indices[daysDiff % max]);
  // }

  return shuffledIndices[daysDiff % max];  // todo: only works if the underlying array remains the same length...
}

export const handler = (_req: Request, _ctx: FreshContext): Response => {
  // const randomIndex = Math.floor(Math.random() * JOKES.length);
  const body = loadSongData();
  const selectedIndex = randomDateIndex(body.length);
  return new Response(JSON.stringify(body[selectedIndex]));
};
