const Router = require('koa-router')
const router = new Router

router.get('/', async(ctx, next) => {
  ctx.redirect('/article/post')
})

module.exports = router