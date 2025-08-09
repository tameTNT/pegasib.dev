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