import { useState, useEffect } from "preact/hooks";

import {Button} from "../components/Button.tsx";


export default function SongBar() {
  const [songPreviewUrl, setSongPreviewUrl] = useState("");

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
    fetchSongPreview().then();
  }, []);
  return (
    <div class="flex justify-center w-1/3">
      <Button id="playButton" class="rounded-full w-full">Play</Button>
      {songPreviewUrl && (
        <audio class="">
          <source src={songPreviewUrl} type="audio/mpeg"/>
        </audio>
      )}
    </div>
  );
}
