import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path' // 
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  server: {
    open: '/index.html', // Opens the website by default
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), 
        popup: resolve(__dirname, 'popup.html'), 
      },
    },
  },
})
