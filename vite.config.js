import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => `/api${path}`
      },
      '/products': {
        target: 'http://localhost:5173', // 前台系统的默认端口，根据实际情况调整
        changeOrigin: true
      },
      '/brands': {
        target: 'http://localhost:5173', // 前台系统的默认端口，根据实际情况调整
        changeOrigin: true
      }
    }
  }
})
