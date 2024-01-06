import React, {useEffect, useRef} from "react"
import animationText from "../animation.module.css"
import cssText from "../index.module.css"

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
      className={`
        ${animationText.smooth_slideInRight}
        fixed bottom-[10px] left-[10px] h-[240px] w-[240px] z-[2147483647]
      `}
      onMouseDown={handleMouseDown}>
      <div
        className="w-full h-full rounded-full bg-red-100 overflow-hidden cursor-pointer">
        <video
          autoPlay playsInline muted
          ref={videoRef}
          className="object-cover w-full h-full transform !scale-x-[-1]"
        />
      </div>
      <div
        className={`
          ${!start ? 'bg-blue-400' : 'bg-red-400'}
          ${cssText.controls}
        `}
        onClick={() => start && startRecord(false)}
      />
    </div>
  )
}

export default Bubble

