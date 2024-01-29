### vite-react-crx
`模板功能`
- [x] 处理popup页面
- [x] 处理background页面
- [x] 处理content_scripts页面
- [x] 集成react
- [x] 集成antd
- [x] 集成unocss


`这个案例实现了一个简单的chrome插件。包含如下功能：`
- [x] 一个可拖拽悬浮球 [content_scripts]
- [x] 一个基础录制功能 [content_scripts]
- [x] shadow-dom的样式注入 [content_scripts]
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
