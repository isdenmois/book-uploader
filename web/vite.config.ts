import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import solidPlugin from 'vite-plugin-solid'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solidPlugin(), WindiCSS()],
  resolve: {
    alias: {
      pages: resolve(__dirname, 'src/pages'),
      features: resolve(__dirname, 'src/features'),
      entities: resolve(__dirname, 'src/entities'),
      shared: resolve(__dirname, 'src/shared'),
    },
  },
})
