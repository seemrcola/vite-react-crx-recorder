import {useEffect, useRef} from "react";
import {useRecorder} from "../../hooks/useRecorder.ts";
import db from "../../db.ts";

const Kbps = 1000
type UseRecorderResult = ReturnType<typeof useRecorder>

function Start() {
  const Recorder = useRef<UseRecorderResult>({} as UseRecorderResult)
  Recorder.current = useRecorder(5000)
  
  // 录制器参数
  const options = useRef({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  
  // 监听content-script的消息
  chrome.runtime.onMessage.addListener(
    function(request) {
      if (request.action == "stopRecording") {
        Recorder.current.endRecording()
      }
    }
  )
  
  async function startRecord() {
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getDisplayMedia()
        // 清空之前的录制
        db.recordData.clear()
        // todo 隐藏掉这个frame tab
        await chrome.runtime.sendMessage({ action: "hideFrameTab" });
      } catch (e) {
        await chrome.runtime.sendMessage({ action: "removeFrameTab" });
        return console.error(`[crx error] ${e}`)
      }
      
      // 混入音频
      const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
      const [audioTrack] = audioStream.getAudioTracks()
      const [videoTrack] = stream.getVideoTracks()
      const recorderStream = new MediaStream([videoTrack, audioTrack])
    
      Recorder.current.startRecording(recorderStream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: options.current.video,  // 视频码率
        audioBitsPerSecond: options.current.audio,  // 音频码率
      })
      Recorder.current.addDataAvailableCallback((e: BlobEvent) => {
        if(e.data.size > 0) {
          db.recordData.add({'name': 'recordData', 'data': e.data})
        }
      })
      Recorder.current.addStopCallback(async () => {
        openCustomPage()
        await chrome.runtime.sendMessage({ action: "removeFrameTab" });
      })
  }
  
  function openCustomPage() {
    const url = chrome.runtime.getURL('custom.html')
    window.open(url, '_blank')
  }
  
  function setOptions() {
    chrome.storage.local.get(['recordParams'], function(result) {
      if (result.recordParams) {
        options.current = {...options.current, ...result.recordParams}
      }
    })
  }
  
  useEffect(() => {
    setOptions()
    startRecord().catch(err => console.error(`[crx error] ${err}`))
  }, []);
  
  return (
    <>
      <div className={'wh-full bg-auto flex-center'}>
        hello world
      </div>
    </>
  )
}

export default Start
