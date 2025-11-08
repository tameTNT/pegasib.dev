import { FreshContext } from "$fresh/server.ts";
import { randomSeeded, shuffle } from "@std/random";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const START_DATE = new Date(Date.UTC(2025, 6, 25)); // when adding a new song, step back accordingly to account for it
const REPETITIONS = 20; // cycle won't repeat for approx 10 years if array is 200 items long

function randomDateIndex(max: number) {
  const todaysDate = new Date(); // getTime is in UTC, so no need to convert

  const daysDiff = Math.ceil(
    Math.abs(todaysDate.getTime() - START_DATE.getTime()) / MS_PER_DAY,
  );

  const indices = Array.from({ length: max * REPETITIONS }, (_, i) => i % max);
  const shuffledIndices = shuffle(indices, { prng: randomSeeded(42n) });

  return shuffledIndices[daysDiff % max]; // todo: only works if the underlying array remains the same length...
}

export const handler = (
  _req: Request,
  ctx: FreshContext<SongDataWithIndexState>,
) => {
  ctx.state.selectedIndex = randomDateIndex(ctx.state.songData.length);
  // todo: add logs to server side
  return ctx.next();
};
