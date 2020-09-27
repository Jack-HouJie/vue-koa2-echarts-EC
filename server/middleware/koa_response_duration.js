// 计算响应耗时
module.exports = async (ctx, next) => {
  // 记录开始时间
  const start = Date.now()
  await next()
  // 记录结束时间
  const end = Date.now()
  // 计算耗时
  const duration = end - start
  // 通过响应头返回耗时时长
  // ctx.set():设置响应头的方法
  ctx.set('X-Response-Time', `${duration} ms`)
}
