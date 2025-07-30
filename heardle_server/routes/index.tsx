import { Handlers } from "$fresh/server.ts";

import GuessBar from "../islands/guess-bar.tsx";
import SongBar from "../islands/song-bar.tsx";

export default function Home() {
  return (
    <div class="mx-auto flex flex-col h-screen justify-between items-center">
      <main class="text-center">
        <h1 className="text-4xl">LOOΠ∆ Heardle</h1>
        <p class="italic">Includes solo, subunit, and all post-BBC tracks.</p>
        <div class="my-5 square"></div>
      </main>
      <footer class="sticky bottom-0 w-full bg-gray-500/40 flex flex-col items-center p-2 gap-1">
        <SongBar/>
        <GuessBar/>
      </footer>
    </div>
  );
}
