import { useEffect, useRef, useState } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";

import Button from "../components/Button.tsx";

import { GuessInfoProps } from "./islandProps.d.ts";
import { hasWon } from "../helpers.tsx";
import {guessResult} from "./islandProps.ts";

export default function SongBar(props: GuessInfoProps) {
  const [songPreviewUrl, setSongPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [skipHidden, setSkipHidden] = useState(false);

  const legalStartRef = useRef(false); // Track if the user has started the song legally via the play button
  // Refs to track the play timeout and progress bar update interval tasks and clear them early if needed
  const playIdRef = useRef(0);
  const currentPBIdRef = useRef(0);

  const snippetLengthsRef = useRef([0.5, 1.5, 3, 6, 10, 30]); // Store the snippet lengths in a ref to avoid re-creating the array on every render

  function canPlayWholeSong() {
    // Check if the user has won or reached/exceeded the final guess, so we can play the full song
    return hasWon(props.history.value) || props.current.value >= (props.max - 1);
  }

  function getAllowedMilliseconds() {
    let lengthInSeconds: number;
    if (canPlayWholeSong()) {
      lengthInSeconds =
        snippetLengthsRef.current[snippetLengthsRef.current.length - 1]; // Play the full song if a correct guess has been made
    } else {
      lengthInSeconds = snippetLengthsRef.current[props.current.value]; // Convert seconds to milliseconds
    }
    return lengthInSeconds * 1000; // Convert seconds to milliseconds
  }

  useEffect(() => {
    async function fetchSongPreview() {
      try {
        const response = await fetch("/api/todays-song/preview-url");
        if (response.ok) {
          const urlString = await response.text();
          setSongPreviewUrl(urlString);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        throw new Error(`Error fetching song preview url: ${error}`);
      }
    }
    fetchSongPreview().then(() => {
      const audioElement = document.querySelector("audio");
      if (!audioElement) {
        throw new Error("No audio HTML element found on page.");
      }

      audioElement.volume = 0.1;
      audioElement.currentTime = 0; // Reset to the start
      // console.log(`Set volume to ${audioElement.volume}`);

      audioElement.addEventListener("canplaythrough", () => {
        // duration is not defined until the audio is loaded and can play through
        // console.log(`Set max audio duration to ${audioElement.duration} seconds.`);
        snippetLengthsRef.current[snippetLengthsRef.current.length - 1] =
          audioElement.duration;
      });

      audioElement.addEventListener("play", () => {
        if (legalStartRef.current) return;
        // The user used external controls to play/pause the audio!
        resetAudio();
        alert("Please only use the on-page play/pause button.");
      });
      audioElement.addEventListener("pause", () => {
        legalStartRef.current = false; // Reset legal start when the audio is paused
      });
    });
  }, []);

  function resetAudio() {
    const audioElement = document.querySelector("audio");
    if (!audioElement) throw new Error("No audio HTML element found on page.");

    audioElement.pause();
    setIsPlaying(false);
    legalStartRef.current = false;
    audioElement.currentTime = 0; // reset to prevent illegal resumes midway

    resetProgressBar();
  }

  function resetProgressBar() {
    const progressBar = document.getElementById("audioProgress");
    if (!progressBar) {
      throw new Error("No element with id=audioProgress found on page.");
    }

    clearInterval(currentPBIdRef.current); // Stop updating the progress bar via existing interval
    progressBar.style.width = "0%"; // Reset progress bar width
  }

  function handlePlayButtonClick() {
    const audioElement = document.querySelector("audio");
    if (!audioElement) throw new Error("No audio HTML element found on page.");

    if (isPlaying) {
      resetAudio();
    } else {
      setIsPlaying(true);
      legalStartRef.current = true;
      audioElement.currentTime = 0;

      const progressBar = document.getElementById("audioProgress");
      if (!progressBar) {
        throw new Error("No element with id=audioProgress found on page.");
      }

      resetProgressBar();

      // Fix allowed ms in case guess button is pressed and guess count changes
      const currentAllowedMilliseconds = getAllowedMilliseconds();
      currentPBIdRef.current = setInterval(() => { // Set ID for currently active progress bar interval task
        progressBar.style.width = `${
          (100 * (1000 * audioElement.currentTime / currentAllowedMilliseconds))
            .toFixed()
        }%`;
      }, 100); // Update progress bar every 100ms (same as transition)

      clearTimeout(playIdRef.current); // Clear any previous play timeout task
      audioElement.play().then(() => {
        playIdRef.current = setTimeout(resetAudio, currentAllowedMilliseconds);
      });
    }
  }

  function handleSkipButtonClick() {
    resetAudio();

    // Update the history by redefining array to trigger reactivity signal
    const newHistory = [...props.history.value];
    newHistory[props.current.value] = {
      song: undefined,
      result: guessResult.SKIPPED,
    };
    props.history.value = newHistory;

    props.current.value++; // Increment the current guess count
  }

  useSignalEffect(() => { // Runs whenever current Signal changes
    if (props.current.value > 0 && canPlayWholeSong()) setSkipHidden(true);
  });

  return (
    <div class="flex justify-center w-4/5 md:w-1/2 gap-1">
      <div class="w-full relative isolate overflow-hidden rounded-full">
        <div
          id="audioProgress"
          class="absolute h-full top-0 left-0 pointer-events-none bg-black/50 mix-blend-overlay transition-width duration-100 ease-linear"
        />
        <Button
          id="playButton"
          class="w-full rounded-full font-bold"
          onClick={handlePlayButtonClick}
        >
          {(isPlaying && "Stop") ||
            (!isPlaying &&
              `Play (${(canPlayWholeSong() && 'full') || (getAllowedMilliseconds() / 1000).toFixed(1) + 's'})`)}
        </Button>
      </div>
      <Button
        id="skipButton"
        class="w-1/4 md:w-auto rounded-full font-bold"
        onClick={handleSkipButtonClick}
        hidden={skipHidden}
      >
        +{(snippetLengthsRef.current[props.current.value+1] - snippetLengthsRef.current[props.current.value]).toFixed()}s
      </Button>
      {songPreviewUrl && ( // todo: use src and preload to avoid fetching on every play? (see Network tab in *Firefox* DevTools)
        <audio class="">
          <source src={songPreviewUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
