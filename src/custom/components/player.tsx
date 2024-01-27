import React, {useEffect, useRef} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/sea/index.css';
import db from '../../db'
import './player.css'

type Player = ReturnType<typeof videojs>

const Player:React.FC = () => {
  const player = useRef<Player>()
  
  function initPlayer(url: string, mime: string) {
    // 销毁实例
    if (player.current) {
      player.current.dispose()
    }
    // 初始化实例
    player.current = videojs('player', {
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
      // 将所有的base64拿到转成blob
      let mime = ''
      
      const allBlob = recordData.map(item => {
        const data = item.data
        
        const [prefix, base64] = data.split(',')
        const byteString = atob(base64)
        const mimeString = prefix.split(':')[1].split(';')[0]
        
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        
        mime = mimeString
        return new Blob([ab], {type: mimeString})
      })
      // 合成一个blob
      const blob = new Blob(allBlob, {type: mime})
      // 生成url
      const url = URL.createObjectURL(blob)
      // 初始化播放器
      initPlayer(url, mime)
    })
  }
  
  useEffect(() => {
    // 根据recordData字段获取录制的视频
    getRecordData()
  }, [])
  
  return (
    <div className={'w-1000px h-600px bg-dark'}>
      <video
        id="player"
        className="video-js vjs-theme-sea w-full h-full"
        controls
        preload="auto"
      />
    </div>
  )
}

export default Player
