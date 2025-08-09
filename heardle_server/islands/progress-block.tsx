import { JSX } from "preact";
import { useSignalEffect } from "@preact/signals";

import { GuessInfoProps, PastGuess } from "./islandProps.d.ts";
import { guessResult } from "../enums.ts";
import { getSubtitleForSong } from "../helpers.tsx";

const GuessStatusComponent = (
  props: JSX.IntrinsicAttributes & {
    guess: PastGuess;
    componentIndex: number;
    activeIndex: number;
    correctIndex: number;
  },
) => {
  let classStyle =
    "p-2 w-full text-center rounded transition-color transition-border duration-500 ";
  const guessedSong = props.guess.song;
  let resultText: string;

  switch (props.guess.result) {
    case guessResult.NONE:
      if (
        props.correctIndex !== -1 && props.componentIndex >= props.correctIndex
      ) { // If the guess is after a correct one
        classStyle += "bg-gray-400";
      } else if (props.componentIndex === props.activeIndex) {
        classStyle += "bg-sky-500 border-2 border-black dark:border-white";
      } else {
        classStyle += "bg-sky-300";
      }
      resultText = "\u00A0"; // Non-breaking space for empty state
      break;
    case guessResult.INCORRECT:
      classStyle += "bg-red-400 text-white";
      resultText = "Incorrect";
      break;
    case guessResult.SKIPPED:
      classStyle += "bg-orange-300 text-black";
      resultText = "Skipped";
      break;
    case guessResult.CORRECT:
      classStyle += "bg-green-400 text-white";
      resultText = "Correct!";
      break;
  }

  return (
    // todo: add album art
    <div {...props} class={classStyle} id={`guess-${props.componentIndex}`}>
      {guessedSong && (
        <div class="">
          <span class="font-bold">{guessedSong.name}</span> by{" "}
          {getSubtitleForSong(guessedSong)}
        </div>
      )}
      <div class="text-xs">{resultText}</div>
    </div>
  );
};

export default function ProgressBlock(props: GuessInfoProps) {
  const correctIndex = props.history.value.findIndex((item) =>
    item.result === guessResult.CORRECT
  );

  useSignalEffect(() => { // Runs whenever current Signal changes
    if (props.current.value > 0) {
      const activeGuessEl = document.getElementById(`guess-${props.current.value}`);

      if (activeGuessEl) {
        activeGuessEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  return (
    <div class="m-2 flex flex-col items-center gap-2">
      {props.history.value.map((item, index) => (
        <GuessStatusComponent
          key={index}
          guess={item}
          componentIndex={index}
          activeIndex={props.current.value}
          correctIndex={correctIndex}
        />
      ))}
    </div>
  );
}
