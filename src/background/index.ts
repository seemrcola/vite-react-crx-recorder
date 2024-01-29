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

chrome.runtime.onMessage.addListener(async (request) => {
  if(request.action === 'openFramePage') {
    // 先记录下当前tabId
    const tab = await chrome.tabs.query({active: true, currentWindow: true})
    const tabId = tab[0].id
    await chrome.storage.local.set({tabId: tabId})
    
    chrome.tabs.create(
      {url: chrome.runtime.getURL('frame.html')},
      async (tab) => {
        await chrome.tabs.move(tab.id as number, {index: 0})
      }
    )
  }
  
  if(request.action === 'hideFrameTab') {
    // 取出tbaId 并跳转到该tab
    chrome.storage.local.get('tabId', (result) => {
      const tabId = result.tabId
      if(tabId) {
        chrome.tabs.get(tabId, async (tab) => {
          if(!tab) return
          await chrome.tabs.update(tab.id as number, {active: true})
        })
      }
    })
    // todo 隐藏frame.html v3 目前好像不允许隐藏
  }
  
  if(request.action === 'removeFrameTab') {
    chrome.tabs.query({url: chrome.runtime.getURL('frame.html')}, (tabs) => {
      tabs.forEach(async (tab) => {
        await chrome.tabs.remove(tab.id as number)
      })
    })
  }

})
/********************************* for record *********************************/
