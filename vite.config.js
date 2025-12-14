import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy toutes les requêtes /api vers le backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Optionnel: réécrire le chemin si nécessaire
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

