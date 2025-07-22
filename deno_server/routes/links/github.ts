export function handler(_req: Request): Response {
  return Response.redirect( // 302 Found (temporary redirect not cached)
    "https://github.com/tameTNT",
    302,
  );
}
