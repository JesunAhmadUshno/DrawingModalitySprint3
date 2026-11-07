import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The site reads Records/, the benchmark CSVs and RESEARCH_PAPER.md at build time, so every number on the page is generated, never typed.
export default defineConfig({
  base: '/DrawingModalitySprint3/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
  // The recorded strokes (about 470 KB of JSON) ship inside the bundle on purpose: one request, works offline.
  build: { chunkSizeWarningLimit: 800 },
});
