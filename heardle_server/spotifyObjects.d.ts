interface Song {
  preview_url: string;
  album: object;
  artists: Array<Artist>;
  id: string;
  name: string;
  url: string;
}

interface Artist {
  href: string;
  id: string;
  name: string;
}

interface SongDataState {
  songData: Array<Song>;
}