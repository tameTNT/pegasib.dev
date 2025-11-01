import { Signal } from "@preact/signals";

import {PastGuess, supportedArtist} from "../enums.ts";

interface GuessInfoProps {
  max: number;
  current: Signal<number>;
  history: Signal<PastGuess[]>;
  artistVariant: supportedArtist;
}

interface CheckApiResponse {
  isCorrect: boolean;
  songData: Song;
  correctSong?: Song;
}
