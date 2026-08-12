import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        precios: resolve(__dirname, 'precios.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
