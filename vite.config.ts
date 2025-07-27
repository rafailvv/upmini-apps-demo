import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-html5-routing',
      configurePreviewServer(server) {
        server.middlewares.use((req: any, _res, next) => {
          // If request starts with /miniapp/, strip the prefix so assets are served correctly
          if (req.url.startsWith('/miniapp/')) {
            // e.g., /miniapp/assets/... -> /assets/...
            req.url = req.url.replace(/^\/miniapp/, '')
          }
          if (!req.url.includes('.') && !req.url.includes('/assets/')) {
            req.url = '/index.html'
          }
          next()
        })
      }
    }
  ],
  base: '/', // Используем абсолютные пути
  server: {
    host: true,
    port: 4173,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'test.upmini.app',
      'muskrat-harmless-ideally.ngrok-free.app',
      '.ngrok-free.app', // Разрешаем все поддомены ngrok
      '.ngrok.io' // Альтернативный домен ngrok
    ]
  },
  build: {
    // Настройки для правильной обработки ассетов
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
