import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': 'http://localhost:5000',
      '/task': 'http://localhost:5000',
      '/project': 'http://localhost:5000',
      '/user_task': 'http://localhost:5000',
    }
  }
})
