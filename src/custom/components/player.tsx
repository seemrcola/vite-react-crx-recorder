import React, {useEffect, useRef} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/sea/index.css';
import db from '../../db'

type Player = ReturnType<typeof videojs>

const Player:React.FC = () => {
  const player = useRef<Player>()
  
  function initPlayer(url: string) {
    // 销毁实例
    if (player.current) {
      player.current.dispose()
    }
    player.current = videojs('player', {
      sources:[
        {
          src: url,
          type: 'video/webm'
        }
      ],
    });
  }
  
  function getRecordData() {
    db.table('recordData').toArray().then((recordData: any[]) => {
      // 将所有的base64拿到转成blob
      const allBase64 = recordData.map(item => item.data)
      const allBlob = allBase64.map(item => {
        const byteString = atob(item.split(',')[1])
        const mimeString = item.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {type: mimeString})
      })
      // 合成一个blob
      const blob = new Blob(allBlob, {type: 'video/webm'})
      // 生成url
      const url = URL.createObjectURL(blob)
      // 初始化播放器
      initPlayer(url)
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
