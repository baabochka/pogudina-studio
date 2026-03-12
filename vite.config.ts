import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/pogudina-studio/',
  plugins: [
    svgr({
      svgrOptions: {
        svgo: true,
        svgoConfig: {
          plugins: [{ name: 'prefixIds' }],
        },
      },
    }),
    react(),
    tailwindcss(),
  ],
})
