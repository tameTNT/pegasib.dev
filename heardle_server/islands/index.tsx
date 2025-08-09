import { signal, useSignalEffect } from "@preact/signals";

import GuessBar from "./guess-bar.tsx";
import SongBar from "./song-bar.tsx";
import ProgressBlock from "./progress-block.tsx";
import { PastGuess } from "./islandProps.d.ts";
import { guessResult } from "./islandProps.ts";
import { checkStorageAvailable } from "../helpers.tsx";

export default function Index() {
  const now = new Date();
  const currentDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // Midnight UTC
  const nextDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000); // Add one day
  // const dateFormatter = new Intl.DateTimeFormat(undefined, { // undefined uses user's locale
  //   timeStyle: "short",
  //   dateStyle: "medium",
  //   hour12: false
  // });
  const timeOptions: Intl.DateTimeFormatOptions = { hour12: false, hour: "2-digit", minute: "2-digit" }

  const MAX_GUESSES = 6; // total number of guesses allowed

  const currentGuess = signal(0);
  const guessHistory = signal<PastGuess[]>(
    Array(MAX_GUESSES).fill({ song: undefined, result: guessResult.NONE }),
  );
  // Load previous game state from localStorage if available
  if (checkStorageAvailable("localStorage")) {
    const storedDate = Number(localStorage.getItem("gameDate"));
    const storedCurrentGuess = Number(localStorage.getItem("currentGuess"));
    if (storedDate == currentDay.getTime() && storedCurrentGuess > 0) {
      currentGuess.value = storedCurrentGuess;
      guessHistory.value = JSON.parse(localStorage.getItem("guessHistory") || "[]");
      console.log("Loaded previous game state from localStorage.");
    }
  }

  useSignalEffect(() => { // Runs whenever currentGuess or guessHistory changes
    if (checkStorageAvailable("localStorage")) {
      const now = new Date();
      const currentDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      localStorage.setItem("gameDate", String(currentDay.getTime()));
      localStorage.setItem("currentGuess", String(currentGuess.value));
      localStorage.setItem("guessHistory", JSON.stringify(guessHistory.value));
    }
  })

  // todo: LOONA background/styling
  return ( // todo: show spotify embed on win (https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)
    <>
      <div class="absolute top-1 left-1 flex flex-col items-center dark:invert">
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
          <h1 class="text-5xl">LOONA Heardle</h1>
          <h2 class="">Includes solo, subunit, and all post-BBC tracks (up to Soft Error)</h2>
          <p class="italic text-xs">Next new song at <abbr title={nextDay.toLocaleString()}>{nextDay.toLocaleTimeString([], timeOptions)}</abbr>.</p>
          <p class="italic text-xs">
            <a href="/api/list" target="_blank">List of tracks.</a>{" "}
            All audio courtesy of <a href="https://open.spotify.com/playlist/05bRCDfqjNVnysz17hocZn" target="_blank">Spotify</a>.
          </p>
          <ProgressBlock
            max={MAX_GUESSES}
            current={currentGuess}
            history={guessHistory}
          />
        </main>
        <footer class="sticky bottom-0 w-full bg-gray-500/40 dark:bg-sky-200/40 transition-color duration-300 flex flex-col items-center p-2 gap-1">
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
