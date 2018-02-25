const Router = require('koa-router')
const userModel = require('../libs/mysql.js')
const config = require('../config/default')
const md5 = require('md5')
const fs = require('fs')
const moment = require('moment')
const path = require('path')

const router = new Router({
  prefix: '/user'
})

router.get('/signup', async (ctx, next) => {
  await ctx.render('signup.ejs', {
    session: ctx.session
  })
})

router.post('/signup', async (ctx, next) => {
  // 接受bodyparser解析的post数据
  // console.log(ctx.request.body)
  let user = {
    name: ctx.request.body.name,
    pass: ctx.request.body.pass,
    cPass: ctx.request.body.checkpass,
    avatar: ctx.request.body.avatar
  }
  // 为密码进行md5签名并加盐
  let md5Pass = md5(user.pass + config.MD5_SUFFIX)
  if (!user.name) {
    ctx.body = {
      code: 1,
      msg: '用户名不能为空'
    }
    return
  }
  // 根据注册用户名查询数据库
  await userModel.findUserByName(user.name)
    .then(async res => { // 这里少加了一个async 所以到值下边 upload那里的await报错, await只能在async函数里*
      if (res.length) {
        try {
          throw Error('用户存在')
        } catch (err) {
          console.log(err)
        }
        ctx.body = {
          code: 1,
          msg: '用户已存在'
        }
      } else if (user.pass !== user.cPass || user.pass === '') {
        ctx.body = {
          code: 1,
          msg: '两次输入的密码不一致'
        }
      } else {
        // 将传过来的base64图片转换成二进制数据
        let base64Data = user.avatar.replace(/^data:image\/\w+;base64,/, '') //取出base64数据
        let dataBuffer = new Buffer(base64Data, 'base64') // 将base64s数据转换成Buffer
        let avaName = Number(Math.random().toString().substr(3)).toString(36) + Date.now() + '.png'
        let upload = await new Promise((reslove, reject) => {
          fs.writeFile('./static/images/' + avaName, dataBuffer, err => { // 需要在static目录下新建一个images否则会一直报错找不到目录*
            if (err) {
              throw err;
              reject(false)
            };
            reslove(true)
            console.log('头像上传成功')
          });
        })
        if (upload) {
          await userModel.insertUser([user.name, md5Pass, avaName, moment().format('YYYY-MM-DD HH:mm:ss')]) // 这里的moment()是方法, 要加括号*
            .then(res => {
              console.log('注册成功')
              // ctx.session.user = user.name
              ctx.body = {
                code: 0,
                msg: '注册成功'
              }
            })
            .catch(err => {
              throw err
              ctx.body = {
                code: 1,
                msg: '操作失败, 数据库出错'
              }
            })
        } else {
          ctx.body = {
            code: 1,
            msg: '头像上传失败'
          }
        }
      }
    })
})

module.exports = router