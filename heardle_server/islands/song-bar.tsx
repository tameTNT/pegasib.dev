import { useState, useEffect, useRef } from "preact/hooks";

import {Button} from "../components/Button.tsx";


export default function SongBar() {
  const [songPreviewUrl, setSongPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

  const legalStartRef = useRef(false); // Track if the user has started the song legally via the play button
  const playIdRef = useRef(0);  // Use a 'playId' to only stop play automatically on the newest play button press

  const snippetLengths = [0.5, 1.5, 3, 5, 10, 30];

  function getAllowedMilliseconds(){
    return snippetLengths[guessCount] * 1000; // Convert seconds to milliseconds
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
      if (!audioElement) throw new Error("No audio HTML element found on page.");

      audioElement.volume = 0.1;
      // console.log(`Set volume to ${audioElement.volume}`);
      audioElement.addEventListener("play", () => {
        if (legalStartRef.current === false) {  // The user used external controls to play/pause the audio!
          stopAudio();
          alert("Please only use the on-page play/pause button.")
        }
      });
      audioElement.addEventListener("timeupdate", () => {
        const progressBar = document.getElementById("audioProgress");
        if (!progressBar) throw new Error("No element with id=audioProgress found on page.");

        progressBar.style.width = `${(100*1000*audioElement.currentTime/getAllowedMilliseconds()).toFixed()}%`;
      })
      audioElement.currentTime = 0;  // Reset to the start
    });
  }, []);

  function stopAudio(){
    const audioElement = document.querySelector("audio");
    if (!audioElement) throw new Error("No audio HTML element found on page.");

    audioElement.pause();
    setIsPlaying(false);
    legalStartRef.current = false;
    audioElement.currentTime = 0;  // reset to prevent illegal resumes midway
  }

  function handlePlayButtonClick(){
    const audioElement = document.querySelector("audio");
    if (!audioElement) throw new Error("No audio HTML element found on page.");

    if (isPlaying) {
      stopAudio();
    } else {
      snippetLengths[snippetLengths.length-1] = audioElement.duration;
      audioElement.currentTime = 0;
      setIsPlaying(true);
      legalStartRef.current = true;

      const newPlayId = Date.now();
      playIdRef.current = newPlayId;
      audioElement.play().then(() => setTimeout(() => {
        if (playIdRef.current === newPlayId) { stopAudio() }  // Only stop audio if it was started by this button click
      }, getAllowedMilliseconds()));
    }
  }

  return (
    <div class="flex justify-center w-1/3">
      <div class="w-full relative isolate overflow-hidden rounded-full">
        <div id="audioProgress" class="absolute h-full top-0 left-0 pointer-events-none bg-black/50 mix-blend-overlay"></div>
        <Button id="playButton" class="w-full rounded-full font-bold"
                   onClick={handlePlayButtonClick}>{(isPlaying && "Stop") || (!isPlaying && "Play")}</Button>
      </div>
      {songPreviewUrl && (
        <audio class="">
          <source src={songPreviewUrl} type="audio/mpeg"/>
        </audio>
      )}
    </div>
  );
}
