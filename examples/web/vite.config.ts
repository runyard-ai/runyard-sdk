import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // `npm run dev` sends the page's POST /chat to the backend, running on :3000.
  server: { proxy: { '/chat': 'http://localhost:3000' } },
})
