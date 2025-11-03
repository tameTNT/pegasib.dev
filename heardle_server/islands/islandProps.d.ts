import { Signal } from "@preact/signals";

import {PastGuess, gameArtistInfo} from "../enums.ts";

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<PastGuess[]>;
  artistForGame: gameArtistInfo;
}

interface CheckApiResponse {
  isCorrect: boolean;
  songData: Song;
  correctSong?: Song;
}
