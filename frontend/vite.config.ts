import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  console.log('vite mode', mode)
  // https://vitejs.dev/config/
  return defineConfig({
    envDir: '.',
    envPrefix: 'SHARED_',
    plugins: [react()],
    preview: {
      port: env.SHARED_PORT
    },
    server: {
      // set hmr to false if you want to switch of hot module reload
      // hmr: false,
      hmr: { host: env.SHARED_SERVER },
      port: env.SHARED_PORT,
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
}
