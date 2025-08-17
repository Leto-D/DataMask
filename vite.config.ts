import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'popup/index': resolve(__dirname, 'src/popup/index.html'),
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content/content-script': resolve(__dirname, 'src/content/content-script.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background/service-worker') {
            return 'background/service-worker.js'
          }
          if (chunkInfo.name === 'content/content-script') {
            return 'content/content-script.js'
          }
          return 'assets/[name].[hash].js'
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})