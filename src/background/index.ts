/*global chrome*/

import db from '../db'

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....')
})

/********************************* for reload *********************************/
// 创建上下文菜单
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'reload',
    title: 'Reload Vite-React-CRX',
  })
})

// 定义上下文菜单的回调函数
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'reload') {
    chrome.runtime.reload()
    if (!tab?.id) return
    await chrome.tabs.reload(tab.id)
  }
})
/********************************* for reload *********************************/

/********************************* for record *********************************/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request', request, sender, sendResponse)
  if(request.action === 'recordData') {
    console.log(request.data, 'request')
    // todo 保存录制数据
    recordDataHandler(request.data)
  }
})

function recordDataHandler(data: any) {
  console.log('-----')
  db.recordData.add({'name': 'recordData', 'data': data})
}

/********************************* for record *********************************/
