# koa-blog
node+koa2+mysql (欢迎star)[预览地址](http://node.moneng.org/)


实现了用户注册登录,发布文章, 编辑文章, 删除文章, 发布评论, 删除评论, 以及编辑和删除的权限, mysql数据库的创建, sql语句Promise封装, markdown编辑, 分页, 上传头像, 支持图片拖动添加, 使用最新的async await 配合Promise, 简直是享受


### 创建数据库 
安装mysql: 官网下载最新版本

启动mysql
```
bash mysql.server start
```

登录数据库
```
$ mysql -u root -p
```
创建数据库
```
$ create database blogkoa;
```
使用创建的数据库
```
$ use nodesql;
```

> database: nodesql  tables: users posts comment  (已经在lib/mysql建表)


| users   | posts    |  comment  |
| :----: | :----:   | :----: |
|   id    |   id    |   id    |
|   name    |   name    |   name    |
|   pass    |   title    |   content    |
|   avator     | content      |   moment    |
|    moment     | md      |    postid   |
|     -    | uid      |   avator    |
|     -    | moment      |    -   |
|     -   | comments      |    -   |      
|     -   | pv             |   -   |      
|     -   |  avator       |    -   |    


* id主键递增
* name: 用户名
* pass：密码
* avator：头像
* title：文章标题
* content：文章内容和评论
* md：markdown语法
* uid：发表文章的用户id 
* moment：创建时间
* comments：文章评论数
* pv：文章浏览数
* postid：文章id

```
$ git clone https://github.com/airliuchuan/koa2-blog-kay.git
```
```
$ cd Koa2-blog
```
```
$ cnpm i supervisor -g
```
```
$ cnpm i 
```
```
$ npm run dev(运行项目)
```
```
$ npm test(测试项目)
```
### 目录结构

![](http://oxn3qjcft.bkt.clouddn.com/mulu.jpg)
### 2018.2.27 更新修改内容
1. 注册不跳转
2. 增加了登录验证, 解决session过期后依然可以发布文章(提交后会报错)和登录状态下, 依然可以进入登录, 注册页面,两个问题
3. 处理了, mysql数据库存入中文'?????'问题, 设置mysql默认编码格式
4. 调整注册页面, 上传头像按钮样式
5. 使用NODE_ENV区分生产环境和开发环境两种配置文件
### 2018.2.28
1. 编辑文章页面样式
2. 解决nginx反向代理响应慢问题
3. 添加预览地址

### TODO
1. 目前只支持jpg格式的拖拽上传, 实现原理是通过drop事件获取base64格式, 再通过拼markdown图片格式, 次方法经测试只支持jpg, 改进方案: 将用户拖拽的图片上传到服务器, 之后返回一个路径, 再精选markdown格式拼接
2. 添加后台管理, 超级管理员, 用户的信息(昵称, 头像等修改), 用户管理(在线与不在线, 用户分组)

