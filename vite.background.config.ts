import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import {cwd} from 'node:process';

import {BACKGROUND_SCRIPT_BUILD_DIR} from "./globalConfig.mts";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: BACKGROUND_SCRIPT_BUILD_DIR,
    lib: {
      entry: path.resolve(cwd(), 'src/background/index.ts'),
      formats: ['cjs'], // content script 只能用 cjs
      fileName: () => 'background.js', // 生成的文件名为content.js 不设置的话后缀会是cjs
    },
  },
  
  resolve: {
    alias: {
      '~': '/src' // 设置别名 这里配置之后相应的tsconfig.json中的paths也要配置
    }
  }
})
