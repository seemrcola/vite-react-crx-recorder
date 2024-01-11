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

#### build
```bash
pnpm build
```

### reload
目前reload插件通过的是contextMenu来做的，暂时没有想到更好的办法。

### tips
1. ts-node的一个问题，做个记录：  
https://github.com/TypeStrong/ts-node/issues/2094

2. 为了避免收到宿主页面的样式影响，在content_scripts中使用了shadow-dom

### bug
1. [x] 浏览器插件环境不支持esm，但是content.js中使用了esm。(fixed: 单独打包content 缺点：需手动merge)
2. [x] 需要手动合并 content_crx 给 crx
