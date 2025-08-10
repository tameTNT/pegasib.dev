import { Signal } from "@preact/signals";
import { useState } from "preact/hooks";

import Button from "../components/Button.tsx";
import { guessResult, PastGuess } from "../enums.ts";

export default function ShareButton(
  { gameIsOver, gameTitle, currentDate, history }: {
    gameIsOver: boolean;
    gameTitle: string;
    currentDate: Date;
    history: Signal<PastGuess[]>;
  },
) {
  const [successfulCopy, setSuccessfulCopy] = useState(false);

  function handleButtonClick() {
    if (!gameIsOver) return; // Do nothing if the game is not over

    // Create the share message (in dd/mm/yyyy format)
    let shareMessage = `${gameTitle} ${currentDate.toLocaleDateString("en-GB")}\n`;
    history.value.forEach((guess) => {
      switch (guess.result) {
        case guessResult.CORRECT:
          shareMessage += "🟩"; // Green square
          break;
        case guessResult.INCORRECT:
          shareMessage += "🟥"; // Red square
          break;
        case guessResult.SKIPPED:
          shareMessage += "🟧"; // Orange square
          break;
        case guessResult.NONE:
          shareMessage += "⬜"; // White square
          break;
      }
    });
    shareMessage += `\nTry and beat my score: ${globalThis.location.href}`;

    // Copy message to clipboard
    navigator.clipboard.writeText(shareMessage)
      .then(() => {
        console.debug("Share message copied to clipboard!");
        setSuccessfulCopy(true);
        setTimeout(() => setSuccessfulCopy(false), 1000); // Reset colour after 2 seconds
      })
      .catch((err) => console.error("Failed to copy share message: ", err));
  }

  return (
    <div class="flex flex-row items-center justify-center gap-2 duration-1s mb-4">
      Share score:
      <Button
        class={`rounded-full italic${successfulCopy ? " !bg-green-400" : ""}`}
        onClick={handleButtonClick}
        disabled={!gameIsOver}
      >
        <img src="copy_icon.svg" alt="Copy icon" />
      </Button>
    </div>
  );
}
