# Source code for [51.pegasib.dev](https://51.pegasib.dev)

## Description

A personal website with links to some of my personal sites 
that will in future also include general career details 
and project showcases.

## Development

### Technical Implementation

The client/server is implemented using the [Fresh](https://fresh.deno.dev/)
framework (built around [Preact](https://preactjs.com/)) and run using the
[Deno](https://deno.com/) JavaScript runtime. Styling is done using
[Tailwind CSS](https://tailwindcss.com/).

The index page is given by `/routes/index.tsx` with redirect links 
handled by `/routes/links`. The interactive elements are implemented 
using a Fresh plugin (that injects the code from `/scripts` 
into the page on render) in `/plugins`.

### Local Development

Make sure Deno is installed.
Then, in the project directory (`/home_server`), run:
```bash
   deno task start
   ```
The local server will start on port [8000](http://localhost:8000).
