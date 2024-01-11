import type { PluginOption } from 'vite';
import chokidar from 'chokidar';
import {spawn} from "child_process";

let watcher: chokidar.FSWatcher

function watchFile() {
  watcher && watcher.close()
  
  watcher = chokidar.watch(
    'dist/content_crx/**/*',
    {
      persistent: true, // 监听是否持久性的，设为 false 表示只监听一次
    }
  )
  watcher.on('all', () => { // 监听所有事件
    console.log('ooooooo')
    // 触发合并
    const mergeSpawn = spawn('npm', ['run', 'merge'])
    mergeSpawn.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    mergeSpawn.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    mergeSpawn.on('close', () => {
      console.log('%c merge success', 'color: green')
      console.log('%c build success', 'color: green')
    });
  })
  
  // 当ctrl+c时，关闭watcher
  process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
  })
}

export default function vitePluginMerge(): PluginOption {
  return {
    // 插件名称
    name: 'vite-plugin-template',
    // pre 会较于 post 先执行
    enforce: 'pre', // post
    // 指明它们仅在 'build' 或 'serve' 模式时调用
    // apply 亦可以是一个函数
    apply: 'serve',
    // 1. vite 独有的钩子：可以在 vite 被解析之前修改 vite 的相关配置。钩子接收原始用户配置 config 和一个描述配置环境的变量env
    config(config) {
      watchFile()
      return config
    },
  };
}
