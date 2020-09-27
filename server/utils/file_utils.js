// 异步读取文件（返回promise）
const fs = require('fs') // 文件模块
module.exports = async filePath => {
  return new Promise((resolve, reject) => {
    /* readFile(文件路径，文件编码，回调函数)参数 */
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err) // 读取失败
      } else {
        resolve(data) // 读取成功
      }
    })
  })
}
