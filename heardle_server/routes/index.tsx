import { signal } from '@preact/signals';

import GuessBar from "../islands/guess-bar.tsx";
import SongBar from "../islands/song-bar.tsx";
import ProgressBlock from "../islands/progress-block.tsx";
import {PastGuess} from "../islands/islandProps.d.ts";
import {guessResult} from "../islands/islandProps.ts";

export default function Home() {
  const MAX_GUESSES = 6; // 6 guesses in total (guess number 0-5)
  const currentGuess = signal(0);  // todo: save local state with cookies to preserve on reload
  const guessHistory = signal<PastGuess[]>(
    Array(MAX_GUESSES).fill({song: undefined, result: guessResult.NONE})
  );

  // todo: auto dark theme
  return (  // todo: show spotify embed on win (https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)
    <>
      <a href="https://github.com/tameTNT/pegasib.dev/tree/main/heardle_server" target="_blank" class="cursor-pointer">
        <img src="github_icon.svg" alt="The GitHub Icon" class="absolute top-1 left-1 h-5"/>
      </a>
      <div class="mx-auto flex flex-col h-screen justify-between items-center">
        <main class="text-center w-3/4 md:w-1/2">
          <h1 class="text-4xl">LOOΠ∆ Heardle</h1>
          <p>Includes solo, subunit, and all post-BBC tracks.</p>
          <p>
            <a href="/api/list" target="_blank" class="italic max-md:underline md:hover:underline">See all tracks.</a>
          </p>
          <p class="italic text-xs">All audio courtesy of Spotify.</p>
          <ProgressBlock max={MAX_GUESSES} current={currentGuess} history={guessHistory}/>
        </main>
        <footer class="sticky bottom-0 w-full bg-gray-500/40 flex flex-col items-center p-2 gap-1">
          <SongBar max={MAX_GUESSES} current={currentGuess} history={guessHistory}/>
          <GuessBar max={MAX_GUESSES} current={currentGuess} history={guessHistory}/>
        </footer>
      </div>
    </>
  );
}
