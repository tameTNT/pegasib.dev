import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div id="spaceScene"></div>
      <div class="text-white flex flex-row min-h-screen justify-center items-center">
        <div class="flex flex-col items-center justify-center">
          <h1>404</h1>
          <p>👾 We don't have a record of that page here 🛰️</p>
          <p><a href="/" class="underline text-xl">Blast back to orbit</a></p>
        </div>
      </div>
    </>
  );
}
