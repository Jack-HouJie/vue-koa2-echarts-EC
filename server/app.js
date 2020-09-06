/* 服务器入口文件 */
// 1.创建Koa实例对象
const Koa = require('koa')
const app = new Koa()

// 应用中间件
// 耗时中间件（需要在第一个）
const durationMiddleware = require('./middleware/koa_response_duration')
app.use(durationMiddleware)
// 响应头中间件
const headerMiddleware = require('./middleware/koa_response_header')
app.use(headerMiddleware)
// 逻辑处理中间件
const dataMiddleware = require('./middleware/koa_response_data')
app.use(dataMiddleware)

// 3.监听端口号
app.listen(5555)

const webSocketService = require('./service/websocket_service')
// 开启服务端的WebSocket监听
webSocketService.listen()
