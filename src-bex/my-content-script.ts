// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

import { bexContent } from 'quasar/wrappers'
import type { IRequestItem } from 'src-bex/dom'

console.log('bexContent running')

let isInstalled = false
let iframe: HTMLIFrameElement | null = null
let isIframeShow = true
let lastRequestList: IRequestItem[] = []
let curTabId: number | null = null

export default bexContent(async (bridge) => {
  if (window.self !== window.top) {
    return
  }
  const { data } = await bridge.send('getTabId')
  curTabId = data
  console.log('[bexContent] run', data)

  /** 转发给background */
  bridge.on('sendRequestList', ({ data }) => {
    lastRequestList = data
    if (!isInstalled) {
      return
    }
    bridge.send('sendRequestList', lastRequestList)
  })

  bridge.on('toggleShow', ({ data }) => {
    console.log('content toggleShow', isInstalled, iframe, data, curTabId)
    if (Number(curTabId) !== Number(data)) {
      return
    }

    if (isInstalled) {
      console.log('content toggleShow')
      toggleShowIframe()
      return
    }
    installIframe()
  })

  installIframe(false)

  const handleSendRequestList = () => {
    console.log('send message', lastRequestList)
    bridge.send('sendRequestList', lastRequestList)
  }

  /** 切换iframe显示 */
  function toggleShowIframe() {
    console.log('toggleShowIframe', iframe)
    if (!iframe) {
      return
    }

    if (isIframeShow) {
      handleSendRequestList && handleSendRequestList()
    }

    iframe.style.transform = isIframeShow ? 'translateY(0)' : 'translateY(-120%)'
    isIframeShow = !isIframeShow
  }

  /** 嵌入iframe */
  function installIframe(initialShow = true) {
    const curPageState = document.readyState
    const isPageNotLoaded = curPageState !== 'complete' && curPageState !== 'interactive'

    if (!isPageNotLoaded) {
      createPopupIframe()
      initialShow && toggleShowIframe()
      return
    }

    document.onreadystatechange = () => {
      if (document.readyState === 'interactive') {
        createPopupIframe()
        initialShow && toggleShowIframe()
      }
    }
  }

  /** 创建iframe插入当前tabs */
  function createPopupIframe() {
    /** 避免插入到子iframe中去，只在顶层插入 */
    if (window.self !== window.top) {
      return
    }

    iframe = document.createElement('iframe')

    iframe.style.cssText = `
    width: 518px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    left: auto;
    bottom: auto;
    z-index: 9999999;
    transition: all .3s linear;
    transform: translateY(-120%);
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
  `
    iframe.style.border = 'none'
    iframe.src = chrome.runtime.getURL('www/index.html')
    document.body.appendChild(iframe)
    console.log('installed done')
    isInstalled = true
  }
})
