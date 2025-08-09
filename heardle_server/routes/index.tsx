import Root from "../islands/root.tsx";

export default function Home() {
  const GAME_TITLE = "LOONA Heardle";
  const MAX_GUESSES = 6 // total number of guesses allowed set on server side

  return <Root gameTitle={GAME_TITLE} maxGuesses={MAX_GUESSES} />
}
