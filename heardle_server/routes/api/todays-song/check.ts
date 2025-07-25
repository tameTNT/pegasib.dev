import { FreshContext } from "$fresh/server.ts";


export const handler = {
  POST(_req: Request, ctx: FreshContext<SongDataWithIndexState>) {
    return new Response(`Correct answer is "${ctx.state.songData[ctx.state.selectedIndex].name}"`);
  },
};