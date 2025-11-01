import { FreshContext } from "$fresh/server.ts";

export const handler = (_req: Request, ctx: FreshContext<SongDataState>) => {
  return new Response(JSON.stringify(ctx.state.songData));
};
