import fs from 'node:fs';
import path from 'node:path';
import {cwd} from 'node:process';
import {CRX_OUT_DIR, BACKGROUND_SCRIPT_BUILD_DIR, CONTENT_SCRIPT_BUILD_DIR} from './globalConfig.mjs'

/**
 * 拷贝目录文件
 * @param src   源目录
 * @param dest  目标目录
 */
function copyDir(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, {recursive: true})
  }
  
  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcFile = path.join(src, file)
    const destFile = path.join(dest, file)
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}

// 源目录
const contentScriptBuildDir = path.resolve(cwd(), CONTENT_SCRIPT_BUILD_DIR)
const backgroundScriptBuildDir = path.resolve(cwd(), BACKGROUND_SCRIPT_BUILD_DIR)
// 目标目录
const crxOutDir = path.resolve(cwd(), CRX_OUT_DIR)

// 开始复制--------------------------------------------------------------------
console.log('开始复制')
copyDir(contentScriptBuildDir, crxOutDir)
copyDir(backgroundScriptBuildDir, crxOutDir)
console.log('复制完成')
// 开始压缩--------------------------------------------------------------------
