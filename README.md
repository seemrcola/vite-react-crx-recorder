### vite-react-crx
`模板功能`
- [x] 处理popup页面
- [x] 处理background页面
- [x] 处理content_scripts页面
- [ ] 处理options页面
- [x] 集成react
- [x] 集成antd
- [x] 集成uncoss


`这个案例实现了一个简单的chrome插件。包含如下功能：`
- [x] 一个选浮球 [conent_scripts]
- [x] 一个基础录制功能 [conent_scripts]
- [x] 一个基础popup页面 [popup]

#### dev
```bash
pnpm dev
```
此时会运行popup页面，将main.tsx中注释的代码取消注释，即可运行content_scripts页面。可以在热更新的情况下进行UI开发。  
如果涉及到需要用到插件api的功能，则需要进行打包之后进行调试。

#### build
```bash
pnpm build:popup
pnpm build:content
pnpm build:background
```
这三个命令分别打包popup、content_scripts、background页面。  
分别打包到(这部分写在globalConfig.mts中)
```js
// chrome ext 最终的输出结果
export const CRX_OUT_DIR = 'build'
// 临时的 build content script 的目录
export const CONTENT_SCRIPT_BUILD_DIR = '_build_content_script'
// 临时的 build background script 的目录
export const BACKGROUND_SCRIPT_BUILD_DIR = '_build_background_script'
```
可以使用
```bash
pnpm build:all
```
进行一键打包。  
打包之后执行
```bash
pnpm merge
```
将打包后的文件合并到build目录下。

### tips
build.mts和globalConfig.mts之所以使用mts，原因如下：
https://github.com/TypeStrong/ts-node/issues/2094

