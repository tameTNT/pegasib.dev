import {Signal} from "@preact/signals";

import {PastGuess} from "../enums.ts";

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<PastGuess[]>;
}

interface CheckApiResponse {
  isCorrect: boolean;
  songData: Song;
  correctSong?: Song;
}
