import { FreshContext } from "$fresh/server.ts";


export const handler = {
  GET(req: Request, ctx: FreshContext<SongDataWithIndexState>) {
    const requestParams = new URL(req.url).searchParams;
    const guessedId = requestParams.get("id");
    // console.log(ctx.state.songData[ctx.state.selectedIndex].name);
    const correctSong = ctx.state.songData[ctx.state.selectedIndex];

    const respObj = {
      isCorrect: correctSong.id === guessedId,
      songData: ctx.state.songData.find(song => song.id === guessedId),
    }
    return new Response(JSON.stringify(respObj));
  }
};