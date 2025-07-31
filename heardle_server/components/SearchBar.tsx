import { JSX } from "preact";
import { Signal, useSignalEffect } from '@preact/signals';
import { useState, useEffect, useRef } from "preact/hooks";


function subtitleForSong(song: Song){
  return <p>By <i>{song.artists.map(artist => artist.name).join(", ")}</i> on <i>{song.album.name}</i></p>;
}

export function SearchBar(props: JSX.HTMLAttributes<HTMLInputElement> & { guessCount: Signal<number> }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all songs when the component mounts
    async function fetchSongs() {
      try {
        const response = await fetch("/api/all-songs");
        if (response.ok) {
          const data: Song[] = await response.json();
          setAllSongs(data);
        } else {
          console.error("Failed to fetch songs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }
    fetchSongs().then(() => console.log("Songs fetched successfully"));
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const query = inputValue.toLowerCase();
    if (inputValue.length > 0) {
      const filteredSuggestions = allSongs.filter((song) =>
        song.name.toLowerCase().includes(query) ||
        song.artists.map(artist => artist.name.toLowerCase()).join(", ").includes(query) ||
        song.album.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, allSongs]);

  useSignalEffect(() => {  // Runs whenever guessCount Signal changes
    if (props.guessCount.value > 0) {
      // Reset the input and selected song when a guess is made
      setInputValue("");
      setSelectedSong(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  });

  function handleInputChange(event: JSX.TargetedEvent<HTMLInputElement>){
    setInputValue(event.currentTarget.value);
    setSelectedSong(null);
  }

  function handleSuggestionClick(song: Song){
    setInputValue(song.name);
    setSelectedSong(song);
    setShowSuggestions(false);
  }

  function handleFocus(){
    if (inputValue.length > 0) {
      setShowSuggestions(true);
    }
  }

  function handleBlur(event: FocusEvent){
    // Use setTimeout to allow click on suggestion before hiding
    setTimeout(() => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 100);
  }

  return (
    <div class="relative">
      {(showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          class="bg-gray-100 border border-gray-300 rounded absolute z-10 mb-2 w-full max-h-40 bottom-full overflow-y-auto"
        >
          {suggestions.map((song) => (
            <div
              key={song}
              tabindex={0}
              class="z-10 p-2 border border-gray-300 hover:bg-cyan-200"
              onClick={() => handleSuggestionClick(song)}
              onKeyDown={e => e.key === 'Enter' ? handleSuggestionClick(song) : undefined}
            >
              <p>{song.name}</p>
              {subtitleForSong(song)}
            </div>
          ))}
        </div>
      ))}
      <input
        {...props}
        type="text"
        tabindex={0}
        class="border border-gray-300 rounded text-xl p-2"
        value={inputValue}
        onInput={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div class="text-xs text-right py-1 pe-1">
        {(selectedSong && subtitleForSong(selectedSong)) || <i>Type a valid guess above ⬆️</i>}
      </div>
      {/* todo: handle text overflow (rather than new line) for long song/artists names (e.g. Sweet Crazy Love Eng) */}
      <span class="hidden" id="songId">{selectedSong ? selectedSong.id : ""}</span>
    </div>
  );
}
