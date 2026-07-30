import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Development server configuration
  server: {
    port: 3000,
    strictPort: true, // Fail if port 3000 is already in use (no auto-increment)
    open: true, // Auto-open browser on start
  },

  // Preview (production build) server configuration
  preview: {
    port: 3000,
    strictPort: true,
  },

  build: {
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core — smallest, cached longest
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }
          // Recharts and its d3/victory dependencies (large charting library)
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
            return 'vendor-charts';
          }
          // Three.js and React Three Fiber (3D / animated background)
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          // Lucide icon set
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // All remaining node_modules go into a single shared vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },


  // Optimize common dependencies for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast'],
  },
});
