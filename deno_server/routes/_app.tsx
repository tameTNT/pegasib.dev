import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>51 Pegasi b</title>
        <link rel="stylesheet" href="/styles.css" />
        <script type="text/javascript" src="/bg_cursor_move.js" defer></script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
