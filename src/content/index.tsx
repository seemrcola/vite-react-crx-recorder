import {useEffect, useRef, useState} from "react"
import ReactDOM from "react-dom/client"
import Movebar from "./components/movebar";
import Bubble from "./components/bubble";
import {Options} from "./components/options";
import "virtual:uno.css"
import '@unocss/reset/normalize.css'

const GoogleSidebar = () => {
  const [showRecordBox, setShowRecordBox] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([])
  const [cameraMicrophoneStream, setCameraMicrophoneStream] = useState<null | MediaStream>(null)
  const [displayStream, setDisplayStream] = useState<null | MediaStream>(null)
  const recordData = useRef<any[]>([])
  const mediaRecorder = useRef<MediaRecorder>()
  const [start, setStart] = useState(false)
  
  async function toggleRecordBox() {
    setShowRecordBox(!showRecordBox)
    getCameraMicrophone(!showRecordBox)
  }
  
  useEffect(() => {
    getCameraDevices()
    
    // 枚举电脑摄像头设备
    async function getCameraDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices()
      devices.forEach(device => {
        if (device.kind === 'videoinput') setCameraDevices([...cameraDevices, device])
        if (device.kind === 'audioinput') setMicrophoneDevices([...microphoneDevices, device])
      })
    }
  }, []);
  
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
  
  function toggleStreamState(type: string, state: boolean) {
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
  
  async function startRecord(state: boolean) {
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
        videoBitsPerSecond: 3000000, // 视频码率
        audioBitsPerSecond: 128000,  // 音频码率
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
      <Movebar toggleRecordBox={toggleRecordBox}/>
      {showRecordBox &&
        <div>
          <Bubble
            cameraMicrophoneStream={cameraMicrophoneStream}
            startRecord={startRecord}
            start={start}
          />
          <Options
            cameraDevices={cameraDevices}
            microphoneDevices={microphoneDevices}
            toggleStreamState={toggleStreamState}
            startRecord={startRecord}
            start={start}
          />
        </div>
      }
    </>
  )
}

export default GoogleSidebar

const app = document.createElement('div')
const id = '--crx--content--'
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
