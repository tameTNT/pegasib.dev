import { signal } from '@preact/signals';

import GuessBar from "../islands/guess-bar.tsx";
import SongBar from "../islands/song-bar.tsx";
import ProgressBlock from "../islands/progress-block.tsx";

export default function Home() {
  const ALLOWED_GUESSES = 6;
  const guessCount = signal(0);
  const guessHistory = signal<Array<boolean | null>>(
    Array(ALLOWED_GUESSES).fill(null)
  );


  return (
    <div class="mx-auto flex flex-col h-screen justify-between items-center">
      <main class="text-center">
        <h1 className="text-4xl">LOOΠ∆ Heardle</h1>
        <p class="">Includes solo, subunit, and all post-BBC tracks.</p>
        <p class="italic text-xs">All audio courtesy of Spotify.</p>
        <ProgressBlock allowed={ALLOWED_GUESSES} count={guessCount} history={guessHistory} />
      </main>
      <footer class="sticky bottom-0 w-full bg-gray-500/40 flex flex-col items-center p-2 gap-1">
        <SongBar allowed={ALLOWED_GUESSES} count={guessCount} history={guessHistory} />
        <GuessBar allowed={ALLOWED_GUESSES} count={guessCount} history={guessHistory} />
      </footer>
    </div>
  );
}
