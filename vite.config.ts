/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Pac-Man Lab',
        short_name: 'PacManLab',
        description: '3D Pac-Man Game',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
    // Ignore git worktrees kept under .claude so stale copies aren't tested.
    exclude: [...configDefaults.exclude, '**/.claude/**'],
  }
})