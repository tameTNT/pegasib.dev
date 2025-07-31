import { FreshContext } from "$fresh/server.ts";


export const handler = {
  GET(req: Request, ctx: FreshContext<SongDataWithIndexState>) {
    const requestParams = new URL(req.url).searchParams;
    const guessedId = requestParams.get("id");
    // console.log(ctx.state.songData[ctx.state.selectedIndex].name);
    return new Response(ctx.state.songData[ctx.state.selectedIndex].id === guessedId ? "true" : "false");
  }
};