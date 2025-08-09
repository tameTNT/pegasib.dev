import { useState } from "preact/hooks";

import SearchBar from "../components/SearchBar.tsx";
import Button from "../components/Button.tsx";

import { CheckApiResponse, GuessInfoProps } from "./islandProps.d.ts";
import { guessResult } from "./islandProps.ts";
import { hasWon, makeArtistString, makeErrorMessage } from "../helpers.tsx";
import { useSignalEffect } from "@preact/signals";

export default function GuessBar(props: GuessInfoProps) {
  const [isOver, setIsOver] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function handleGuess() {
    // Handle the guess submission logic here
    const idElement = document.getElementById("songId");
    if (!idElement) return;

    const guessedId = idElement.textContent;
    if (!guessedId) return; // No song selected, do nothing

    if (props.history.value.some((guess) => guess.song?.id === guessedId)) {
      alert("You have already guessed that song!"); // todo: show modals instead of alerts (easier now that root is an island)
      setInputValue(""); // Clear input field
      return; // todo: strange bug where I can't click on input without first clicking somewhere else
    }

    fetch(`/api/todays-song/check?id=${guessedId}&isFinal=${props.current.value + 1 == props.max}`)
      .then((response) => {
        if (response.ok) {
          return response.json() as unknown as CheckApiResponse;
        } else {
          throw new Error(makeErrorMessage(response));
        }
      }).then(({ isCorrect, songData, correctSong }) => {
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

        props.current.value++; // Increment the current guess count

        // Flash the footer background color based on the guess result
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

        // Show an alert if the guess is correct or if the max guesses have been reached
        if (isCorrect) {
          alert(`🥳 Well Done! See you tomorrow 👋`);
        } else if (props.current.value >= props.max) {
          if (!correctSong) throw new Error("No correctSong returned by API, but max guesses reached.");
          alert(`😢 You have used all ${props.max} guesses. Better luck tomorrow!\nThe answer was ${correctSong.name} by ${makeArtistString(correctSong.artists)} on ${correctSong.album.name}.`);
        } // todo: add answer to page permanently, so it can be seen after the game is over (could be saved to localStorage?)
      }).catch((err) => {
        alert("Unable to verify guess on the server. Please try again later.");
        console.error(`Error while verifying guess: ${err}.`);
      });
  }

  useSignalEffect(() => { // Runs whenever history or current guess changes (including on localStorage load)
    if (hasWon(props.history.value) || props.current.value >= props.max) {
      setIsOver(true); // Disable guessing if max guesses reached
    }
  })

  return (
    <div class="flex flex-row align-middle justify-center gap-1 w-4/5 md:w-1/2">
      <div class="w-4/5 md:w-full">
        <SearchBar
          placeholder="Search by title, album or artist"
          name="songName"
          guessCount={props.current}
          disabled={isOver}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
      <div class="">
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
}
