import {Icon} from "@iconify/react"
import React, {useRef, useState} from "react"

import animationText from "../animation.module.css"
import cssText from "../index.module.css"

// fixme: ~/hooks/useDrag 无法使用
import {useDrag} from "../../hooks/useDrag"

interface ListProps {
  children: React.ReactNode
  show?: boolean
  isUse?: boolean
  data?: any[]
}

const List: React.FC<ListProps> =
  ({children, show = false, isUse = true, data = null}) => {
    return (
      <div className="relative">
        {show && data && (
          <div
            className={`
            ${animationText.smooth_slideInDown}
            ${isUse ? "text-blue-300" : "text-red-500"}
            w-[280px] bg-[#212121] text-[#fff]
            absolute left-[-300px] z-[2147483647]
            p-4 text-sm
            rounded-[16px] border
          `}>
            {data.map((item, index) => {
              return <div key={`${index}`}>{item.label}</div>
            })}
          </div>
        )}
        {children}
      </div>
    )
  }

interface ConfigCardProps {
  cameraDevices: MediaDeviceInfo[]
  microphoneDevices: MediaDeviceInfo[]
  toggleStreamState: (type: "screen" | "video" | "audio", state: boolean) => void
  startRecord: (state: boolean) => void
  start: boolean
}

export const Options: React.FC<ConfigCardProps> =
  ({
     cameraDevices,
     microphoneDevices,
     toggleStreamState,
     startRecord,
     start
   }) => {
    const dragBoxRef = useRef<HTMLDivElement>(null)
    const [show, setShow] = useState({
      screen: false,
      video: false,
      audio: false
    })
    const [iconState, setIconState] = useState({
      screen: true,
      video: true,
      audio: true
    })
    
    const {handleMouseDown} = useDrag(dragBoxRef)
    
    function toggle(type: "screen" | "video" | "audio", event: React.MouseEvent) {
      event.preventDefault()
      setIconState({...iconState, [type]: !iconState[type]})
      toggleStreamState(type, !iconState[type])
    }
    
    return (
      <>
        {
          !start &&
          <div
            ref={dragBoxRef}
            className={`
              ${animationText.smooth_slideInLeft}
              fixed top-[20px] right-[20px] p-4
              border bg-[#212121] z-[100]
              h-[420px] w-[280px] rounded-[16px]
            `}
            onMouseDown={handleMouseDown}
          >
            <List show={show.video} isUse={iconState.video} data={cameraDevices}>
              <div
                className={cssText.hoverButton}
                onMouseEnter={() => setShow({...show, video: true})}
                onMouseLeave={() => setShow({...show, video: false})}>
                <Icon
                  icon={iconState.video ? "gg:camera" : "majesticons:camera-off-line"}
                  className={`
                    text-2xl hover:text-orange-400 hover:scale-125 transition-[300]
                    pointer-events-none
                    ${iconState.video ? "text-white" : "text-red-500"}
                  `}
                  onClick={(e) => toggle("video", e)}
                />
                <div className="text-white mx-8 max-w-[100px] truncate">
                  Camera
                </div>
              </div>
            </List>
            <List show={show.audio} isUse={iconState.audio} data={microphoneDevices}>
              <div
                className={cssText.hoverButton}
                onMouseEnter={() => setShow({...show, audio: true})}
                onMouseLeave={() => setShow({...show, audio: false})}>
                <Icon
                  icon={iconState.audio ? "ph:microphone-bold" : "iconamoon:microphone-off"}
                  className={`
                    text-2xl hover:text-orange-400 hover:scale-125 transition-[300]
                    pointer-events-none
                    ${iconState.audio ? "text-white" : "text-red-500"}
                  `}
                  onClick={(e) => toggle("audio", e)}
                />
                <div className="text-white mx-8 max-w-[100px] truncate">
                  Microphone
                </div>
              </div>
            </List>
            
            <div
              className={cssText.startButton}
              onClick={() => startRecord(true)}
            >
              Start Recording
            </div>
          </div>
        }
      </>
    )
  }
