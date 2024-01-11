// https://cn.rollupjs.org/plugin-development/#buildend
import {spawn} from "child_process";
import chalk from "chalk";

export default function buildEndAutoMerge () {
  return {
    name: 'rollup-plugin-auto-merge', // 此名称将出现在警告和错误中
    buildEnd() {
      const mergeSpawn = spawn('npm', ['run', 'merge'])
      
      mergeSpawn.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      mergeSpawn.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      mergeSpawn.on('close', () => {
        console.log(chalk.blue.bold('🍻🍻🍻 rollup重新打包成功'));
        console.log(chalk.blue.bold('👏👏👏 content子包合并成功'));
        console.log(chalk.blue.bold('🎆🎆🎆 浏览器刷新即可看到最新效果'));
      })
    }
  }
}
