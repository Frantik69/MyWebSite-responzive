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

        safelist: {
          standard: [
            // Dynamické triedy
            "visible",
            "show",
            "show-bubble",
            "show-animated",
            "navbar-shrink",
            "active",
            "collapse",
            "collapsing",

            // WeatherFloating
            "weatherNav",
            "weather-icon",
            "weather-temp",
            "weather-city",
            "weather-row",

            // SideNav
            "side-nav",
            "sideNav",
            "sideNav-center",
            "sideNav-content",
            "side-nav-divider",

            // HOME layout
            "left-text",
            "left-top",
            "left-bottom",
            "home-container",
            "certificates-carousel",
            "cert-track-wrapper",
            "cert-track",
            "cert-arrow",

            // Tooltip
            "tooltip-follow",
            "tooltip-follow__bubble",
            "lang-bubble",

            // Modals
            "modal-overlay",
            "modal-bubble",
            "pdf-wrapper",
            "pdf-close",
            "pdf-arrow",
            "pdf-modal",

            // Buttons
            "btn-loading",

            // Bootstrap (nutné)
            "dropdown",
            "dropdown-menu",
            "dropdown-item",
            "dropdown-toggle",
            "fade",
            "show",
            "collapse",
            "collapsing",

            // ScrollSpy
            "nav-link",
            "nav-item",
            "menu-item",

            // Animácie
            "fadeIn",
            "fadeInUp",
            "slide",
            "bubble",
            "bubblePop"
          ],

          deep: [
            /weather/,
            /sideNav/,
            /hover-bubble/,
            /tooltip/,
            /modal/,
            /pdf/,
            /rating/,
            /skill/,
            /skills/,
            /timeline/,
            /menu/,
            /nav/,
          ]
        }
      })
  ].filter(Boolean),

  css: {
    devSourcemap: true
  }
});
