export function handler(_req: Request): Response {
  return Response.redirect( // 302 Found (temporary redirect not cached)
    "https://en.wikipedia.org/wiki/51_Pegasi_b",
    302,
  );
}
