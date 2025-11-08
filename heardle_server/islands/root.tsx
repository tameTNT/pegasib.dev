import { useSignal, useSignalEffect } from "@preact/signals";
import { useState } from "preact/hooks";

import GuessBar from "./guess-bar.tsx";
import SongBar from "./song-bar.tsx";
import ProgressBlock from "./progress-block.tsx";
import { gameArtistInfo, guessResult, PastGuess } from "../enums.ts";
import { checkStorageAvailable, hasWon } from "../helpers.tsx";
import ShareButton from "./share-button.tsx";
import ToggleSelect from "../components/ToggleSelect.tsx";

export default function Root(
  { version, availableArtists, maxGuesses }: {
    version: string;
    availableArtists: gameArtistInfo[];
    maxGuesses: number;
  },
) {
  const [isGameOver, setIsGameOver] = useState(false);

  const artistIndex = useSignal(0);

  // Work out the current date (and the next date) in UTC to avoid timezone issues
  const now = new Date();
  const currentDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ); // Midnight UTC
  const tmrwDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add one day
  // const dateFormatter = new Intl.DateTimeFormat(undefined, { // undefined uses user's locale
  //   timeStyle: "short",
  //   dateStyle: "medium",
  //   hour12: false
  // });
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };

  // Set up the starting game state
  const currentGuess = useSignal(0);
  const guessHistory = useSignal<PastGuess[]>(
    Array(maxGuesses).fill({ song: undefined, result: guessResult.NONE }),
  );
  // Load previous game state from localStorage if available
  if (checkStorageAvailable("localStorage")) {
    const storedDate = Number(localStorage.getItem("gameDate"));
    const storedCurrentGuess = Number(localStorage.getItem("currentGuess"));
    if (storedDate == currentDate.getTime() && storedCurrentGuess > 0) {
      currentGuess.value = storedCurrentGuess;
      guessHistory.value = JSON.parse(
        localStorage.getItem("guessHistory") || "[]",
      );
      console.debug("Loaded previous game state from localStorage.");
    }
  }

  useSignalEffect(() => { // Runs whenever currentGuess or guessHistory changes
    if (checkStorageAvailable("localStorage")) {
      localStorage.setItem("gameDate", String(currentDate.getTime()));
      localStorage.setItem("currentGuess", String(currentGuess.value));
      localStorage.setItem("guessHistory", JSON.stringify(guessHistory.value));
    }
  });

  useSignalEffect(() => { // Runs whenever history or current guess changes (including on localStorage load)
    if (hasWon(guessHistory.value) || currentGuess.value >= maxGuesses) {
      setIsGameOver(true); // Disable guessing if max guesses reached
    }
  });

  const currentArtist = availableArtists[artistIndex.value];

  // todo: LOONA background/styling
  return ( // todo: show spotify embed on win (https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)
    <>
      <a
        href="https://github.com/tameTNT/pegasib.dev/tree/main/heardle_server"
        target="_blank"
        class="cursor-pointer absolute top-1 left-1 flex flex-col items-center dark:invert"
      >
        <img
          src="github_icon.svg"
          alt="The GitHub Icon"
          class="h-5"
        />
        <p class="text-gray-900 text-xs italic">{version}</p>
      </a>
      <div class="mx-auto flex flex-col h-screen justify-between items-center">
        <main class="text-center w-3/4 md:w-1/2">
          {availableArtists.length > 1 && (
            <ToggleSelect
              currentIndex={artistIndex}
              options={availableArtists.map((a) => a.name)}
              disabled={currentGuess.value > 0 && !isGameOver}
            />
          )}
          <h1 class="text-5xl/[1.2]">{currentArtist.name} Heardle</h1>
          <h2 class="">{currentArtist.blurb}</h2>
          <p class="italic text-xs">
            Next new song at{" "}
            <abbr title={tmrwDate.toLocaleString([])}>
              {tmrwDate.toLocaleTimeString([], timeOptions)}
            </abbr>.
            {/* todo: fix abbr no hover display on mobile devices */}
          </p>
          <p class="italic text-xs">
            <a href={`/api/${currentArtist.name}/list`} target="_blank">
              List of tracks.
            </a>{" "}
            All audio courtesy of{" "}
            <a
              href={currentArtist.playlist_url}
              target="_blank"
            >
              Spotify
            </a>.
          </p>
          {/* todo: update props of these to just pass one struct? */}
          <ProgressBlock
            max={maxGuesses}
            current={currentGuess}
            history={guessHistory}
            artistForGame={currentArtist}
          />
          <ShareButton
            gameIsOver={isGameOver}
            gameTitle={`${currentArtist.name} Heardle`}
            currentDate={currentDate}
            history={guessHistory}
          />
        </main>
        <footer class="sticky bottom-0 w-full bg-gray-500/60 dark:bg-sky-200/60 transition-color duration-300 flex flex-col items-center p-2 gap-2">
          <SongBar
            max={maxGuesses}
            current={currentGuess}
            history={guessHistory}
            artistForGame={currentArtist}
          />
          <GuessBar
            max={maxGuesses}
            current={currentGuess}
            history={guessHistory}
            isGameOver={isGameOver}
            artistForGame={currentArtist}
          />
        </footer>
      </div>
    </>
  );
}
