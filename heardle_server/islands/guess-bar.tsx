import { useState } from "preact/hooks";

import SearchBar from "../components/SearchBar.tsx";
import Button from "../components/Button.tsx";

import { CheckApiResponse, GuessInfoProps } from "./islandProps.d.ts";
import { guessResult } from "./islandProps.ts";

export default function GuessBar(props: GuessInfoProps) {
  const [hasWon, setHasWon] = useState(false);

  function handleGuess() {
    // Handle the guess submission logic here
    const idElement = document.getElementById("songId");
    if (!idElement) return;

    const guessedId = idElement.textContent;
    if (!guessedId) return; // No song selected, do nothing

    if (props.history.value.some((guess) => guess.song?.id === guessedId)) {
      alert("You have already guessed this song!"); // todo: show modals instead of alerts
      return; // todo: strange bug where I can't click on input without first clicking somewhere else
    }

    fetch(`/api/todays-song/check?id=${guessedId}`)
      .then((res) => {
        if (res.ok) {
          return res.json() as unknown as CheckApiResponse;
        } else {
          throw new Error(`Status ${res.status} | ${res.statusText}`);
        }
      })
      .then(({ isCorrect, songData }) => {
        // console.log(`guess count=${props.current.value}`, isCorrect);
        if (props.current.value >= props.max) return;

        // Update the history by redefining array to trigger reactivity signal
        const newHistory = [...props.history.value];
        if (isCorrect) {
          newHistory[props.current.value] = {
            song: songData,
            result: guessResult.CORRECT,
          };
        } else {
          newHistory[props.current.value] = {
            song: songData,
            result: guessResult.INCORRECT,
          };
        }
        props.history.value = newHistory;

        props.current.value++;

        const footerEl = document.querySelector("footer");
        if (footerEl) {
          const colorFlash = isCorrect ? "bg-green-500/40" : "bg-red-500/40";
          footerEl.classList.add(colorFlash);
          if (!isCorrect) { // Only flash red if incorrect; stay green on correct guess
            setTimeout(() => {
              footerEl.classList.remove(colorFlash);
            }, 1000);
          }
        }

        if (isCorrect) {
          setHasWon(true);
          alert(`Well Done! Come back tomorrow (UTC) for a new song!`);
        }
      })
      .catch((err) => console.error(`Error while verifying guess: ${err}.`));
  }

  return (
    <div class="flex justify-center w-80">
      <div class="flex flex-row align-center gap-1">
        <div class="flex-1">
          <SearchBar
            placeholder="Search by title, album, or artist"
            size={25}
            guessCount={props.current}
            disabled={hasWon}
          />
        </div>
        <Button
          type="button"
          class="rounded"
          onClick={handleGuess}
          disabled={hasWon}
        >
          Guess!
        </Button>
      </div>
    </div>
  );
} // todo: still breaks on very narrow viewports like Fold due to fixed input width
