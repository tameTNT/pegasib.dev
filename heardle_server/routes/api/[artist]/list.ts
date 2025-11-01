import { FreshContext } from "$fresh/server.ts";
import { makeArtistString } from "../../../helpers.tsx";

export const handler = (_req: Request, ctx: FreshContext<SongDataState>) => {
  const songsAsArray: [string, string, string][] = [];
  ctx.state.songData.forEach((song) => {
    songsAsArray.push([
      song.name,
      makeArtistString(song.artists),
      song.album.name,
    ]);
  });
  return new Response(JSON.stringify(songsAsArray));
};
