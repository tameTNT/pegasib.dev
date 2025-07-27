import { FreshContext } from "$fresh/server.ts";

const redirects: Record<string, string> = {
  github: "https://github.com/tameTNT",
  linkedin: "https://www.linkedin.com/",
  wikipedia: "https://en.wikipedia.org/wiki/51_Pegasi_b",
  heardle: "https://loona-heardle.pegasib.dev/"
};

export function handler(_req: Request, ctx: FreshContext): Response {
  const linkName = ctx.params.linkName;

  if (linkName && redirects[linkName]) { // 302 Found (temporary redirect not cached)
    return Response.redirect(redirects[linkName], 302);
  }

  // Redirects to existing 404 page
  throw new Deno.errors.NotFound();
}
