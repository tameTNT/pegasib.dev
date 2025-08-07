import { useState } from "preact/hooks";

import SearchBar from "../components/SearchBar.tsx";
import Button from "../components/Button.tsx";

import { CheckApiResponse, GuessInfoProps } from "./islandProps.d.ts";
import { guessResult } from "./islandProps.ts";
import {makeArtistString} from "../helpers.tsx";

export default function GuessBar(props: GuessInfoProps) {
  const [isOver, setIsOver] = useState(false);

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

    fetch(`/api/todays-song/check?id=${guessedId}&isFinal=${props.current.value + 1 == props.max}`)
      .then((res) => {
        if (res.ok) {
          return res.json() as unknown as CheckApiResponse;
        } else {
          throw new Error(`Status ${res.status} | ${res.statusText}`);
        }
      })
      .then(({ isCorrect, songData, correctSong }) => {
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
          setIsOver(true);
          alert(`🥳 Well Done! See you tomorrow 👋`);
        }  else if (props.current.value >= props.max) {
          if (!correctSong) throw new Error("No correctSong returned by API, but max guesses reached.");
          alert(`😢 You have used all ${props.max} guesses. Better luck tomorrow!\nThe answer was ${correctSong.name} by ${makeArtistString(correctSong.artists)} on ${correctSong.album.name}.`);
        } // todo: add answer to page permanently, so it can be seen after the game is over
      }).catch((err) => console.error(`Error while verifying guess: ${err}.`));
  }

  return ( // todo: this is too wide and overflows on tall phones (to the left) - make sure both are right aligned
    <div class="flex justify-center w-80">
      <div class="flex flex-row align-center gap-1">
        <div class="flex-1">
          <SearchBar
            placeholder="Search by title, album, or artist"
            size={25}
            guessCount={props.current}
            disabled={isOver}
          />
        </div>
        <Button
          type="button"
          class="rounded"
          onClick={handleGuess}
          disabled={isOver}
        >
          Guess!
        </Button>
      </div>
    </div>
  );
} // todo: still breaks on very narrow viewports like Fold due to fixed input width
