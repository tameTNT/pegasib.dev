import { Handlers } from "$fresh/server.ts";

import GuessBar from "../islands/guess-bar.tsx";
import SongBar from "../islands/song-bar.tsx";


export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req, _ctx) {
    const form = await req.formData();
    const songId = form.get("songId")?.toString();

    return new Response(`Submitted with id ${songId}!`);
  },
};

export default function Home() {
  return (
    <div class="mx-auto flex flex-col h-screen justify-between items-center">
      <main class="text-center">
        <h1 className="text-4xl">LOOΠ∆ Heardle</h1>
        <p class="italic">Includes solo, subunit, and all post-BBC tracks.</p>
        <div class="my-5 square"></div>
      </main>
      <footer class="sticky bottom-0 w-full bg-gray-500/40 flex flex-col items-center p-2 gap-2">
        <SongBar/>
        <GuessBar/>
      </footer>
    </div>
  );
}
