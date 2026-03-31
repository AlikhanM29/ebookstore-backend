import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: true, // CORS-ты рұқсат ету
    proxy: {
      '/api': {
        target: 'https://ebookstore-backend-eubu.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})