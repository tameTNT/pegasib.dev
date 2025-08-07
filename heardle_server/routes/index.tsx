import { signal } from "@preact/signals";

import GuessBar from "../islands/guess-bar.tsx";
import SongBar from "../islands/song-bar.tsx";
import ProgressBlock from "../islands/progress-block.tsx";
import { PastGuess } from "../islands/islandProps.d.ts";
import { guessResult } from "../islands/islandProps.ts";

export default function Home() {
  const MAX_GUESSES = 6; // total number of guesses allowed
  const currentGuess = signal(0); // todo: save local state with cookies to preserve on reload
  const guessHistory = signal<PastGuess[]>(
    Array(MAX_GUESSES).fill({ song: undefined, result: guessResult.NONE }),
  );

  const now = new Date();
  let nextDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // Midnight UTC
  nextDay = new Date(nextDay.getTime() + 24 * 60 * 60 * 1000); // Add one day
  // const dateFormatter = new Intl.DateTimeFormat(undefined, { // undefined uses user's locale
  //   timeStyle: "short",
  //   dateStyle: "medium",
  //   hour12: false
  // });
  const timeOptions: Intl.DateTimeFormatOptions = { hour12: false, hour: "2-digit", minute: "2-digit" }

  // todo: auto dark theme
  // todo: LOONA background/styling
  return ( // todo: show spotify embed on win (https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)
    <>
      <div class="absolute top-1 left-1 flex flex-col items-center">
        <a
          href="https://github.com/tameTNT/pegasib.dev/tree/main/heardle_server"
          target="_blank"
          class="cursor-pointer"
        >
          <img
            src="github_icon.svg"
            alt="The GitHub Icon"
            class="h-5"
          />
        </a>
        <p class="text-gray-900 text-xs italic">v1.1.0</p>
      </div>
      <div class="mx-auto flex flex-col h-screen justify-between items-center">
        <main class="text-center w-3/4 md:w-1/2">
          <h1 class="text-4xl">LOOΠ∆ Heardle</h1>
          <h2 class="text-lg">New song every day at {nextDay.toLocaleTimeString([], timeOptions)}!</h2>
          <p>Includes solo, subunit, and all post-BBC tracks (up to Soft Error).</p>
          <p class="italic text-xs">
            <a href="/api/list" target="_blank">List of tracks. </a>
            All audio courtesy of <a href="https://open.spotify.com/playlist/05bRCDfqjNVnysz17hocZn" target="_blank">Spotify</a>.
          </p>
          <ProgressBlock
            max={MAX_GUESSES}
            current={currentGuess}
            history={guessHistory}
          />
        </main>
        <footer class="sticky bottom-0 w-full bg-gray-500/40 transition-color duration-300 flex flex-col items-center p-2 gap-1">
          <SongBar
            max={MAX_GUESSES}
            current={currentGuess}
            history={guessHistory}
          />
          <GuessBar
            max={MAX_GUESSES}
            current={currentGuess}
            history={guessHistory}
          />
        </footer>
      </div>
    </>
  ); // todo: add share button to share/copy results text
}
