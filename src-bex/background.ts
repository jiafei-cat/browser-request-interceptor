import { BexBridge } from '@quasar/app-vite'
import { bexBackground } from 'quasar/wrappers'

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never]
    getTime: [never, number]
    getTabId: [number]
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

const installedTabIds: (string | number)[] = []
console.log('background running')

/** 防止多次监听 */
let isListened = false

/**
 * chrome.runtime.onConnect 时运行
 * 在进入一个tab时, quasar会执行chrome.runtime.connect({ name: "contentScript" }) 从而触发bexBackground
 * 这里的bridge会和当前connect进行通信
 */
export default bexBackground((bridge, activeConnections) => {
  console.log('[bexBackground] connect content', activeConnections)

  const [curTabId] = Object.keys(activeConnections)

  bridge.on('getTabId', async ({ data, respond }) => {
    const result = await chrome.tabs.query({ active: true, currentWindow: true })
    respond(result[0].id)
  })

  bridge.on('sendRequestList', ({ data }) => {
    console.log('background sendRequestList')
    bridge.send('getRequestList', data)
  })

  if (isListened) {
    return
  }

  isListened = true

  chrome.action.onClicked.addListener(async () => {
    console.log('chrome background toggleShow')
    const data = await chrome.tabs.query({ active: true, currentWindow: true })

    bridge.send('toggleShow', data[0].id)
  })
})
