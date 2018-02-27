const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const ejs = require('ejs')
const koaStatic = require('koa-static')
const views = require('koa-views')
const mysqlStore = require('koa-mysql-session')
const router = require('koa-router')
const path = require('path')
const config =require('./config')
const app =new Koa()
app.listen(config.port)

// session存储到mysql配置
const sqlStore = new mysqlStore({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
})

// session配置
app.use(session({
  key: 'USER_SID',
  store: sqlStore,
  cookie: {
    maxAge: 30*60*1000
  }
}))

// 配置静态目录
app.use(koaStatic(path.join(__dirname, './static')))

// 配置模板
app.use(views(path.join(__dirname, './views'), {
  extension: ejs
}))

//解析post数据
app.use(bodyParser({
  formLimit: '1mb'
}))

//配置路由
app.use(require('./routers/signup').routes())
app.use(require('./routers/signin').routes())
app.use(require('./routers/post').routes())
app.use(require('./routers/signout').routes())




