import { SearchBar } from "../components/SearchBar.tsx";
import {Button} from "../components/Button.tsx";


export default function GuessBar() {
  return (
    <div class="flex justify-center w-80">
      <form method="post">
        <div class="flex flex-row align-center gap-2">
          <div class="flex-1"><SearchBar placeholder="Search by title, album, or artist" size={25}/></div>
          <div class=""><Button type="submit">Guess!</Button></div>
        </div>
      </form>
    </div>
  );
} // todo: still breaks on very narrow viewports like Fold due to fixed input width
