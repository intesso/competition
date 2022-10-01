import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '.',
  envPrefix: 'SHARED_',
  plugins: [react()],
  esbuild: {
    // jsxInject: 'import React from \'react\'',
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('proxy path:', path)
          return path
        }
      }
    }
  }
})
