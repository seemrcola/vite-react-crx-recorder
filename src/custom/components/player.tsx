import React, {useEffect} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

console.log(videojs, '-----')

const Player:React.FC = () => {
  useEffect(() => {
    const player = videojs('player', {});
    console.log(player, '-----')
  })
  return (
    <div>
      <video
        id="player"
        className="video-js"
        controls
        preload="auto"
        width="1000"
        height="600"
        poster="http://vjs.zencdn.net/v/oceans.png"
      >
        <source src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4"/>
        <p className="vjs-no-js">
          如果想使用video.js，请确保浏览器可以运行JavaScript，并且支持
          <a href="https://videojs.com/html5-video-support/" target="_blank">HTML5 video</a>
        </p>
      </video>
    </div>
  )
}

export default Player
