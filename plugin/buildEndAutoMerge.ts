// https://cn.rollupjs.org/plugin-development/#buildend
import {spawn} from "child_process";

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
        console.log('%c merge success', 'color: green')
        console.log('%c build success', 'color: green')
      })
    }
  }
}
