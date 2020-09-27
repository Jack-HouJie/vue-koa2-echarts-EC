const path = require('path')
const WebSocket = require('ws')
const fileUtil = require('../utils/file_utils')
// 实例化WebSocket服务端
const wss = new WebSocket.Server({
  port: 9998
})
// 导出接口：服务监听
module.exports.listen = () => {
  // 监听WebSocket服务端实例的connection事件
  // 事件处理程序参数（单个连接对象）
  wss.on('connection', client => {
    // 监听连接对象的message事件
    // 事件处理程序参数（连接对象发送的数据）
    client.on('message', async msg => {
      try {
        const msgObj = JSON.parse(msg) // 反序列化JSON数据
        const action = msgObj.action // 提取通信类型
        // 通信类型：获取数据
        if (action === 'getData') {
          // 适应工具类读数据
          let filePath = '../data/' + msgObj.chartName + '.json'
          filePath = path.join(__dirname, filePath)
          const data = await fileUtil(filePath)
          // 增加字段保存数据
          msgObj.data = data.toString()
          // 数据序列化并发送回客户端
          client.send(JSON.stringify(msgObj))
        } 
        // 通信类型：全屏 & 主题切换
        else {
          // 遍历所有连接对象，发送消息
          wss.clients.forEach(client => {
            client.send(msg)
          })
        }
      } catch (error) {
        console.log(error)
      }
    })
  })
}
