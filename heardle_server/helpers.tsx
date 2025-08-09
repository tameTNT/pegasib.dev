import { PastGuess } from "./islands/islandProps.d.ts";
import { guessResult } from "./islands/islandProps.ts";

export function makeArtistString(artists: { name: string }[]): string {
  return artists.map((artist) => artist.name).join(", ");
}

export function getSubtitleForSong(song: Song) {
  return (
    <>
      <i>{makeArtistString(song.artists)}</i> on <i>{song.album.name}</i>
    </>
  );
}

export function hasWon(history: PastGuess[]): boolean {
  return history.some((guess) => guess.result === guessResult.CORRECT);
}

export function makeErrorMessage(response: Response): string {
  // Return the status and statusText, and the response body as text
  return `status ${response.status} (${response.statusText})`;
}
