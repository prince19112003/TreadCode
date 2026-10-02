import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';
import postcss from 'postcss';
import { transform as lightningcssTransform } from 'lightningcss';

// Custom plugin to unwrap @layer and transpile oklch()/modern colors for older Android WebViews (Chrome 65+)
function legacyCssCompatPlugin() {
  return {
    name: 'vite-plugin-legacy-css-compat',
    apply: 'build' as const,
    enforce: 'post' as const,
    async generateBundle(_: unknown, bundle: Record<string, unknown>) {
      const unlayer = (): any => ({
        postcssPlugin: 'unlayer',
        AtRule: {
          layer(atRule: any) {
            if (atRule.nodes) {
              atRule.replaceWith(...atRule.nodes);
            } else {
              atRule.remove();
            }
          },
        },
      });

      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith('.css')) {
          const chunk = bundle[fileName] as
            | { type?: string; source?: string | Uint8Array }
            | undefined;
          if (chunk && chunk.type === 'asset' && typeof chunk.source === 'string') {
            try {
              const unlayered = await postcss([unlayer()]).process(chunk.source, {
                from: undefined,
              });
              const lowered = lightningcssTransform({
                filename: fileName,
                code: Buffer.from(unlayered.css),
                targets: { chrome: 65 << 16 },
                minify: true,
              });
              chunk.source = lowered.code.toString();
              console.log(
                `[legacyCssCompat] Lowered ${fileName} for Chrome 65+ (unwrapped @layer, lowered modern colors)`
              );
            } catch (err) {
              console.warn(`[legacyCssCompat] Error transforming ${fileName}:`, err);
            }
          }
        }
      }
    },
  };
}

// Plugin to strip crossorigin attribute from stylesheet links so Android WebView doesn't CORS-block them
function stripCssCrossOriginPlugin() {
  return {
    name: 'vite-plugin-strip-css-crossorigin',
    transformIndexHtml(html: string) {
      return html
        .replace(/<link rel="stylesheet" crossorigin ([^>]*)>/g, '<link rel="stylesheet" $1>')
        .replace(/<link rel="stylesheet" crossorigin="[^"]*" ([^>]*)>/g, '<link rel="stylesheet" $1>')
        .replace(/<link rel="stylesheet" crossorigin>/g, '<link rel="stylesheet">');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    legacyCssCompatPlugin(),
    legacy({
      targets: ['chrome >= 65', 'android >= 8', 'firefox >= 68', 'edge >= 79', 'safari >= 13'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderModernChunks: true,
    }),
    stripCssCrossOriginPlugin(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase — large SDK, lazy-loaded after auth
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'chunk-firebase';
          }
          // Motion / Framer Motion — animation engine
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'chunk-motion';
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
