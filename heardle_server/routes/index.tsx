import Root from "../islands/root.tsx";
import config_data from "./api/config.json" with { type: "json" };

export default function Home() {
  const MAX_GUESSES = 6; // total number of guesses allowed set on server side

  return ( // todo: Korean localisation/translation of home page
    <Root
      version="v3.0.3"
      availableArtists={config_data.supported_artists}
      maxGuesses={MAX_GUESSES}
    />
  );
}
