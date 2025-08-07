import { FreshContext } from "$fresh/server.ts";

export const handler = {
  GET(req: Request, ctx: FreshContext<SongDataWithIndexState>) {
    const requestParams = new URL(req.url).searchParams;
    const guessedId = requestParams.get("id"); // todo: validate this is a valid song ID, return error status if not
    // console.log(ctx.state.songData[ctx.state.selectedIndex].name);
    const correctSong = ctx.state.songData[ctx.state.selectedIndex];

    const respObj = {
      isCorrect: correctSong.id === guessedId,
      songData: ctx.state.songData.find((song) => song.id === guessedId),
      correctSong: undefined as Song | undefined, // will be filled in if this is the final guess
    };

    const isFinal = requestParams.get("isFinal") === "true";
    if (isFinal) {
      respObj.correctSong = correctSong; // include the correct song data if this is the final guess
    }
    return new Response(JSON.stringify(respObj));
  },
};
