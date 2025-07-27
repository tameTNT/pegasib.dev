import { FreshContext } from "$fresh/server.ts";

export const handler = [
  async function logLinksRequests(req: Request, ctx: FreshContext) {
    const requestTime = new Date();
    const requestUrl = new URL(req.url);

    // console.log(`Request to ${requestUrl.pathname}`);
    await Deno.writeTextFile(
      "./redirects.log",
      `${requestTime.toISOString()} | ${requestUrl.pathname}\n`,
      { append: true, create: true },
    );

    return ctx.next();
  },
];
