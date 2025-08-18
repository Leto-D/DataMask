import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        popupjs: resolve(__dirname, 'src/popup/popup.js'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
        content: resolve(__dirname, 'src/content/content-script.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/service-worker.js'
          }
          if (chunkInfo.name === 'content') {
            return 'content/content-script.js'
          }
          if (chunkInfo.name === 'popupjs') {
            return 'src/popup/popup.js'
          }
          return 'assets/[name].js'
        },
      },
    },
  },
})