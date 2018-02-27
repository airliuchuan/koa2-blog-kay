const Router = require('koa-router')
const userModel = require('../libs/mysql')
const md5 = require('md5')
const config = require('../config')
const checkNotLogin = require('../meddleware/checklog').checkNotLogin

const router = new Router({
  prefix: '/user'
})

router.get('/signin', async (ctx, next) => {
  checkNotLogin(ctx)
  await ctx.render('signin.ejs', {
    session: ctx.session
  })
})

router.post('/signin', async (ctx, next) => {
  let user = {
    name: ctx.request.body.name,
    pass: ctx.request.body.pass
  }
  let md5Pass = md5(user.pass + config.MD5_SUFFIX)
  if(!user.name || !user.pass) {
    ctx.body = {
      code: 1,
      msg: '用户名和密码不能为空'
    } 
  }else if(!/^([A-Za-z]|[\u4E00-\u9FA5])+$/.test(user.name)) {
    ctx.body = {
      code: 1,
      msg: '用户名只能为数字和汉字, 不能超过32个字符'
    }
  } else if(!/(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{5,12}/.test(user.pass)) {
    ctx.body = {
      code: 1,
      msg: '请输入6-12位的密码,只能是数字和字母'
    }
  } else {
    await userModel.findUserByName(user.name)
      .then(res => {
        if(!res.length) {
          try {
            throw Error('用户名不存在')
          } catch (err) {
            console.log(err)
          }
          ctx.body = {
            code: 1,
            msg: '用户名不存在, 请注册'
          }
        } else if (md5Pass !== res[0].pass) {
          ctx.body = {
            code: 1,
            msg: '用户名或密码输入错误'
          }
        } else {
          ctx.session.id = res[0].id
          ctx.session.user = user.name
          ctx.body = {
            code: 0,
            msg: '登录成功'
          }
        }
      })
  }
})

module.exports = router