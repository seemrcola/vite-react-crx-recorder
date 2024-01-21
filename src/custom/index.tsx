import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider, Button} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import db from '../db'

import Player from './components/player.tsx'

import 'virtual:uno.css'

function clear() {
  // 清除录制的视频
  db.table('recordData').clear()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Player />
      <div>hello world!!</div>
      <Button onClick={clear}>点我清除视频</Button>
    </ConfigProvider>
  </React.StrictMode>
)
