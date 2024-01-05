import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  
  build: {
    outDir: 'crx',
    rollupOptions: {
      input: {
        main: 'index.html',
        background: 'src/background/index.ts',
        content: 'src/content/index.tsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.startsWith('__')) {
            // 删掉前两个下划线__ (unocss的文件有这个问题) 否则浏览器插件环境不识别
            return `assets/${assetInfo.name.slice(2)}`
          }
          return '[name].[ext]'
        }
      },
    },
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
