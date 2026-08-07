import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5000,
    strictPort: true,
    open: false,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },

  preview: {
    port: 5000,
    strictPort: true,
    host: '0.0.0.0',
  },

  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 900,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hot-toast',
      'axios',
    ],
  },
});
