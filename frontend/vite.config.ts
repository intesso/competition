import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '.',
  envPrefix: 'SHARED_',
  plugins: [react()],
  esbuild: {
    // jsxInject: 'import React from \'react\'',
  }
})
