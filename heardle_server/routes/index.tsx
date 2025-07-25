import GuessBar from "../islands/guess-bar.tsx";

export default function Home() {
  return (
    <div class="mx-auto flex flex-col h-screen justify-between items-center">
      <main class="text-center">
        <h1 className="text-4xl">LOOΠ∆ Heardle</h1>
        <p class="italic">Includes solo, subunit, and all post-BBC tracks.</p>
        <div class="my-5 square"></div>
      </main>
      <footer><GuessBar/></footer>
    </div>
  );
}
