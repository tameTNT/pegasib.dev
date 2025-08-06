import { PastGuess } from "./islands/islandProps.d.ts";
import { guessResult } from "./islands/islandProps.ts";

export function subtitleForSong(song: Song){
  return <><i>{song.artists.map(artist => artist.name).join(", ")}</i> on <i>{song.album.name}</i></>;
}

export function hasWon(history: PastGuess[]): boolean {
  return history.some(guess => guess.result === guessResult.CORRECT);
}