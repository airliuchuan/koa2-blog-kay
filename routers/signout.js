const Router = require('koa-router')

const router = new Router({
  prefix: '/user'
})

router.get('/signout', async (ctx, next) => {
  ctx.session = null
  console.log('登出成功')
  ctx.body = {
    code: 0,
    msg: '登出成功'
  }
})

module.exports = router