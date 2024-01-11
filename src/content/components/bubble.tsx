import React, {useEffect, useRef} from "react"
import animationText from "../animation.module.css"
import cssBubble from './bubble.module.css'

// fixme: ~/hooks/useDrag 无法使用
import {useDrag} from "../../hooks/useDrag"

interface RecordBoxProps {
  cameraMicrophoneStream: MediaStream | null,
  startRecord: (state: boolean) => void,
  start: boolean
}

const Bubble: React.FC<RecordBoxProps>
  = ({cameraMicrophoneStream, startRecord, start}) => {
  const dragBoxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const {handleMouseDown} = useDrag(dragBoxRef)
  
  useEffect(() => {
    if (!cameraMicrophoneStream) return
    videoRef.current!.srcObject = cameraMicrophoneStream
  }, [cameraMicrophoneStream])
  
  return (
    <div
      ref={dragBoxRef}
      className={`${animationText.smooth_slideInRight} ${cssBubble.wrapper}`}
      onMouseDown={handleMouseDown}>
      <div
        className={`${cssBubble.videoBox}`}>
        <video
          autoPlay playsInline muted
          ref={videoRef}
          className={`${cssBubble.video}`}
        />
      </div>
      <div
        className={`
          ${!start ? cssBubble.start : cssBubble.stop}
          ${cssBubble.controls}
        `}
        onClick={() => start && startRecord(false)}
      />
    </div>
  )
}

export default Bubble

