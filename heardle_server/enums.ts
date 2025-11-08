export enum guessResult {
  NONE = "none",
  INCORRECT = "incorrect",
  SKIPPED = "skipped",
  CORRECT = "correct",
}

export interface PastGuess {
  song?: Song;
  result: guessResult;
}

export interface gameArtistInfo {
  name: string;
  blurb: string;
  playlist_url: string;
}
