// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'dynamo.js'), 
      name: 'DynamoPlayer',
      // Name of the final output file
      fileName: (format) => `dynamo-player.${format}.js`,
      formats: ['iife', 'es'] 
    },
    rollupOptions: {
      // Ensure external dependencies are not included if not desired
      external: [], 
      output: {
        globals: {
          // If using external libraries like Hls.js, they would be mapped here
        }
      }
    },
    cssCodeSplit: false,
    minify: 'terser', 
    sourcemap: true,   
    terserOptions: {
      format: {
        comments: false, // Remove all comments to reduce file size
      },
    },
  }
});