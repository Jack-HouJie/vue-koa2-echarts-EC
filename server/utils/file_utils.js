// 读取文件的工具方法
const fs = require('fs') // 文件模块
module.exports = async filePath => {
  // 异步任务→包装为一个Promise对象中
  return new Promise((resolve, reject) => {
    /**
     * readFile()参数 
     * 文件路径
     * 文件编码
     * 回调函数
     */
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        // 读取失败时调用Promise的reject
        reject(err)
      } else {
        // 读取成功时调用Pormise的resolve
        resolve(data)
      }
    })
  })
}
