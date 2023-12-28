import {Button} from 'antd';
import css from './popup.module.css'

function Popup() {
  return (
    <div className={css.wrapper}>
      <Button type="primary">
        hello world
      </Button>
      <div className={'bg-red my-5'}>hello crx</div>
    </div>
  )
}

export default Popup
