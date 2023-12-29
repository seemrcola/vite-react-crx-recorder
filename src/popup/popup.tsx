import {Icon} from '@iconify/react';
import css from './popup.module.css'
import React, {useState} from "react";

const Popup: React.FC = () => {
  const [tab, setTab] = useState<'snapshot'|'recorder'>('snapshot')
  
  function toggleSetting(tab: 'snapshot'|'recorder') {
    setTab(tab)
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
        {tab === 'recorder' && <div>recorder</div>}
      </main>
    </div>
    
  )
}

export default Popup
