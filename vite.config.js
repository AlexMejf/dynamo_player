// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'dynamo.js'), 
      name: 'DynamoPlayer',
      // Cómo se llamará el archivo final
      fileName: (format) => `dynamo-player.${format}.js`,
      formats: ['iife', 'es'] 
    },
    rollupOptions: {
      // Asegúrate de que no incluya dependencias externas si no las quieres
      external: [], 
      output: {
        globals: {
          // Si usaras librerías externas como Hls.js, aquí se mapearían
        }
      }
    },
    cssCodeSplit: false,
    minify: 'terser', 
    sourcemap: true,   
    terserOptions: {
      format: {
        comments: false, // Borra todos los comentarios para ahorrar peso
      },
    },
  }
});