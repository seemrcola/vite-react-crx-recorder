/*global chrome */
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('onMessage....', request, sender, sendResponse)
  sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
})
