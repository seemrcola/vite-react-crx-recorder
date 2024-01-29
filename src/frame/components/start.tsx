import {useEffect, useRef} from "react";
import {useRecorder} from "../../hooks/useRecorder.ts";
import db from "../../db.ts";

const Kbps = 1000
type UseRecorderResult = ReturnType<typeof useRecorder>

function Start() {
  const Recorder = useRef<UseRecorderResult>({} as UseRecorderResult)
  Recorder.current = useRecorder(5000)
  const v = useRef<HTMLVideoElement | null>(null)
  
  // 录制器参数
  const options = useRef({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  
  async function startRecord() {
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getDisplayMedia()
      } catch (e) {
        return console.error(`[crx error] ${e}`)
      }
      
      // 混入音频
      const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
      const [audioTrack] = audioStream.getAudioTracks()
      const [videoTrack] = stream.getVideoTracks()
      const recorderStream = new MediaStream([videoTrack, audioTrack])
    
      v.current!.srcObject = recorderStream
      v.current!.play()
    
      Recorder.current.startRecording(recorderStream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: options.current.video,  // 视频码率
        audioBitsPerSecond: options.current.audio,  // 音频码率
      })
      Recorder.current.addDataAvailableCallback((e: BlobEvent) => {
        if(e.data) {
          db.recordData.add({'name': 'recordData', 'data': e.data})
        }
      })
      Recorder.current.addStopCallback(() => {
        openCustomPage()
      })
  }
  
  function openCustomPage() {
    const url = chrome.runtime.getURL('frame.html')
    window.open(url, '_blank')
  }
  
  function setOptions() {
    chrome.storage.local.get(['recordParams'], function(result) {
      if (result.recordParams) {
        options.current = {...options.current, ...result.recordParams}
        console.log(options.current, '-----')
      }
    })
  }
  
  useEffect(() => {
    setOptions()
    startRecord().catch(err => console.error(`[crx error] ${err}`))
  }, []);
  
  return (
    <>
      <video ref={v} className={'w-800px h-520px'} controls autoPlay={true} />
    </>
  )
}

export default Start
