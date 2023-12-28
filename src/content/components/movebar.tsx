import {Icon} from "@iconify/react"
import React, {useEffect, useRef, useState} from "react"

/**
 * @param cb 回调函数
 * @param queue 回调函数队列
 * @description
 * 优化性能，防止频繁触发
 */
function rafDebounce(cb: () => void, queue: any[]) {
  queue.push(cb)
  requestAnimationFrame(() => {
    if (queue.length !== 0) {
      const lastCallback = queue.pop()
      lastCallback && lastCallback()
      queue.length = 0
    }
  })
}

type Orientation = "top" | "bottom" | "left" | "right"

interface MovebarProps {
  toggleRecordBox: () => void
}

const Movebar: React.FC<MovebarProps> = ({toggleRecordBox}) => {
  // 处理屏幕中心点 -----------------------------------------
  const [center, setCenter] = useState({centerX: 0, centerY: 0})
  const [innerSize, setInnerSize] = useState({width: 0, height: 0})
  
  useEffect(() => {
    calcScreenCenter()
    
    function calcScreenCenter() {
      const documentElement = document.documentElement
      setCenter({
        centerX: documentElement.clientWidth / 2,
        centerY: documentElement.clientHeight / 2
      })
      setInnerSize({
        width: documentElement.clientWidth,
        height: documentElement.clientHeight
      })
      
      adsorb(true)
    }
    
    window.addEventListener("resize", calcScreenCenter)
    return () => {
      window.removeEventListener("resize", calcScreenCenter)
    }
  }, [])
  
  // 处理鼠标移动 -----------------------------------------
  let isMove = false
  let start = {startX: 0, startY: 0}
  const movebarRef = useRef<HTMLDivElement>(null) // 移动的元素
  const borderRef = useRef<HTMLDivElement>(null) // 边框
  const tasks: any[] = [] // 任务队列
  const shadows = {
    // 阴影
    left: useRef<HTMLDivElement>(null),
    right: useRef<HTMLDivElement>(null),
    top: useRef<HTMLDivElement>(null),
    bottom: useRef<HTMLDivElement>(null)
  }
  const [direction, setDirection] = useState<Orientation>("top") // 当前移动的方向
  
  function mousedownHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    isMove = true
    start = {startX: e.clientX, startY: e.clientY}
    
    document.addEventListener("mousemove", mousemoveHandler)
    document.addEventListener("mouseup", mouseupHandler)
    
    borderRef.current!.style.opacity = "1" // 显示边框
    Object.values(shadows).forEach((item) => {
      // 显示阴影
      item.current!.style.opacity = "1"
    })
  }
  
  function mousemoveHandler(e: MouseEvent) {
    // 去掉页面的选中效果
    e.preventDefault()
    if (!isMove) return
    const task = () => {
      const {clientX, clientY} = e
      // 作差算出移动距离
      const deltaX = clientX - start.startX
      const deltaY = clientY - start.startY
      // 获取当前left top
      const {left, top} = movebarRef.current!.getBoundingClientRect()
      // 移动元素
      movebarRef.current!.style.left = `${left + deltaX}px`
      movebarRef.current!.style.top = `${top + deltaY}px`
      // 更新start
      start = {startX: clientX, startY: clientY}
      // 阴影
      adsorb(false)
    }
    rafDebounce(task, tasks) // 优化性能
  }
  
  function mouseupHandler() {
    isMove = false
    document.removeEventListener("mousemove", mousemoveHandler)
    document.removeEventListener("mouseup", mouseupHandler)
    
    borderRef.current!.style.opacity = "0"
    setTimeout(() => {
      Object.values(shadows).forEach((item) => {
        item.current!.style.opacity = "0"
      })
    }, 300)
    adsorb(true)
  }
  
  // 放开鼠标的时候，我们需要根据屏幕对角线的中心点，将屏幕分成四个部分，判断元素在哪个部分，然后移动到对应的边
  function adsorb(ifMove = false) {
    // 1. 获取元素的中心点
    const {
      left,
      top,
      width,
      height
    } = movebarRef.current!.getBoundingClientRect()
    const elementCenterX = left + width / 2
    const elementCenterY = top + height / 2
    // 2. 获取屏幕的中心点
    const {centerX, centerY} = center
    // 3. 判断元素在哪个部分
    // 3.1算出屏幕两个对角线的函数 （屏幕中心点为原点）
    const k1 = centerY / centerX // 左下角到右上角
    const f1 = (x: number) => k1 * x
    const k2 = -centerY / centerX // 左上角到右下角
    const f2 = (x: number) => k2 * x
    // 3.2算出鼠标到是在两函数的哪一侧
    /**
     * k1下方K2上方 right
     * k1上方K2下方 left
     * k1上方K2上方 top
     * k1下方K2下方 bottom
     */
    let position: Orientation = "top"
    const x = elementCenterX - centerX
    const y = elementCenterY - centerY
    if (y < f1(x) && y < f2(x)) position = "top"
    if (y > f1(x) && y > f2(x)) position = "bottom"
    if (y > f1(x) && y < f2(x)) position = "left"
    if (y < f1(x) && y > f2(x)) position = "right"
    // 3.3 位置映射到屏幕边缘
    if (position === "top" || position === "bottom")
      shadows[position].current!.style.left = `${elementCenterX - 16}px`
    if (position === "left" || position === "right")
      shadows[position].current!.style.top = `${elementCenterY - 16}px`
    // 是否需要移动moveRef元素
    if (!ifMove) return
    setDirection(position) // 更新方向
    // 3.4. 移动元素
    movebarRef.current!.style.transition = "all 0.3s"
    requestAnimationFrame(() => {
      if (position === "right")
        movebarRef.current!.style.left = `${document.documentElement.clientWidth - width}px`
      if (position === "left") movebarRef.current!.style.left = `0px`
      if (position === "top") movebarRef.current!.style.top = `0px`
      if (position === "bottom")
        movebarRef.current!.style.top = `${document.documentElement.clientHeight - height}px`
    })
    // 3.5. 去掉动画
    setTimeout(() => {
      movebarRef.current!.style.transition = ""
    }, 150) // 这里略小于动画时间 有一种吸附的效果
  }
  
  function toggle() {
    // 传递给父组件这个事件
    toggleRecordBox()
  }
  
  return (
    <>
      <div ref={movebarRef} className="rounded-full p-4 fixed z-[2147483647]">
        {/*上下左右放置四个小盒子 -- 参考loom*/}
        {Object.keys(shadows).map((item, index) => {
          return (
            <div
              key={`drag-${index}`}
              className={`
                drag-${index}
                h-[16px] w-[16px] absolute
                rounded-[4px] bg-blue-500 cursor-pointer
                ${item === "left" ? "left-0 top-[50%] translate-y-[-50%]" : ""}
                ${item === "right" ? "right-0 top-[50%] translate-y-[-50%]" : ""}
                ${item === "top" ? "top-0 left-[50%] translate-x-[-50%]" : ""}
                ${item === "bottom" ? "bottom-0 left-[50%] translate-x-[-50%]" : ""}
              `}
              style={{display: direction === item ? "block" : "none"}}
              onMouseDown={(e) => mousedownHandler(e)}
            />
          )
        })}
        <div
          className="
            w-[52px] h-[52px]
            flex items-center justify-center
            box-border
            border-2 border-solid border-amber-500
            bg-amber-100 rounded-full p-[8px]
          "
          title={"点击前往录制页面"}>
          <Icon
            icon="icon-park:movie"
            width="32" height="32"
            onClick={toggle}
          />
        </div>
      </div>
      <div
        ref={borderRef}
        className="
          opacity-0 transition-[300]
          box-border border-[8px] border-solid border-[#f60]
          fixed left-0 top-0
          pointer-events-none
        "
        style={{
          width: innerSize.width,
          height: innerSize.height
        }}
      />
      {Object.keys(shadows).map((item, index) => {
        return (
          <div
            key={`shadow-${index}`}
            ref={shadows[item as keyof typeof shadows]}
            className={`
              movebar-shadow-${index}
              rounded-[4px] bg-blue-500
              fixed opacity-0
              pointer-events-none
              ${item === "left" || item === "top" ? "left-0 top-0" : "right-0 bottom-0"}
              ${item === "left" || item === "right" ? "h-[32px] w-[8px]" : "w-[32px] h-[8px]"}
            `}
          />
        )
      })}
    </>
  )
}

export default Movebar
