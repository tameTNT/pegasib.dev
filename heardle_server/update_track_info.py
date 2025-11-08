# /// script
# dependencies = [
#     "spotipy",
#     "python-dotenv"
# ]
# ///

# Run via `uv run heardle_server/update_track_info.py`

import argparse
import json
import os
from pathlib import Path
import time
import random
import re
import requests

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from dotenv import load_dotenv


def extract_track_from_playlist_item(item: dict):
    track_item = item["track"]
    track_item["url"] = item["track"]["external_urls"]["spotify"]
    del track_item["available_markets"]
    del track_item["album"]["available_markets"]
    del track_item["external_urls"]
    return track_item


def download_playlist(uri: str, output_file_name: str, initial_offset: int = 0, sp_obj: spotipy.Spotify = None):
    print(f"Loading tracks from https://open.spotify.com/playlist/{uri}")
    tracks_got = []
    # todo: support load from existing file first if initial_offset non-zero
    playlist_resp = sp.playlist_items(uri, offset=initial_offset)
    tracks_got += map(extract_track_from_playlist_item, playlist_resp["items"])
    while len(tracks_got) + initial_offset < playlist_resp["total"]:
        playlist_resp = sp.playlist_items(uri, offset=len(tracks_got)+initial_offset)
        tracks_got += map(extract_track_from_playlist_item, playlist_resp["items"])

    print(f"Got {len(tracks_got)} tracks from playlist successfully (initial_offset={initial_offset}).")

    # Scrape the mp3 preview URLs manually
    full_track_info = []
    for i, track in enumerate(tracks_got):
        print(f"On track: {i+1: 3}/{len(tracks_got):03}", end="\r")
        track_resp = requests.get(track["url"])
        if track_resp.status_code == 200:
            raw = track_resp.content.decode("utf-8")
            preview_re_search = re.search(r'content="(https://p\.scdn\.co/mp3-preview/.+?)"/>', raw)
            if preview_re_search:
                track["preview_url"] = preview_re_search.group(1)
                full_track_info.append(track)
            else:
                print(f"Failed to find preview URL for {track['name']}\n")
        else:
            print(f"Got non-OK {track_resp.status_code} status for {track['name']}\n")

        time.sleep(random.random() / 2)  # to avoid spamming the page/avoid rate limiting

    output_file = Path(f"~/{output_file_name}").expanduser()
    json.dump(full_track_info, output_file.open("w+"), indent=2)
    print(f"Done. Dumped info of {len(full_track_info)} songs to to {output_file}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    # Defaults to LOONA songs playlist uri
    parser.add_argument("-u", "--uri", default="05bRCDfqjNVnysz17hocZn")
    parser.add_argument("-f", "--output-file", default="heardle_track_info.json")
    parser.add_argument("-o", "--offset", default=0)
    args = parser.parse_args()

    uri = args.uri
    cli_output_file = args.output_file
    offset = args.offset

    load_dotenv()  # Loads SPOTIFY_CLIENT_ID, and SPOTIFY_CLIENT_SECRET

    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    ))

    download_playlist(uri, cli_output_file, offset, sp)
