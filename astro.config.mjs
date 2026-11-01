// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import icon from "astro-icon";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      cssVariable: "--font-papercut",
      name: "Paper Cut",
      options: {
        variants: [
          {
            weight: "normal",
            style: "normal",
            src: ["./src/assets/fonts/papercut.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      cssVariable: "--font-spooky",
      name: "Spooky",
      options: {
        variants: [
          {
            weight: "normal",
            style: "normal",
            src: ["./src/assets/fonts/spooky.woff2"],
          },
        ],
      },
    },
  ],
  site: "https://tomas.games",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react(), icon()],
});
