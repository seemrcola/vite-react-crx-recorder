import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './popup/popup.tsx'
import {ConfigProvider} from 'antd'

import 'virtual:uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <Popup/>
    </ConfigProvider>
  </React.StrictMode>
)
