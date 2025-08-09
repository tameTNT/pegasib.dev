import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <div class="flex flex-col items-center justify-center h-screen text-center">
        <h1 class="text-5xl">404 – Page Not Found</h1>
        <img
          src="favicon.ico"
          alt="Choerry vibin' with headphones"
          class="h-22 m-5"
        />
        <a href="/">Back to Heardle!</a>
      </div>
    </>
  );
}
