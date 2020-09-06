// 业务逻辑中间件
const path = require('path') // 路径模块(用于根据相对路径得到绝对路径)
const getFileData = require('../utils/file_utils')

module.exports = async (ctx, next) => {
  // 1.读取文件内容
  // 1.1获取请求的路径，拼接文件路径
  let filePath = ctx.request.url.replace('/api', '')
  filePath = path.join(__dirname, `../data/${filePath}.json`)
  // 1.2 得到文件数据
  try {
    // 通过 await 直接得到Promise包裹的数据
    const res = await getFileData(filePath)
    ctx.response.body = res
  } catch (err) {
    const errMsg = {
      message: '未获取到数据，请检查URL',
      status: 404
    }
    ctx.response.body = errMsg
  }

  await next()
}
