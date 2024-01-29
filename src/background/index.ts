/*global chrome*/

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

chrome.runtime.onMessage.addListener(() => {

})
/********************************* for record *********************************/
