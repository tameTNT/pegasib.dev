import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req) {
    const html = await Deno.readTextFile("./static/map_viewer.html");
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
