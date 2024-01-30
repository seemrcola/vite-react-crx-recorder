import {Icon} from '@iconify/react';
import css from './popup.module.css'
import React, {useEffect, useState} from "react";
import {Select, Tag, Button} from "antd";

const Kbps = 1000

const Popup: React.FC = () => {
  const [tab, setTab] = useState<'snapshot'|'recorder'>('recorder')
  const [options, setOptions] = useState({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  
  const optionsVideo = [
    {value: 1000 * Kbps, label: 'HD 1000Kbps (default)'},
    {value: 2000 * Kbps, label: '2K 2000Kbps'},
    {value: 4000 * Kbps, label: '4K 4000Kbps'},
    {value: 8000 * Kbps, label: '8K 8000Kbps'}
  ]
  const optionsAudio = [
    { value: 128, label: 'Standard 128Kbps (default)' },
    { value: 192, label: 'HQ 192Kbps' },
    { value: 320, label: 'Lossless 320Kbps' }
  ];
  
  function toggleSetting(tab: 'snapshot'|'recorder') {
    setTab(tab)
  }
  
  function select(value: any, type: 'video'|'audio') {
    // 与content-script通信
    setOptions({...options, [type]: value})
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id as number,
        {data: {...options, [type]: value}, action: 'recordParams'}
      )
    })
    // 存入本地
    chrome.storage.local.set({recordParams: {...options, [type]: value}})
  }
  
  function initParams() {
    chrome.storage.local.get(['recordParams'], function(result) {
      if (result.recordParams) {
        setOptions(result.recordParams)
      }
    })
  }
  
  useEffect(() => {
    initParams()
  }, []);
  
  function screenCapture() {
    // 当前屏幕截图
    // get windowId
    chrome.windows.getCurrent(function(window) {
      const windowId = window.id
      chrome.tabs.captureVisibleTab(windowId as number, {format: 'png'}, function(dataUrl) {
        downloadImage(dataUrl, 'current-page.png')
      })
    })
  }
  
  function downloadImage(url: string, name: string) {
    // a标签下载
    const a = document.createElement('a')
    a.download = name
    a.href = url
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className={css.wrapper}>
      <header className={`
        w-full p-1
        flex items-center
        bg-#3b8597
      `}>
        <Icon icon="icon-park:movie" width="32" height="32" />
        <div className={'text-light text-sm mx-2'}>CRX Recorder</div>
      </header>
      <div className={'py-1 h-14 flex text-sm b-b'}>
        <div className={`${css.tab} ${tab === 'recorder' ? 'bg-#3b8597 text-light' : ''} `}>
          <div onClick={() => toggleSetting('recorder')}>Recorder</div>
        </div>
        <div className={`${css.tab} ${tab === 'snapshot' ? 'bg-#3b8597 text-light' : ''} `}>
          <div onClick={() => toggleSetting('snapshot')}>Screenshot</div>
        </div>
      </div>
      <main>
        {
          tab === 'snapshot' &&
          <Button className={'w-full my-[10px]'} onClick={screenCapture}>Catch Screen</Button>
        }
        {
          tab === 'recorder' &&
          <div className={'text-sm'}>
            <label>
              <div className={'my-2px p-1 bg-light'}>Video Quality Adjustment</div>
              <Select
                className={'w-full'}
                value={options.video}
                options={optionsVideo}
                onSelect={(value) => select(value, 'video')}
              />
            </label>
            <div h-8></div>
            <label>
              <div className={'my-2px p-1 bg-light'}>Audio Quality Adjustment</div>
              <Select
                className={'w-full'}
                value={options.audio}
                options={optionsAudio}
                onSelect={(value) => select(value, 'audio')}
              />
            </label>
           <div className={'absolute bottom-6 left-[50%] translate-x-[-50%]'}>
             <Tag color="#3b8597">Click On The Buoy To Start Recording</Tag>
           </div>
          </div>
        }
      </main>
    </div>
  )
}

export default Popup
