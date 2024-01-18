import React, {useEffect} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import '@videojs/themes/dist/sea/index.css';

const Player:React.FC = () => {
  function initPlayer(url: string) {
    videojs('player', {
      sources:[
        {
          src: url,
          type: 'video/webm'
        }
      ],
    });
  }
  
  useEffect(() => {
    initPlayer('http://vjs.zencdn.net/v/oceans.mp4')
  }, [])
  
  return (
    <div>
      <video
        id="player"
        className="video-js vjs-theme-sea"
        controls
        preload="auto"
        width="1000"
        height="600"
      />
    </div>
  )
}

export default Player
