import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      mode: 'shadow-dom'
    }),
    react(),
  ],
  
  build: {
    emptyOutDir: false,
    
    lib: {
      entry: 'src/content/index.tsx',
      name: 'content',
      formats: ['iife'],
    },
    
    rollupOptions: {
      output: {
        entryFileNames: 'content.js',
        assetFileNames: 'content.css',
      },
    },
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  },
  
  define: {
    'process.env.NODE_ENV': null,
  }
})
