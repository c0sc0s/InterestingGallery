import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'web',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'web/index.html'),
        calculator: resolve(__dirname, 'web/Calculator/index.html'),
        videoPlayer: resolve(__dirname, 'web/vedioPlayer/index.html'),
        memoryGame: resolve(__dirname, 'web/memoryGame/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

