import React from 'react'
import ReactDOM from 'react-dom/client'
import {Button, ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import db from '../db'

import Player from './components/player.tsx'

import 'virtual:uno.css'

function clear() {
  // 清除录制的视频
  db.table('recordData').clear()
}

window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  // 标准的确认消息
  const confirmationMessage = '确定要离开吗？';
  // 设置确认消息
  e.returnValue = confirmationMessage;
  // 清除录制的视频
  db.table('recordData').clear()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Player />
      <Button onClick={clear}>点我清除视频</Button>
    </ConfigProvider>
  </React.StrictMode>
)
