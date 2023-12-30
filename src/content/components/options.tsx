import {Icon} from "@iconify/react"
import React, {useRef, useState} from "react"

import animationText from "../animation.module.css"
import cssText from "../index.module.css"

// fixme: ~/hooks/useDrag 无法使用
import {useDrag} from "../../hooks/useDrag"

interface ConfigCardProps {
  toggleStreamState: (type: "video" | "audio", state: boolean) => void
  startRecord: (state: boolean) => void
  start: boolean
}

export const Options: React.FC<ConfigCardProps> =
  ({
     toggleStreamState,
     startRecord,
     start
   }) => {
    const dragBoxRef = useRef<HTMLDivElement>(null)
    const [iconState, setIconState] = useState({
      video: true,
      audio: true
    })

    const {handleMouseDown} = useDrag(dragBoxRef)

    function toggle(type: "video" | "audio") {
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
            <div className={cssText.hoverButton}>
              <Icon
                icon={iconState.video ? "gg:camera" : "majesticons:camera-off-line"}
                className={`
                  text-2xl hover:text-orange-400 hover:scale-125 transition-300
                  ${iconState.video ? "text-white" : "text-red-500"}
                `}
                onClick={() => toggle("video")}
              />
              <div className="text-white mx-8 max-w-[100px] truncate">
                Camera
              </div>
            </div>
            <div className={cssText.hoverButton}>
              <Icon
                icon={iconState.audio ? "ph:microphone-bold" : "iconamoon:microphone-off"}
                className={`
                  text-2xl hover:text-orange-400 hover:scale-125 transition-300
                  ${iconState.audio ? "text-white" : "text-red-500"}
                `}
                onClick={() => toggle("audio")}
              />
              <div className="text-white mx-8 max-w-[100px] truncate">
                Microphone
              </div>
            </div>
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
