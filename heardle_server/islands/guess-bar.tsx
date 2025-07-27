import { SearchBar } from "../components/SearchBar.tsx";
import {Button} from "../components/Button.tsx";


export default function GuessBar() {
  return (
    <div class="flex justify-center py-3 w-80">
      <form method="post">
        <div class="flex flex-col items-center gap-2">
          <div><SearchBar placeholder="Search by title, album, or artist" size={30}/></div>
          <div><Button type="submit">Guess!</Button></div>
        </div>
      </form>
    </div>
  );
}
