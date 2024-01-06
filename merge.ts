import fs from 'node:fs';
import path from 'node:path';

const CONTENT_CRX = 'dist/content_crx';
const CRX = 'dist/crx';

// 拷贝目录文件
function copyDir(src: string, dist: string) {
  const paths = fs.readdirSync(src);
  paths.forEach(function (p) {
    const _src = path.resolve(src, p);
    const _dist = path.resolve(dist, p);
    const stat = fs.statSync(_src);
    // 文件直接复制
    if (stat.isFile()) fs.copyFileSync(_src, _dist);
    // 如果是目录则递归调用自身
    if (stat.isDirectory()) copyDir(_src, _dist);
  });
  console.log('copy success');
}

copyDir(CONTENT_CRX, CRX)
