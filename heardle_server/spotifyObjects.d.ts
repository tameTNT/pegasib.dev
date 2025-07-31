interface Song {
  preview_url: string;
  album: Album;
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

interface Album {
  album_type: string;
  href: string;
  id: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  name: string;
  release_date: string;
  artists: Array<Artist>;
  total_tracks: number;
}

interface SongDataState {
  songData: Array<Song>;
}

interface SongDataWithIndexState extends SongDataState {
  selectedIndex: number;
}
