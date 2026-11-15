import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // `npm run dev` sends the relay's calls to the backend, running on :3000.
  server: { proxy: { '/agents': 'http://localhost:3000' } },
})
