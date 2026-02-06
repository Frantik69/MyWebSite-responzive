import { defineConfig } from "vite";
import purgecss from 'vite-plugin-purgecss';

export default defineConfig({
  base: "/MyWebSite-responzive/",
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [
    purgecss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
      safelist: {
        deep: [
          /sideNav/,
          /weatherFloating/,
          /left-top/,
          /left-bottom/,
          /home-container/,
          /navbar/,
          /footer/,
          /grid/,
          /contact/,
          /portfolio/,
          /skills/,
          /about/,
        ]
      }
    })
  ],
  css: {
    devSourcemap: true
  },
  server: {
    watch: {
      ignored: []
    },
    hmr: true
  }
});
