import {Icon} from '@iconify/react';
import css from './popup.module.css'
import React, {useState} from "react";
import {Select, Button} from "antd";

const Kbps = 1000

const Popup: React.FC = () => {
  const [tab, setTab] = useState<'snapshot'|'recorder'>('recorder')
  const optionsVideo = [
    {value: 500 * Kbps,  label: '流畅 500Kbps'},
    {value: 1000 * Kbps, label: '标清 1000Kbps'},
    {value: 2000 * Kbps, label: '高清 2000Kbps'},
    {value: 4000 * Kbps, label: '超清 4000Kbps'},
    {value: 8000 * Kbps, label: '原画 8000Kbps'}
  ]
  const optionsAudio = [
    {value: 128 * Kbps,  label: '标准 128Kbps'},
    {value: 192 * Kbps,  label: '高品质 192Kbps'},
    {value: 320 * Kbps,  label: '无损 320Kbps'}
  ]
  const optionsCamera = [
    {value: true,  label: '开启'},
    {value: false, label: '关闭'}
  ]
  
  function toggleSetting(tab: 'snapshot'|'recorder') {
    setTab(tab)
  }
  
  function select(value: any, type: 'video'|'audio'|'camera') {
    console.log(value, type)
    // 与 background 通信
    // chrome.runtime.sendMessage({type: 'change', data: {value, type}})
  }
  
  return (
    <div className={css.wrapper}>
      <header className={`
        w-full p-1
        flex items-center
        bg-#3b8597
      `}>
        <Icon icon="icon-park:movie" width="32" height="32" />
        <div className={'text-light text-sm mx-2'}>CRX录像机</div>
      </header>
      <div className={'py-1 h-14 flex text-sm b-b'}>
        <div className={`${css.tab} ${tab === 'recorder' ? 'bg-#3b8597 text-light' : ''} `}>
          <div onClick={() => toggleSetting('recorder')}>录像工具</div>
        </div>
        <div className={`${css.tab} ${tab === 'snapshot' ? 'bg-#3b8597 text-light' : ''} `}>
          <div onClick={() => toggleSetting('snapshot')}>截图工具</div>
        </div>
      </div>
      <main>
        {tab === 'snapshot' && <div>snapshot</div>}
        {
          tab === 'recorder' &&
          <div className={'text-sm'}>
            <label>
              <div className={'my-2px p-1 bg-light'}>视频清晰度</div>
              <Select
                className={'w-full'}
                defaultValue={'流畅 500Kbps'}
                options={optionsVideo}
                onSelect={(value) => select(value, 'video')}
              />
            </label>
            <label>
              <div className={'my-2px p-1 bg-light'}>音频采样</div>
              <Select
                className={'w-full'}
                defaultValue={'标准 128Kbps'}
                options={optionsAudio}
                onSelect={(value) => select(value, 'audio')}
              />
            </label>
            <label>
              <div className={'my-2px p-1 bg-light'}>开启摄像头</div>
              <Select
                className={'w-full'}
                defaultValue={'开启'}
                options={optionsCamera}
                onSelect={(value) => select(value, 'camera')}
              />
            </label>
            <Button className={'my-4 w-full'} type='primary'>开始录制</Button>
          </div>
        }
      </main>
    </div>
  )
}

export default Popup
