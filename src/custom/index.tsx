import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import Player from './components/player.tsx'

import 'virtual:uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Player />
      <div>hello world!!</div>
    </ConfigProvider>
  </React.StrictMode>
)
