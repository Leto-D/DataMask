import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build en 3 passes :
// 1. Popup + Side Panel (HTML entries) = bundle principal
// 2. Content script = fichier JS autonome IIFE (post-build)
// 3. Background = fichier JS autonome IIFE (post-build)

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        'side-panel': resolve(__dirname, 'src/side-panel/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
  plugins: [
    {
      name: 'grid-build-content-scripts',
      closeBundle: async () => {
        const { build } = await import('vite');

        // Build content script (autonome, pas de chunks)
        await build({
          configFile: false,
          build: {
            outDir: 'dist',
            emptyOutDir: false,
            lib: {
              entry: resolve(__dirname, 'src/content/content-script.js'),
              formats: ['iife'],
              name: 'GridProtect',
              fileName: () => 'content/content-script.js',
            },
            rollupOptions: {
              output: {
                // Extension globale pour IIFE
                extend: true,
              },
            },
          },
        });

        // Build background service worker (autonome)
        await build({
          configFile: false,
          build: {
            outDir: 'dist',
            emptyOutDir: false,
            lib: {
              entry: resolve(__dirname, 'src/background/service-worker.js'),
              formats: ['iife'],
              name: 'GridBackground',
              fileName: () => 'background/service-worker.js',
            },
          },
        });
      },
    },
    {
      name: 'grid-copy-manifest',
      closeBundle: async () => {
        const fs = await import('fs');
        const path = await import('path');

        // Copy manifest.json
        fs.copyFileSync(
          path.resolve(__dirname, 'manifest.json'),
          path.resolve(__dirname, 'dist/manifest.json')
        );

        // Copy icons
        const iconsDir = path.resolve(__dirname, 'src/icons');
        const distIconsDir = path.resolve(__dirname, 'dist/icons');
        if (fs.existsSync(iconsDir)) {
          fs.mkdirSync(distIconsDir, { recursive: true });
          fs.readdirSync(iconsDir).forEach(file => {
            if (file.endsWith('.png')) {
              fs.copyFileSync(
                path.resolve(iconsDir, file),
                path.resolve(distIconsDir, file)
              );
            }
          });
        }
      },
    },
  ],
})
