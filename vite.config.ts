import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from "unocss/vite";
import buildEnd from './plugin/buildEnd';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],

  build: {
    emptyOutDir: false,
    rollupOptions: {
      plugins: [buildEnd('popup')],
      input: {
        popup: 'index.html',
        custom: 'custom.html',
      },
      output:{
        // ⚠️ 如果文件夹的名字存在__开头的名字，是不能通过浏览器插件的检查的
      }
    },
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
