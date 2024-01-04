import type { PluginOption } from 'vite';
import chokidar from 'chokidar';
import {spawn} from "child_process";

function watchDevFile(dir: string) {
  chokidar.watch(`src/${dir}/**`).on('all', (event) => {
    // 监听文件改变
    if(event === 'change') {
      // 开一个子进程来执行打包命令
      const buildProcess = spawn('pnpm', ['run', `build:${dir}`]);
      // 打印子进程的输出/错误/退出
      buildProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      buildProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      buildProcess.on('exit', (code) => {
        console.log(`子进程退出，退出码 ${code}`);
        if(code !== 0) return console.error('打包失败');
        // 执行完打包命令之后，执行合并命令
        const mergeProcess = spawn('pnpm', ['run', 'merge']);
        // 打印子进程的输出/错误/退出
        mergeProcess.stdout.on('data', (data) => {
          console.log(data.toString());
        });
        mergeProcess.stderr.on('data', (data) => {
          console.error(data.toString());
        });
        mergeProcess.on('exit', (code) => {
          console.log(`子进程退出，退出码 ${code}`);
        });
      });
    }
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
