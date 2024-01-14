import { defineConfig } from 'vite'
import path from "node:path";
import {cwd} from "node:process";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/background/index.ts',
      name: 'background',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
      },
    },
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
