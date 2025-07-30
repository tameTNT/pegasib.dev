import { SearchBar } from "../components/SearchBar.tsx";
import {Button} from "../components/Button.tsx";


export default function GuessBar() {
  const handleGuess = () => {
    // Handle the guess submission logic here
    console.log(document.getElementById("songId").value);
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
