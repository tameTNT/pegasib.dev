import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="favicon.ico" />
      <title>LOONA Heardle</title>
      <link rel="stylesheet" href="/styles.css" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://loona-heardle.pegasib.dev"/>
      <meta property="og:title" content="🎧 LOONA Heardle 🌌" />
      <meta property="og:description"
            content="Guess the LOONA song (including all solo, subunit, and post-BBC songs – up to Soft Error) from as short an audio clip as possible. New song every day." />
      <meta property="og:image" content="preview_poster.png" />
      {/*<meta name="twitter:card" content="summary_large_image"/>*/}
    </head>
    <body>
    <Component />
    </body>
    </html>
  );
}
