import { useState, useEffect, useRef } from "preact/hooks";

import {Button} from "../components/Button.tsx";


export default function SongBar() {
  const [songPreviewUrl, setSongPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const legalStartRef = useRef(false); // Track if the user has started the song legally via the play button
  const playIdRef = useRef(0);  // Use a 'playId' to only stop play automatically on the newest play button press

  const snippetLengths = [0.5, 1.5, 3, 5, 10, 30];

  useEffect(() => {
    async function fetchSongPreview() {
      try {
        const response = await fetch("/api/todays-song/preview-url");
        if (response.ok) {
          const urlString = await response.text();
          setSongPreviewUrl(urlString);
        } else {
          console.error("Failed to fetch song preview:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching song preview:", error);
      }
    }
    fetchSongPreview().then(() => {
      const audioElement = document.querySelector("audio");
      if (audioElement) {
        audioElement.volume = 0.1;
        console.log(`Set volume to ${audioElement.volume}`);
        audioElement.addEventListener("play", () => {
          if (legalStartRef.current === false) {  // The user used external controls to play/pause the audio!
            stopAudio();
            alert("Please only use the on-page play/pause button.")
          }
        })
      }
    });
  }, []);

  const stopAudio = () => {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      legalStartRef.current = false;
      audioElement.currentTime = 0;  // reset to prevent illegal resumes midway
    }
  }

  const handlePlayButtonClick = () => {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
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
        }, snippetLengths[guessCount] * 1000));
      }
    }
  };

  return (
    <div class="flex justify-center w-1/3">
      <Button id="playButton" class="rounded-full w-full" onClick={handlePlayButtonClick}>{(isPlaying && "Stop") || (!isPlaying && "Play")}</Button>
      {songPreviewUrl && (
        <audio class="">
          <source src={songPreviewUrl} type="audio/mpeg"/>
        </audio>
      )}
    </div>
  );
}
