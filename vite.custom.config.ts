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
      plugins: [buildEnd('custom')],
      input: {
        custom: 'custom.html',
      }
    }
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
