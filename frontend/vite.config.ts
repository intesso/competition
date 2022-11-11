import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  console.log('frontend env', env)
  // https://vitejs.dev/config/
  return defineConfig({
    envDir: '.',
    envPrefix: 'SHARED_',
    plugins: [react()],
    server: {
      hmr: { host: env.SHARED_SERVER },
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
}
