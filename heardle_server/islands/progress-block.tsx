import { JSX } from "preact";

import {GuessInfoProps, PastGuess} from "./islandProps.d.ts";
import {guessResult} from "./islandProps.ts";
import {getSubtitleForSong} from "../helpers.tsx";

const GuessStatusComponent = (
  props: JSX.IntrinsicAttributes & { guess: PastGuess, componentIndex: number, activeIndex: number, correctIndex: number }
) => {
  let classStyle = "p-2 w-full text-center rounded transition-color duration-500 ";
  const guessedSong = props.guess.song;
  let resultText: string;

  switch (props.guess.result) {  // todo: make current guess bigger (shrink others)
    case guessResult.NONE:
      if (props.correctIndex !== -1 && props.componentIndex >= props.correctIndex) {  // If the guess is after a correct one
        classStyle += "bg-gray-300";
      } else if (props.componentIndex === props.activeIndex) {
        classStyle += "bg-sky-500 border-2 border-black";
      } else {
        classStyle += "bg-sky-200";
      }
      resultText = "\u00A0";  // Non-breaking space for empty state
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
      {guessedSong && (<div class=""><span class="font-semibold">{guessedSong.name}</span> by {getSubtitleForSong(guessedSong)}</div>)}
      <div class="text-xs">{resultText}</div>
    </div>
  );
};

export default function ProgressBlock(props: GuessInfoProps) {
  const correctIndex = props.history.value.findIndex(item => item.result === guessResult.CORRECT);
  const activeGuess = props.current.value;

  return ( // todo: stop width resizing when new guess is added
    <div class="m-2 flex flex-col items-center gap-2">
      {props.history.value.map((item, index) =>
        <GuessStatusComponent key={index} guess={item} componentIndex={index} activeIndex={activeGuess} correctIndex={correctIndex} />
      )}
    </div>
  )
}
