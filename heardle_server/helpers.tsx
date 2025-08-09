import { guessResult, PastGuess } from "./enums.ts";

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

export function checkStorageAvailable(
  storageType: "localStorage" | "sessionStorage",
): boolean | undefined {
  // Check if the storage type is supported and available
  // Adapted from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  let storage;
  try {
    storage = globalThis[storageType];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
