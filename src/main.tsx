import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './popup/popup.tsx'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import 'virtual:uno.css'
import '@unocss/reset/normalize.css'

const isDev = process.env.NODE_ENV === 'development'
// for dev
isDev && import('./content/index.tsx')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Popup/>
    </ConfigProvider>
  </React.StrictMode>
)
