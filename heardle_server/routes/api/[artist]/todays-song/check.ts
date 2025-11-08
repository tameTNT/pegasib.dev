import { FreshContext } from "$fresh/server.ts";

export const handler = {
  GET(req: Request, ctx: FreshContext<SongDataWithIndexState>) {
    const requestParams = new URL(req.url).searchParams;
    const guessedId = requestParams.get("id");

    const songDataForId = ctx.state.songData.find((song) => {
      return song.id == guessedId;
    });
    // Validate this is a valid song ID, return an error if not
    if (guessedId === undefined || songDataForId === undefined) {
      return new Response("Invalid/Missing song ID", { status: 400 }); // Bad Request
    }

    const correctSong = ctx.state.songData[ctx.state.selectedIndex];

    const respObj = {
      isCorrect: correctSong.id === guessedId,
      songData: songDataForId,
      correctSong: undefined as Song | undefined, // will be filled in if this is the final guess
    };

    const isFinal = requestParams.get("isFinal") === "true";
    if (isFinal) {
      respObj.correctSong = correctSong; // include the correct song data if this is the final guess
    }
    return new Response(JSON.stringify(respObj));
  },
};
