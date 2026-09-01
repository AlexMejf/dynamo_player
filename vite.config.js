// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Lee dinámicamente la información del package.json
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

// Genera la marca de agua / banner oficial
const banner = `/*!
 * Dynamo Player v${pkg.version}
 * ${pkg.description || 'Ultra-lightweight & modern HTML5 web video player'}
 * Author: ${pkg.author || 'Aex Studios (Alex Mejia)'}
 * License: ${pkg.license || 'MIT'}
 * Repository: https://github.com/AlexMejf/dynamo_player
 * Build Date: ${new Date().toISOString().split('T')[0]}
 */
`;

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'dynamo.js'),
      name: 'DynamoPlayer',
      fileName: (format) => format === 'iife' ? 'dynamo-player.min.js' : `dynamo-player.${format}.js`,
      formats: ['iife', 'es'],
    },
    rollupOptions: {
      external: [],
      output: {
        banner: banner,
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    sourcemap: true,
    terserOptions: {
      compress: {
        passes: 2,
        pure_funcs: ['console.log'],
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: /^!/, // Preserva comentarios de licencia / marca de agua con /*!
      },
    },
  },
});