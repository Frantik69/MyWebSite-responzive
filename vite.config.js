import { defineConfig } from "vite";
import purgecss from "vite-plugin-purgecss";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  base: "/MyWebSite-responzive/",
  plugins: [
    isProduction &&
      purgecss({
        content: [
          "./index.html",
          "./src/**/*.html",
          "./src/**/*.js",
          "./src/**/*.scss"
        ],
        safelist: [
          /rating/,
          /rating-\d/,
          /fa-solid/,
          /fa-regular/,
          /dropdown/,
          /show/,
          /active/,
          /fade/,
          /fadeIn/,
          /fadeInUp/,
          /slide/,
          /bubble/,
          /bubblePop/,
          /nav/,
          /menu/,
          /menu-item/,
          /hover-bubble/,
          /timeline/,
          /skill/,
          /skills/,
          /pdf/,
          /pdf-wrapper/,
          /pdf-close/,
          /tooltip/,
          /tooltip-follow/,
          /tooltip-text/,
          /modal/,
          /modal-overlay/,
          /modal-bubble/,
          /error/,
          /success/,
          /btn-loading/,
        ]
      })
  ].filter(Boolean),
  css: {
    devSourcemap: true
  }
});
