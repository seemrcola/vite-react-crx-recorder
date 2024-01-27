import React, {useRef, useState} from "react"
import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import Bubble from "./components/bubble";
import {Options} from "./components/options";
import { useRecorder } from '../hooks/useRecorder.ts'

const Kbps = 1000
type UseRecorderResult = ReturnType<typeof useRecorder>

const Recorder: React.FC = () => {
  const [showRecordBox, setShowRecordBox] = useState(false)
  const [cameraMicrophoneStream, setCameraMicrophoneStream] = useState<null | MediaStream>(null)
  const recordData = useRef<any[]>([])
  const [start, setStart] = useState(false)
  
  const Recorder = useRef<UseRecorderResult>({} as UseRecorderResult)
  Recorder.current = useRecorder(5000)
  
  // 录制器参数
  const options = useRef({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  
  // 与popup通信 传递参数 更改录制设置
  chrome.runtime.onMessage.addListener(function(request) {
    if(request.action === 'recordParams') {
      options.current = request.data
    }
  })
  
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
    
    if (state) {
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getDisplayMedia()
      } catch (e) {
        setStart(false)
        return
      }
      
      // 开启录制器
      // fixme: 合成的流无法使用video标签播放
      const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
      const [audioTrack] = audioStream.getAudioTracks()
      const [videoTrack] = stream.getVideoTracks()
      const recorderStream = new MediaStream([videoTrack, audioTrack])
      // fixme: 无法使用video标签播放
      Recorder.current.startRecording(recorderStream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: options.current.video, // 视频码率
        audioBitsPerSecond: options.current.audio,  // 音频码率
      })
      Recorder.current.addDataAvailableCallback((e) => {
        recordData.current.push(e.data)
        // 告诉background一声
        // 1. 首先将数据转成base64
        // 2. 发送给background
        // 3. background接收到数据后将其转成blob
        const reader = new FileReader()
        reader.readAsDataURL(e.data)
        reader.onload = () => {
          chrome.runtime.sendMessage({action: 'recordData', data: reader.result})
        }
      })
      Recorder.current.addStopCallback(() => {
        setStart(false)
        openCustomPage()
      })
      return
    }
    Recorder.current.endRecording()
  }
  
  function openCustomPage() {
    const url = chrome.runtime.getURL('custom.html')
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

