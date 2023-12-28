import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import {v4 as uuidv4} from "uuid"
import React from "react";
import {Modal} from "antd";
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'virtual:uno.css'

export const GoogleSidebar: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal()
  function toggleRecordBox() {
    const instance = modal.success({
      title: 'This is a notification message',
      content: 'This modal will be destroyed when it is closed.',
    })
    setTimeout(() => {
      instance.destroy()
    }, 2000)
  }
  
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Movebar toggleRecordBox={toggleRecordBox}/>
        {contextHolder}
      </ConfigProvider>
    </>
  )
}

const app = document.createElement('div')
const id = '--crx--content--' + uuidv4()
app.id = id
document.body.appendChild(app)
const root = ReactDOM.createRoot(document.getElementById(id)!)
root.render(<GoogleSidebar/>)

// 向目标页面注入js
try {
  const insertScript = document.createElement('script')
  insertScript.setAttribute('type', 'text/javascript')
  insertScript.src = chrome.runtime.getURL('insert.js')
  document.body.appendChild(insertScript)
} catch (err) {
  console.log(err)
}
