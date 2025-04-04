import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables" as *;`
      }
    }
  },
  publicDir: 'public',
  build: {
    assetsInlineLimit: 0,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    },
    sourcemap: true
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    fs: {
      strict: false
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          // Proxy events for debugging
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to target:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from target:', proxyRes.statusCode);
          });
        }
      }
    }
  }
}) 