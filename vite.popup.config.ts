import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {CRX_OUT_DIR} from "./globalConfig.mts";
import path from 'node:path'
import {cwd} from 'node:process';
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  
  build: {
    outDir: CRX_OUT_DIR,
  },
  
  resolve: {
    alias: {
      '~': path.resolve(cwd(), 'src'),
    }
  }
})
