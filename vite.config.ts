import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH vem do workflow do GitHub Pages (ex.: "/marchello.ink/").
// Em dev, ou com domínio próprio, fica "/".
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.BASE_PATH || '/',
    plugins: [react()],
  }
})
