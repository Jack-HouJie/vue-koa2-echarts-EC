export default class SocketService {
  static instance = null
  // get表示为getter方法，调用时不加()
  static get Instacne () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }
  ws = null
  connected = false // 标识是否连接成功（成功时才能send）
  sendTryCount = 0  // 发送失败之后尝试的次数（不成功的次数越多，重试间隔越长）
  connectTryCount = 0 // 连接失败之后尝试的次数
  callBackMapping = {} // 回调函数（存储）
  // 注册回调函数（函数唯一表示，函数引用）
  registerCallBack = (type, callBackFunc) => {
    this.callBackMapping[type] = callBackFunc
  }
  // 取消回调函数
  unRegisterCallBack = type => {
    delete this.callBackMapping[type]
  }
  // 连接WebSocket
  connect () {
    if (!window.WebSocket) {
      alert('您的浏览器不支持WebSocket')
      return
    }
    // this.ws = new WebSocket('ws://127.0.0.1:9998')
    this.ws = new WebSocket(process.env.VUE_APP_SOCKETURL)
    // 监听连接成功
    this.ws.onopen = () => {
      this.connected = true
      this.connectTryCount = 0
    }
    // 监听连接失败
    this.ws.onclose = () => {
      console.log('连接失败，请重试...')
      this.connectTryCount++
      this.connected = false

      // 失败之后尝试连接
      setTimeout(() => {
        this.connect()
      }, this.connectTryCount * 500)
    }
    // 监听得到服务端发送的数据
    this.ws.onmessage = msg => {
      const msgObj = JSON.parse(msg.data)
      if (msgObj.action === 'getData') {
        if (msgObj.socketType) {
          // 调用指定回调，增加图标所需数据
          this.callBackMapping[msgObj.socketType].call(
            this,
            JSON.parse(msgObj.data)
          )
        }
      } else if (msgObj.action === 'fullScreen') {
        this.callBackMapping[msgObj.socketType].call(this, msgObj)
      } else if (msgObj.action === 'changeTheme') {
        this.callBackMapping[msgObj.socketType].call(this, msgObj)
      }
    }
  }
  // 发送数据给服务器
  send = data => {
    // 未连接成功时延迟发送数据
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendTryCount++

      // 尝试再次发送数据
      setTimeout(() => {
        this.send(data)
      }, this.sendTryCount * 500)
    }
  }
}
