import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    port: 3000,
    strictPort: true, // Fail if port 3000 is already in use (no auto-increment)
    open: true,       // Auto-open browser on start
  },

  // Preview (production build) server configuration
  preview: {
    port: 3000,
    strictPort: true,
  },

  build: {
    cssCodeSplit: true,
    reportCompressedSize: true,
  },

  // Optimize common dependencies for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast'],
  },
});
