// 业务逻辑中间件
const path = require('path')
const getFileData = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  // 1.读取文件内容
  // 1.1 得到文件路径
  let filePath = ctx.request.url.replace('/api', '') // RESTfulAPI映射
  filePath = path.join(__dirname, `../data/${filePath}.json`)
  // 1.2 读取文件数据
  try {
    const res = await getFileData(filePath) // 使用读文件工具类
    ctx.response.body = res
  } catch (err) {
    const errMsg = {
      message: '未获取到数据，请检查URL',
      status: 404
    }
    ctx.response.body = errMsg
  }
  await next() // 进入下一个中间件
}
