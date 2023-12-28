import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from 'unocss/vite'

import {CONTENT_SCRIPT_BUILD_DIR} from "./globalConfig.mts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  
  build: {
    outDir: CONTENT_SCRIPT_BUILD_DIR,
    lib: {
      entry: path.resolve(cwd(), 'src/content/index.tsx'),
      formats: ['umd'], // content script 只能用 cjs 有三种形式 cjs es iife
      name: 'react-content-script', // umd模式必须要有name，否则会报错 'Missing name for UMD export'
      fileName: () => 'content.js', // 生成的文件名为content.js
    },
    rollupOptions: {
      output: {
        assetFileNames: () => 'content.css' // content script会生成配套的css
      }
    }
  },
  
  define: {
    'process.env.NODE_ENV': null,
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
