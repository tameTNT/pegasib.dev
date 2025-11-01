import Root from "../islands/root.tsx";

export default function Home() {
  const availableArtists = ["LOONA", "GFriend"];
  const MAX_GUESSES = 6; // total number of guesses allowed set on server side

  return ( // todo: Korean localisation/translation of home page
    <Root version="v3.0.0" availableArtists={availableArtists} maxGuesses={MAX_GUESSES} />
  );
}
