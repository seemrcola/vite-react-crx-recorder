import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import {v4 as uuidv4} from "uuid"
import React from "react";
import 'virtual:uno.css'

export const GoogleSidebar: React.FC = () => {
  function toggleRecordBox() {
    console.log('click!!')
  }
  
  return (
    <>
      <Movebar toggleRecordBox={toggleRecordBox}/>
    </>
  )
}

const app = document.createElement('div')
const id = '--crx--content--' + uuidv4()
app.id = id
// app.style.cssText = `
//   position: fixed;
//   z-index: 2147483647;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
// `
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
