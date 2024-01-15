// https://cn.rollupjs.org/plugin-development/#buildend
import {spawn} from "child_process";
import chalk from "chalk";

export default function buildEnd () {
  return {
    name: 'rollup-plugin-auto-merge', // 此名称将出现在警告和错误中
    buildEnd() {
      const mergeSpawn = spawn('npm', ['run', 'merge'])
      
      mergeSpawn.on('close', () => {
        console.log(chalk.blue.bold('🍻🍻🍻 rollup重新打包成功'));
        console.log(chalk.blue.bold('🎆🎆🎆 如果是content.js或者background.js更新，需要手动刷新插件'));
      })
    }
  }
}
