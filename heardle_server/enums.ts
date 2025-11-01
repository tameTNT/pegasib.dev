export enum guessResult {
  NONE = "none",
  INCORRECT = "incorrect",
  SKIPPED = "skipped",
  CORRECT = "correct",
}

export enum supportedArtist {
  LOONA = "loona",
  GFRIEND = "gfriend",
}

export interface PastGuess {
  song?: Song;
  result: guessResult;
}
