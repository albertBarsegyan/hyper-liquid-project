import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
