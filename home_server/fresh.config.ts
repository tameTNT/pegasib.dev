import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import pageEffectsPlugin from "./plugins/pageEffects.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    // Loads custom effects (TypeScript code to run on the page) via a plugin
    // See https://fresh.deno.dev/docs/concepts/plugins#creating-a-plugin
    pageEffectsPlugin(),
  ],
  server: { port: 8000 },
});
