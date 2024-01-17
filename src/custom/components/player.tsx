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
      <video id={'player'}></video>
    </div>
  )
}

export default Player
