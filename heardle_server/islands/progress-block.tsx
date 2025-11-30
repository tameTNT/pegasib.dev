import { JSX } from "preact";
import { useSignalEffect } from "@preact/signals";

import { GuessInfoProps } from "./islandProps.d.ts";
import { guessResult, PastGuess } from "../enums.ts";
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
    "p-2 w-full rounded transition-color transition-border duration-500 overflow-hidden ";
  const guessedSong = props.guess.song;
  let resultText: string;

  switch (props.guess.result) {
    case guessResult.NONE:
      if (
        props.correctIndex !== -1 && props.componentIndex >= props.correctIndex
      ) { // If the guess is after a correct one
        classStyle += "bg-gray-400/50";
      } else if (props.componentIndex === props.activeIndex) {
        classStyle += "bg-sky-500 border-2 border-white";
      } else {
        classStyle += "bg-sky-300/80";
      }
      resultText = "\u00A0"; // Non-breaking space for empty state
      break;
    case guessResult.INCORRECT:
      classStyle += "bg-red-400/90 text-white";
      resultText = "Incorrect";
      break;
    case guessResult.SKIPPED:
      classStyle += "bg-orange-300/90 text-black";
      resultText = "Skipped";
      break;
    case guessResult.CORRECT:
      classStyle += "bg-green-400/90 text-white";
      resultText = "Correct!";
      break;
  }

  let largest_size = 0;
  let largest_idx = -1;
  guessedSong?.album.images.forEach((img, i) => {
    if (img.height > largest_size) {
      largest_size = img.height;
      largest_idx = i;
    }
  });

  return (
    <div {...props} class={classStyle} id={`guess-${props.componentIndex}`}>
      {guessedSong && (
            <>
              <div className="grid grid-cols-6 gap-4 items-center justify-between">
                <div className="">
                  <img
                    className="w-full h-auto rounded"
                    src={guessedSong.album.images[largest_idx].url}
                    alt={`Album art for ${guessedSong.album.name}`}
                  />
                </div>
                <div className="col-span-4 text-center">
                  <p>
                    <span className="font-bold">{guessedSong.name}</span> by
                    {" "}
                    {getSubtitleForSong(guessedSong)}
                  </p>
                  <div class="text-xs">{resultText}</div>
                </div>
              </div>
            </>
          ) || <div class="text-xs">{resultText}</div>}
    </div>
  );
};

export default function ProgressBlock(props: GuessInfoProps) {
  const correctIndex = props.history.value.findIndex((item) =>
    item.result === guessResult.CORRECT
  );

  useSignalEffect(() => { // Runs whenever current Signal changes
    if (props.current.value > 0) {
      const activeGuessEl = document.getElementById(
        `guess-${props.current.value}`,
      );

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
