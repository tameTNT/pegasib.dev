# LOONA Heardle

## Description

A variation on the original [Heardle game](https://heardlewordle.io/) (itself
inspired by the word guessing game Wordle) where the player has to guess a song
within 6 tries. The amount of the song played increases with each guess up to a
full 30 seconds of the track for the final guess. This variation plays only
songs from the **K-Pop group [LOONA](https://en.wikipedia.org/wiki/Loona)**
(including all subunits, solo, and drama OST tracks). A different song is
selected each day at midnight UTC.

The page is optimised for mobile and desktop devices and includes light and dark
modes for comfortable use.

## Deployment

The game is hosted for anyone to play on https://51.pegasib.dev/links/heardle.

## Technical Implementation

### Songs

The songs used for the game are extracted from
[a Spotify playlist](https://open.spotify.com/playlist/05bRCDfqjNVnysz17hocZn)
by the script `update_track_info.py` which should be run whenever the original
playlist is updated. This script uses the Spotify API (via
[`spotipy`](https://spotipy.readthedocs.io/en/master/)) to fetch information for
each track and stores it in a JSON file (`heardle_track_info.json`) alongside
the additionally collected preview url of the track (not provided by the API).

### Frameworks

The client/server is implemented using the [Fresh](https://fresh.deno.dev/)
framework (built around [Preact](https://preactjs.com/)) and run using the
[Deno](https://deno.com/) JavaScript runtime. Styling is done using
[Tailwind CSS](https://tailwindcss.com/).

Frontend components are located in `/components` which are used to build islands
in `/islands`. The main page is given by `/routes/index.tsx` with API routes in
`/routes/api`.

## Local Development

To run and develop the game locally, you need to have [Deno](https://deno.com/)
installed via, e.g. for Unix systems:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

Then follow the following steps:

1. Clone the GitHub repository and change into the directory:
   ```bash
   git clone "URL" heardle_server # todo: insert dedicated repository URL here (after splitting)
   cd heardle_server
   ```
2. You will need to create a [Spotify application](https://developer.spotify.com/documentation/web-api)
   and obtain a client ID and secret to use the script. These values should be 
   saved in a `.env` file in the same or parent directory of the script.
   Download song data by running the python script `update_track_info.py` via,
   e.g. [uv](https://docs.astral.sh/uv/) (which automatically handles script dependencies):
   ```bash
   uv run update_track_info.py
   ```
   This will create the file `~/heardle_track_info.json` (i.e. in your home
   directory) which contains the song data used by the game.
3. Then just start the project (this will also install all dependencies):
   ```bash
   deno task start
   ```
   The local server will start on port [9989](http://localhost:9989).
