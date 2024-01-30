import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd'
import db from '../db'

import Player from './components/player.tsx'

import 'virtual:uno.css'

function clear() {
  // 清除录制的视频
  db.table('recordData').clear()
}

window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  // 设置确认消息
  e.returnValue = '确定要离开吗？';
  // 清除录制的视频
  clear()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <Player />
    </ConfigProvider>
  </React.StrictMode>
)
