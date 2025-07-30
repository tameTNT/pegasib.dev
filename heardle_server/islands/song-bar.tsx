import { useState, useEffect } from "preact/hooks";

import {Button} from "../components/Button.tsx";


export default function SongBar() {
  const [songPreviewUrl, setSongPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

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
      }
    });
  }, []);

  const handlePlayButtonClick = () => {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        snippetLengths[snippetLengths.length-1] = audioElement.duration;
        audioElement.currentTime = 0;
        setIsPlaying(true);
        audioElement.play().then(() => setTimeout(() => {
          audioElement.pause();
          setIsPlaying(false);
        }, snippetLengths[guessCount] * 1000));
      }
    }
  };

  return (
    <div class="flex justify-center w-1/3">
      <Button id="playButton" class="rounded-full w-full" onClick={handlePlayButtonClick}>{(isPlaying && "Pause") || (!isPlaying && "Play")}</Button>
      {songPreviewUrl && (
        <audio class="">
          <source src={songPreviewUrl} type="audio/mpeg"/>
        </audio>
      )}
    </div>
  );
}
