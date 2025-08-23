import { Plugin } from "$fresh/server.ts";

export default function pageEffectsPlugin(): Plugin {
  return {
    name: "page-effects",
    entrypoints: {
      "page-effects": new URL(
        "../scripts/page_effects.ts",
        import.meta.url,
      ).href,
    },
    render(ctx) {
      ctx.render();
      return {
        scripts: [
          {
            entrypoint: "page-effects",
            state: {},
          },
        ],
      };
    },
  };
}