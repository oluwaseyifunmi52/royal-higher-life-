import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: path.resolve('C:/Users/USER/AppData/Local/Temp/Royal-Higherlife-vite-cache'),
  build: {
    outDir: path.resolve('C:/Users/USER/AppData/Local/Temp/Royal-Higherlife-build'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    configureServer: (server) => {
      const videoDir = 'C:/Users/USER/AppData/Local/Temp/kilo/videos';
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/videos/')) {
          const fileName = req.url.split('/').pop();
          const filePath = path.join(videoDir, fileName);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
            fs.createReadStream(filePath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end('Video not found');
          }
        } else {
          next();
        }
      });
    },
  },
})
