// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Lee dinámicamente la información del package.json
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

// Centra la versión dinámicamente en el marco ASCII de Aex Studios
const verStr = String(pkg.version || '1.7');
const totalWidth = 59;
const padStart = Math.max(0, Math.floor((totalWidth - verStr.length) / 2));
const padEnd = Math.max(0, totalWidth - verStr.length - padStart);
const versionLine = `*   | |${' '.repeat(padStart)}${verStr}${' '.repeat(padEnd)}| |`;

// Marca de agua oficial en ASCII Art
const banner = `/*!
* __| |___________________________________________________________| |__
* __   ___________________________________________________________   __
*   | |                                                           | |  
*   | |    _    _______  __  ____ _____ _   _ ____ ___ ___  ____  | |  
*   | |   / \\  | ____\\ \\/ / / ___|_   _| | | |  _ \\_ _/ _ \\/ ___| | |  
*   | |  / _ \\ |  _|  \\  /  \\___ \\ | | | | | | | | | | | | \\___ \\ | |  
*   | | / ___ \\| |___ /  \\   ___) || | | |_| | |_| | | |_| |___) || |  
*   | |/_/   \\_\\_____/_/\\_\\ |____/ |_|  \\___/|____/___\\___/|____/ | |  
* __| |___________________________________________________________| |__
* __   ___________________________________________________________   __
${versionLine}  
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
        comments: /^!/, // Preserva el banner ASCII
      },
    },
  },
});