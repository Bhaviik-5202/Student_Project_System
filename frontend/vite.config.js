import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for production - Vite uses esbuild by default
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
  // Optimization for development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast'],
  },
});
