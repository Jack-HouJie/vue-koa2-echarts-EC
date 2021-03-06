// 设置响应头
module.exports = async (ctx, next) => {
  await next()
  // 设置mime类型和编码类型
  ctx.set('Content-Type', 'application/json;charset=utf-8')
  // CORS解决跨域
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
}
