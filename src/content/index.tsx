import React, {useState} from "react"
import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import Bubble from "./components/bubble";
import {Options} from "./components/options";

const Recorder: React.FC = () => {
  const [showRecordBox, setShowRecordBox] = useState(false)
  const [cameraMicrophoneStream, setCameraMicrophoneStream] = useState<null | MediaStream>(null)

  const [start, setStart] = useState(false)
  
  async function toggleRecordBoxHandler() {
    setShowRecordBox(!showRecordBox)
    getCameraMicrophone(!showRecordBox)
  }
  
  async function getCameraMicrophone(recordBoxShow: boolean) {
    if (!recordBoxShow) {
      cameraMicrophoneStream?.getTracks().forEach(track => track.stop())
      setCameraMicrophoneStream(null)
      return false
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {width: 300, height: 300},
      audio: true,
    })
    setCameraMicrophoneStream(stream)
    return true
  }
  
  function toggleStreamStateHandler(type: string, state: boolean) {
    if (type === 'audio') {
      cameraMicrophoneStream?.getAudioTracks().forEach(track => {
        track.enabled = state
      })
    }
    if (type === 'video') {
      cameraMicrophoneStream?.getVideoTracks().forEach(track => {
        track.enabled = state
      })
    }
  }
  
  async function startRecordHandler(state: boolean) {
    setStart(state)
    if(state) {
      openFramePage()
    }
  }
  
  function openFramePage() {
    const url = chrome.runtime.getURL('frame.html')
    window.open(url, '_blank')
  }
  
  return (
    <>
      <Movebar toggleRecordBox={toggleRecordBoxHandler}/>
      {showRecordBox &&
        <div>
          <Bubble
            start={start}
            cameraMicrophoneStream={cameraMicrophoneStream}
            startRecord={startRecordHandler}
          />
          <Options
            start={start}
            toggleStreamState={toggleStreamStateHandler}
            startRecord={startRecordHandler}
          />
        </div>
      }
    </>
  )
}

export default Recorder

const host = document.createElement('div')
document.body.append(host)
const shadowRoot = host.attachShadow({mode: 'open'})
const widgetRoot = ReactDOM.createRoot(shadowRoot)
widgetRoot.render(<Recorder/>)

// todo 向目标页面注入js
try {
  const insertScript = document.createElement('script')
  insertScript.setAttribute('type', 'text/javascript')
  insertScript.src = chrome.runtime.getURL('insert.js')
  document.body.appendChild(insertScript)
} catch (err) {
  console.log('[crx insert error:]' + err)
}

// todo 向目标页面注入unocss
try {
  const style = document.createElement('style')
  style.innerText = `@unocss-placeholder`
  shadowRoot.appendChild(style)
}catch (err) {
  console.log('[crx insert error:]' + err)
}

// todo 向目标页面注入css
try {
  const insertCss = document.createElement('link')
  insertCss.setAttribute('rel', 'stylesheet')
  insertCss.setAttribute('type', 'text/css')
  insertCss.href = chrome.runtime.getURL('content.css')
  // 插入到shadowRoot中
  shadowRoot.appendChild(insertCss)
}catch (err) {
  console.log('[crx insert error:]' + err)
}

