import {Icon} from '@iconify/react';
import css from './popup.module.css'
import React, {useEffect, useState} from "react";
import {Select, Tag, Button} from "antd";

const Kbps = 1000

chrome.runtime.onMessage.addListener(function(request) {
  if(request === 'openCustomPage') {
    window.open(chrome.runtime.getURL('custom.html'))
  }
})

const Popup: React.FC = () => {
  const [tab, setTab] = useState<'snapshot'|'recorder'>('recorder')
  const [options, setOptions] = useState({
    video: 1000 * Kbps, audio: 128 * Kbps
  })
  const optionsVideo = [
    {value: 500 * Kbps,  label: '流畅 500Kbps'},
    {value: 1000 * Kbps, label: '标清 1000Kbps (默认)'},
    {value: 2000 * Kbps, label: '高清 2000Kbps'},
    {value: 4000 * Kbps, label: '超清 4000Kbps'},
    {value: 8000 * Kbps, label: '原画 8000Kbps'}
  ]
  const optionsAudio = [
    {value: 128 * Kbps,  label: '标准 128Kbps (默认)'},
    {value: 192 * Kbps,  label: '高品质 192Kbps'},
    {value: 320 * Kbps,  label: '无损 320Kbps'}
  ]
  
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
    // 从本地获取录制器参数
    chrome.storage.local.get(['recordParams'], function(result) {
      if (result.recordParams) {
        setOptions(result.recordParams) // 修改录制器参数
        chrome.tabs.query(              // 与content-script通信 通知其修改录制器参数
          {active: true, currentWindow: true},
          function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id as number,
              {data: {...result.recordParams}, action: 'recordParams'}
            )
        })
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
        {
          tab === 'snapshot' &&
          <Button className={'w-full my-[10px]'} onClick={screenCapture}>截取当前屏幕</Button>
        }
        {
          tab === 'recorder' &&
          <div className={'text-sm'}>
            <label>
              <div className={'my-2px p-1 bg-light'}>视频清晰度</div>
              <Select
                className={'w-full'}
                value={options.video}
                options={optionsVideo}
                onSelect={(value) => select(value, 'video')}
              />
            </label>
            <label>
              <div className={'my-2px p-1 bg-light'}>音频采样</div>
              <Select
                className={'w-full'}
                value={options.audio}
                options={optionsAudio}
                onSelect={(value) => select(value, 'audio')}
              />
            </label>
           <div className={'absolute bottom-6 left-[50%] translate-x-[-50%]'}>
             <Tag color="#3b8597">点击网页内的浮标开始录制</Tag>
           </div>
          </div>
        }
      </main>
    </div>
  )
}

export default Popup
