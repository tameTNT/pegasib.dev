import { FreshContext } from "$fresh/server.ts";

export const handler = (
  _req: Request,
  ctx: FreshContext<SongDataWithIndexState>,
): Response => {
  return new Response(ctx.state.songData[ctx.state.selectedIndex].preview_url);
};
