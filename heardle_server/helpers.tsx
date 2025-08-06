export function subtitleForSong(song: Song){
  return <><i>{song.artists.map(artist => artist.name).join(", ")}</i> on <i>{song.album.name}</i></>;
}