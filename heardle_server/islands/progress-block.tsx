import { JSX } from "preact";

import {GuessInfoProps, PastGuess} from "./islandProps.d.ts";
import {guessResult} from "./islandProps.ts";
import {subtitleForSong} from "../helpers.tsx";

const GuessStatusComponent = (props: JSX.IntrinsicAttributes & { guess: PastGuess, guessNumber: number }) => {
  let classStyle = "p-2 w-2/3 text-center rounded transition-color duration-500 ";
  const guessedSong = props.guess.song;
  let resultText: string;

  switch (props.guess.result) {  // todo: make current guess bigger (shrink others)
    case guessResult.NONE:
      classStyle += "bg-sky-200 text-black";
      resultText = `Guess ${props.guessNumber}`;
      break;
    case guessResult.INCORRECT:
      classStyle += "bg-red-400 text-white";
      resultText = "Incorrect";
      break;
    case guessResult.SKIPPED:
      classStyle += "bg-orange-400 text-black";
      resultText = "Skipped";
      break;
    case guessResult.CORRECT:
      classStyle += "bg-green-400 text-white";
      resultText = "Correct!";
      break;
  }

  return (
    // todo: add album art
    // todo: fix resizing glitch when text is loaded?
    <div {...props} class={classStyle}>
      <div class="font-medium">{resultText}</div>
      {guessedSong && (<div class="text-xs">{guessedSong.name} by {subtitleForSong(guessedSong)}</div>)}
    </div>
  );
};

export default function ProgressBlock(props: GuessInfoProps) {
  return ( // todo: stop width resizing when new guess is added
    <div class="m-2 flex flex-col items-center gap-2">
      {props.history.value.map((item, index) =>
        <GuessStatusComponent key={index} guess={item} guessNumber={index + 1} />
      )}
    </div>
  )
}
