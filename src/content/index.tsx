import React, {useEffect, useState} from "react"
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
    await getCameraMicrophone(!showRecordBox)
    await chrome.storage.local.set({showRecordBox: !showRecordBox})
  }
  
  async function getCameraMicrophone(recordBoxShow: boolean) {
    if (!recordBoxShow) {
      cameraMicrophoneStream?.getTracks().forEach(track => track.stop())
      setCameraMicrophoneStream(null)
      return false
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {width: 300, height: 300},
        audio: true,
      })
      setCameraMicrophoneStream(stream)
      return true
    }
    catch(err) {
      setShowRecordBox(false) // 如果不允许打开录制 则关闭录制框
      return false
    }
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
    // 做个缓冲
    setTimeout(async () => {
      setStart(state)
      await chrome.storage.local.set({start: state})
    }, 1000)
    
    if(state) {
      await openFramePage()
      return
    }
    await chrome.runtime.sendMessage({ action: "stopRecording" });
  }
  
  async function openFramePage() {
    // 打开frame页面
    await chrome.runtime.sendMessage({ action: "openFramePage" });
  }
  
  function init() {
    // 获取是否显示bubble/options框
    chrome.storage.local.get(['showRecordBox'], async function(result) {
      setShowRecordBox(!!result.showRecordBox)
      await getCameraMicrophone(!!result.showRecordBox)
    })
    // 获取是否录制中
    chrome.storage.local.get(['start'], function(result) {
      setStart(!!result.start)
    })
  }
  
  useEffect(() => {
    init()
    
    function listener (request: any) {
      if(request.action === 'tabChanged') {
        init()
      }
      if(request.action === 'closeBubble') {
        setShowRecordBox(false)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    
    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, []);
  
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
          {
            !start &&
            <Options
              toggleStreamState={toggleStreamStateHandler}
              startRecord={startRecordHandler}
            />
          }
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

