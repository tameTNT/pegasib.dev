import { Signal } from "@preact/signals";

import { gameArtistInfo, PastGuess } from "../enums.ts";

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<PastGuess[]>;
  artistForGame: Signal<gameArtistInfo>;
}

interface CheckApiResponse {
  isCorrect: boolean;
  songData: Song;
  correctSong?: Song;
}
