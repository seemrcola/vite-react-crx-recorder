import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from "unocss/vite";
import VitePluginMerge from "./plugin/autoMerge";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      mode: 'shadow-dom'
    }),
    react(),
    VitePluginMerge(),
  ],
  
  build: {
    outDir: 'dist/content_crx',
    rollupOptions: {
      input: {
        content: 'src/content/index.tsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name as string
          // chrome插件不允许__开头的文件名
          if(name.startsWith('__')) return `${name.slice(2)}`
          return `${name}`
        },
      },
    },
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
