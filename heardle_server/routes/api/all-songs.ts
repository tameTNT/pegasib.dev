import { FreshContext } from "$fresh/server.ts";


export const handler = (_req: Request, ctx: FreshContext<SongDataState>) => {
  const songNames = ctx.state.songData.map(song => {
    return `${song.name} (${song.artists.map(artist => artist.name).join(", ")})`
  });
  return new Response(JSON.stringify(songNames));
};
