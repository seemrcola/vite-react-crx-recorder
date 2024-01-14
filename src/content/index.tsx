import {useRef, useState} from "react"
import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import Bubble from "./components/bubble";
import {Options} from "./components/options";

const Kbps = 1000

const Recorder = () => {
  const [showRecordBox, setShowRecordBox] = useState(false)
  const [cameraMicrophoneStream, setCameraMicrophoneStream] = useState<null | MediaStream>(null)
  const [displayStream, setDisplayStream] = useState<null | MediaStream>(null)
  const recordData = useRef<any[]>([])
  const mediaRecorder = useRef<MediaRecorder>()
  const [start, setStart] = useState(false)
  
  // 录制器参数
  const options = useRef({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  // 与popup通信
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request, sender)
    options.current = request
    sendResponse('ok')
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
      setDisplayStream(stream)
      // 开启录制器
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: options.current.video, // 视频码率
        audioBitsPerSecond: options.current.audio,  // 音频码率
      })
      const recorder = mediaRecorder.current
      recorder.start(1000)
      recorder.ondataavailable = (e) => {
        recordData.current.push(e.data)
      }
      recorder.onstop = () => {
        setStart(false)
        // 关闭录制流
        recorder.stream.getTracks().forEach(track => track.stop())
        // 下载录制文件
        downloadRecord()
        // 关闭全部流
        displayStream?.getTracks().forEach(track => track.stop())
        setDisplayStream(null)
      }
      return
    }
    mediaRecorder.current?.stop()
  }
  
  function downloadRecord() {
    const blob = new Blob(recordData.current, {type: 'video/webm'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'your-record.webm'
    a.click()
    // 清空录制数据
    a.remove()
    URL.revokeObjectURL(url)
    recordData.current = []
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

