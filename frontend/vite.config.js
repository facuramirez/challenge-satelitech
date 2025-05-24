import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 3000, // puerto para 'vite dev'
  },
  preview: {
    port: 5000 // puerto para 'vite preview'
  },
  plugins: [react(), tailwindcss()],
})