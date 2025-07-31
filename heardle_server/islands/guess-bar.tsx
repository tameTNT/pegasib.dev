import { SearchBar } from "../components/SearchBar.tsx";
import {Button} from "../components/Button.tsx";


export default function GuessBar() {
  function handleGuess(){
    // Handle the guess submission logic here
    const idElement = document.getElementById("songId");
    if (!idElement) return;

    const guessedId = idElement.textContent;
    if (!guessedId) return;  // No song selected, do nothing
    fetch(`/api/todays-song/check?id=${guessedId}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Status ${res.status} | ${res.statusText}`);
        }
      })
      .then(data => {
        console.log("Guess result:", data);
      })
      .catch(err => console.error(`Error while verifying guess: ${err}.`));
  }

  return (
    <div class="flex justify-center w-80">
      <div class="flex flex-row align-center gap-1">
        <div class="flex-1"><SearchBar placeholder="Search by title, album, or artist" size={25}/></div>
        <Button type="button" class="rounded" onClick={handleGuess}>Guess!</Button>
      </div>
    </div>
  );
} // todo: still breaks on very narrow viewports like Fold due to fixed input width
