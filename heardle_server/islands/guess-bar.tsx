import { SearchBar } from "../components/SearchBar.tsx";

export default function GuessBar() {
  return (
    <div class="flex justify-center py-3 w-80">
      <SearchBar placeholder="Search by title, album, or artist" size={35}/>
    </div>
  );
}
