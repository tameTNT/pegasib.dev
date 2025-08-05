import { SearchBar } from "../components/SearchBar.tsx";
import {Button} from "../components/Button.tsx";

import {GuessInfoProps} from "./islandProps.d.ts";


export default function GuessBar(props: GuessInfoProps) {
  function handleGuess(){
    // Handle the guess submission logic here
    const idElement = document.getElementById("songId");
    if (!idElement) return;

    const guessedId = idElement.textContent;
    if (!guessedId) return;  // No song selected, do nothing

    fetch(`/api/todays-song/check?id=${guessedId}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Status ${res.status} | ${res.statusText}`);
        }
      })
      .then((isCorrect: boolean) => {
        // console.log(`guess count=${props.current.value}`, isCorrect);
        if (props.current.value >= props.max) return;

        // Update the history via a new array to trigger reactivity signal
        const newHistory = [...props.history.value];
        newHistory[props.current.value] = isCorrect;
        props.history.value = newHistory;

        props.current.value++;
      })
      .catch(err => console.error(`Error while verifying guess: ${err}.`));
  }

  return (
    <div class="flex justify-center w-80">
      <div class="flex flex-row align-center gap-1">
        <div class="flex-1"><SearchBar placeholder="Search by title, album, or artist" size={25} guessCount={props.current}/></div>
        <Button type="button" class="rounded" onClick={handleGuess}>Guess!</Button>
      </div>
    </div>
  );
} // todo: still breaks on very narrow viewports like Fold due to fixed input width
