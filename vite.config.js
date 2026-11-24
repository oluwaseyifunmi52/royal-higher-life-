import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: 'dist',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },

    configureServer: (server) => {
      const videoDir = 'C:/Users/USER/AppData/Local/Temp/kilo/videos'

      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/videos/')) {
          const fileName = req.url.split('/').pop()
          const filePath = path.join(videoDir, fileName)

          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'video/mp4')
            res.setHeader('Accept-Ranges', 'bytes')
            fs.createReadStream(filePath).pipe(res)
          } else {
            res.statusCode = 404
            res.end('Video not found')
          }
        } else {
          next()
        }
      })
    },
  },
})
