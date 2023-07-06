import { bexBackground } from 'quasar/wrappers'

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never]
    getTime: [never, number]

    'storage.get': [{ key: string | null }, any]
    'storage.set': [{ key: string; value: any }, any]
    'storage.remove': [{ key: string }, any]
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

const installedTabIds: (string | number)[] = []

/** chrome.runtime.onConnect 时运行 */
export default bexBackground((bridge, activeConnections) => {
  const [activeId] = Object.keys(activeConnections)

  bridge.on('sendRequestList', ({ data }) => {
    console.log('background sendRequestList')
    bridge.send('getRequestList', data)
  })

  /** 防止以下监听多次绑定 */
  // if (installedTabIds.includes(activeId)) {
  //   console.log('已安装')
  //   return
  // }

  chrome.action.onClicked.addListener(() => {
    console.log('background toggleShow')
    bridge.send('toggleShow')
  })

  installedTabIds.push(activeId)
})
