/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('onMessage....', request, sender, sendResponse)
  sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
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
