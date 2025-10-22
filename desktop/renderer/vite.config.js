import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'desktop/renderer',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'desktop/renderer/src'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  },
  server: {
    port: 5173
  }
});
