import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/data/conjugation_tables')) {
            return 'data-tables';
          }
          if (id.includes('src/data/questions')) {
            return 'data-questions';
          }
          if (id.includes('src/data/verb')) {
            return 'data-verb';
          }
        }
      }
    }
  }
})