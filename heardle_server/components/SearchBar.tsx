import { JSX } from "preact";
import { Signal, useSignalEffect } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { supportedArtist } from "../enums.ts";

import {
  getSubtitleForSong,
  makeArtistString,
  makeErrorMessage,
} from "../helpers.tsx";

export default function SearchBar(
  props: JSX.HTMLAttributes<HTMLInputElement> & {
    guessCount: Signal<number>;
    inputValue: string;
    setInputValue: (value: string) => void;
    artistVariant: supportedArtist;
  },
) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { // Fetch all songs when the component mounts
    async function fetchSongs() {
      const response = await fetch(`/api/${props.artistVariant}/all-songs`);
      if (response.ok) {
        const data: Song[] = await response.json();
        setAllSongs(data);
      } else {
        throw new Error(makeErrorMessage(response));
      }
    }
    fetchSongs()
      .then(() => {
        console.debug("Songs fetched successfully.");
      }).catch((error) => {
        // This is the only place we alert the user that connection failed
        alert("Unable to load song data. Please try again later.");
        console.error(`Error while fetching songs: ${error}.`);
      });
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => { // runs whenever inputValue or allSongs changes
    const query = props.inputValue.toLowerCase();
    if (props.inputValue.length > 0) {
      const filteredSuggestions = allSongs.filter((song) =>
        song.name.toLowerCase().includes(query) ||
        makeArtistString(song.artists).toLowerCase().includes(query) ||
        song.album.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [props.inputValue, allSongs]);

  useSignalEffect(() => { // Runs whenever guessCount Signal changes
    if (props.guessCount.value > 0) {
      // Reset the input and selected song when a guess is made
      props.setInputValue("");
      setSelectedSong(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  });

  function handleInputChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    props.setInputValue(event.currentTarget.value);
    setSelectedSong(null);
  }

  function handleSuggestionClick(song: Song) {
    props.setInputValue(song.name);
    setSelectedSong(song);
    setShowSuggestions(false);
  }

  function handleFocus() {
    if (props.inputValue.length > 0) {
      setShowSuggestions(true);
    }
  }

  function handleBlur(event: FocusEvent) {
    // Use setTimeout to allow click on suggestion before hiding
    setTimeout(() => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.relatedTarget as Node)
      ) {
        setShowSuggestions(false);
      }
    }, 100);
  }

  return (
    <div class="relative text-sm w-full">
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          class="bg-gray-100 dark:bg-slate-500 border border-gray-300 dark:border-white rounded absolute z-10 mb-2 w-full max-h-40 bottom-full overflow-y-auto"
        >
          {suggestions.map((song) => ( // todo: interacts weirdly with keyboards on mobile (can't be scrolled)
            <div
              key={song}
              tabindex={0}
              class="z-10 p-2 border border-gray-300 dark:border-white hover:bg-cyan-200 hover:dark:bg-gray-600 text-black dark:text-white"
              onClick={() => handleSuggestionClick(song)}
              onKeyDown={(e) =>
                e.key === "Enter" ? handleSuggestionClick(song) : undefined}
            >
              <p class="font-semibold">{song.name}</p>
              <p>By {getSubtitleForSong(song)}</p>
            </div>
          ))}
        </div>
      )}
      <input
        {...props}
        type="search"
        tabindex={0}
        class="w-full border border-gray-300 text-black rounded p-2"
        value={props.inputValue}
        onInput={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <p class="p-1 text-xs truncate text-right">
        {selectedSong
          ? <>By {getSubtitleForSong(selectedSong)}</>
          : <i>Type a valid guess above ⬆️</i>}
      </p>
      <span hidden id="songId">
        {selectedSong ? selectedSong.id : ""}
      </span>
    </div>
  );
}
