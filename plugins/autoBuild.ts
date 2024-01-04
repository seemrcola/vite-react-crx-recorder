import type { PluginOption } from 'vite';
import chokidar from 'chokidar';
import {spawn} from "child_process";

let watcher: any = null;

// 打印子进程的输出/错误/退出
function log(process: any) {
  process.stdout.on('data', (data: any) => console.log(data.toString()));
  process.stderr.on('data', (data: any) => console.error(data.toString()));
  process.on('exit', (code: any) => console.log(`子进程退出，退出码 ${code}`));
}

function watchDevFile(dir: string) {
   watcher && watcher.close();
   
   watcher = chokidar.watch(`src/${dir}/**`)
   watcher.on('change', () => {
    // 开一个子进程来执行打包命令
    const buildProcess = spawn('pnpm', ['run', `build:${dir}`]);
    log(buildProcess);
    
    buildProcess.on('exit', (code) => {
      if(code !== 0) return console.error('-------打包失败-------');
      // 执行完打包命令之后，执行合并命令
      const mergeProcess = spawn('pnpm', ['run', 'merge']);
      log(mergeProcess);
    });
  });
  
  // 监听进程退出 当进程退出的时候，关闭监听器
  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0);
  });
}

export default function viteAutoBuild(options: {dir: string}): PluginOption {
  return {
    // 插件名称
    name: 'vite-plugin-auto-build',
    // pre 会较于 post 先执行
    enforce: 'pre', // post
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    apply: 'serve', // apply 亦可以是一个函数
    // 1. vite 独有的钩子：可以在 vite 被解析之前修改 vite 的相关配置。钩子接收原始用户配置 config 和一个描述配置环境的变量env
    config(config) {
      watchDevFile(options.dir)
      return config;
    },
  };
}
