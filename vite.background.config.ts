import { defineConfig } from 'vite'
import path from "node:path";
import {cwd} from "node:process";
import buildEnd from './plugin/buildEnd'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/background/index.ts',
      name: 'background',
      formats: ['iife'],
    },
    rollupOptions: {
      plugins: [buildEnd()],
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
