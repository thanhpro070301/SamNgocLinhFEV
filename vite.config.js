import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/',
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
        target: 'https://samngoclinhproject.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true
      }
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin.*/, to: '/index.html' }
      ]
    }
  }
}) 