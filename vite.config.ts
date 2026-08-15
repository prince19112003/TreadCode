import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import obfuscator from 'javascript-obfuscator';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'vite-plugin-javascript-obfuscator',
      apply: 'build',
      enforce: 'post',
      renderChunk(code) {
        const obfuscated = obfuscator.obfuscate(code, {
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: false,
          debugProtection: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,
        });
        return {
          code: obfuscated.getObfuscatedCode(),
          map: null,
        };
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Pixi.js — heavy 2D renderer, load separately
          if (id.includes('node_modules/pixi.js') || id.includes('node_modules/@pixi')) {
            return 'chunk-pixi';
          }
          // Firebase — large SDK, lazy-loaded after auth
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'chunk-firebase';
          }
          // Motion / Framer Motion — animation engine
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'chunk-motion';
          }
          // Howler — audio engine for voice narration
          if (id.includes('node_modules/howler')) {
            return 'chunk-audio';
          }
          // React Router — navigation
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'chunk-router';
          }
          // Lucide Icons — icon library
          if (id.includes('node_modules/lucide-react')) {
            return 'chunk-icons';
          }
          // Tauri plugins — desktop native APIs
          if (id.includes('node_modules/@tauri-apps')) {
            return 'chunk-tauri';
          }
          // Zod — schema validation
          if (id.includes('node_modules/zod')) {
            return 'chunk-zod';
          }
        },
      },
    },
    // Raise chunk warning limit slightly since we're now explicitly splitting
    chunkSizeWarningLimit: 600,
  },
});
