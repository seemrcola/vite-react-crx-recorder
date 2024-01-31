import React, {useEffect, useRef} from "react";
import Videojs from "video.js";
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/sea/index.css';
import db from '../../db'
import './player.css'

type Player = ReturnType<typeof Videojs>

const Player:React.FC = () => {
  const player = useRef<Player>()
  
  function initPlayer(url: string, mime: string) {
    if (player.current) {
      player.current.dispose()
    }
    player.current = Videojs('player', {
      sources:[
        {
          src: url,
          type: mime
        }
      ],
    });
  }
  
  function getRecordData() {
    db.table('recordData').toArray().then((recordData: any[]) => {
      const blob: Blob[] = []
      recordData.forEach((item: any) => {
        blob.push(item.data)
      })
      const blobData = new Blob(blob, {type: 'video/webm'})
      const url = URL.createObjectURL(blobData)
      initPlayer(url, 'video/webm')
    })
  }
  
  useEffect(() => {
    // 根据recordData字段获取录制的视频
    getRecordData()
  }, [])
  
  return (
    <div className={'w-800px h-480px bg-dark'}>
      <video
        id="player"
        className={"video-js vjs-theme-sea w-full h-full"}
        controls
        preload="auto"
      />
    </div>
  )
}

export default Player
