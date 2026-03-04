import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    minify: 'esbuild',
  },
  server: {
    open: true,
    port: 3000,
  }
})