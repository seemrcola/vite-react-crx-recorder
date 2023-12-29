import React, {useEffect, useRef, useState} from "react"

export const useDrag = (domRef: React.RefObject<HTMLDivElement>) => {
  const [dragging, setDragging] = useState(false)
  const startPosition = useRef({x: 0, y: 0})
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true)
    startPosition.current = {x: e.clientX, y: e.clientY}
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    if (!dragging) return
    // 计算偏移
    const {clientX, clientY} = e
    const deltaX = clientX - startPosition.current.x
    const deltaY = clientY - startPosition.current.y
    // 如果没有 domRef.current，直接返回
    if(!domRef.current) return
    // 获取当前位置
    const {left, top} = domRef.current.getBoundingClientRect()
    // 更新位置
    domRef.current.style.left = `${left + deltaX}px`
    domRef.current.style.top = `${top + deltaY}px`
    // 更新起始点
    startPosition.current = {x: clientX, y: clientY}
  }
  
  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    setDragging(false)
  }
  
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging])
  
  return {
    dragging,
    handleMouseDown
  }
}
