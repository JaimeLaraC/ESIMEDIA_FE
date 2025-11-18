import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
import { readFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  publicDir: 'dist',

  // --- CORRECCIÓN APLICADA AQUÍ ---
  // Esta línea se ha cambiado de '/ESIMedia/' a '/'
  // para que funcione con Firebase Hosting.
  base: '/', 
  // ------------------------------

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000, // Aumentar límite a 1000kB
    rollupOptions: {
      output: {
        manualChunks: {
          // React y core
          vendor: ['react', 'react-dom'],
          // Router
          router: ['react-router-dom'],
          // Utilidades
          utils: ['zxcvbn']
        }
      }
    }
  },
}))