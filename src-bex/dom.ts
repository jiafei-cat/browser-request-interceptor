// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from 'quasar/wrappers'

export interface IRequestItem {
  method: string
  requestURL: string | URL
}

type XMLOpenType = typeof XMLHttpRequest.prototype.open
type XMLOpenParamsType = Parameters<XMLOpenType>

const requestList: IRequestItem[] = []

export default bexDom((bridge) => {
  const originXMLHttpOpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function (...args) {
    const [method, requestURL] = args

    requestList.push({ method, requestURL })
    console.log('发送list', args)
    bridge.send('sendRequestList', requestList)
    return originXMLHttpOpen.apply(this, args as XMLOpenParamsType)
  } as XMLOpenType
})
