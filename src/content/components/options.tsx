import {Icon} from "@iconify/react"
import React, {useRef, useState} from "react"

import animationText from "../animation.module.css"
import cssOptions from './options.module.css'

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
        <div className={'bg-red'}>hello</div>
        {
          !start &&
          <div
            ref={dragBoxRef}
            className={`
              ${animationText.smooth_slideInLeft}
              ${cssOptions.wrapper}
            `}
            onMouseDown={handleMouseDown}
          >
            <div className={cssOptions.hoverButton}>
              <Icon
                icon={iconState.video ? "gg:camera" : "majesticons:camera-off-line"}
                width={'24'} height={'24'}
                className={` ${cssOptions.icon}`}
                style={{color: iconState.video ? "white" : "red"}}
                onClick={() => toggle("video")}
              />
              <div className={`${cssOptions.text}`}>
                Camera
              </div>
            </div>
            <div className={cssOptions.hoverButton}>
              <Icon
                icon={iconState.audio ? "ph:microphone-bold" : "iconamoon:microphone-off"}
                width={'24'} height={'24'}
                className={`${cssOptions.icon}`}
                style={{color: iconState.audio ? "white" : "red"}}
                onClick={() => toggle("audio")}
              />
              <div className={`${cssOptions.text}`}>
                Microphone
              </div>
            </div>
            <div
              className={cssOptions.startButton}
              onClick={() => startRecord(true)}
            >
              Start Recording
            </div>
          </div>
        }
      </>
    )
  }
