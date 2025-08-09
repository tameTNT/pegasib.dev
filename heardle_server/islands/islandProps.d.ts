import { Signal } from "@preact/signals";

import { guessResult } from "../enums.ts";

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<PastGuess[]>;
}

interface PastGuess {
  song?: Song;
  result: guessResult;
}

interface CheckApiResponse {
  isCorrect: boolean;
  songData: Song;
  correctSong?: Song;
}
