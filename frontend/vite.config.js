import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@assets': path.resolve(__dirname, './src/modules/user/assets'),
      '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react/')) {
            return 'react-vendor';
          }

          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }

          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('@studio-freight/lenis')) {
            return 'motion-vendor';
          }

          if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
            return 'ui-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})
