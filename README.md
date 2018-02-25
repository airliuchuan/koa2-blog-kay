# Koa2-blog
node+koa2+mysql (欢迎star)

实现了用户注册登录,发布文章, 编辑文章, 删除文章, 发布评论, 删除评论, 以及编辑和删除的权限, mysql数据库的创建, sql语句Promise封装, markdown编辑, 分页, 上传头像, 支持图片拖动添加, 使用最新的async await 配合Promise, 简直是享受


教程 [Node+Koa2+Mysql 搭建简易博客](http://www.wclimb.site/2017/07/12/Node-Koa2-Mysql-%E6%90%AD%E5%BB%BA%E7%AE%80%E6%98%93%E5%8D%9A%E5%AE%A2/) 

### 创建数据库 
安装mysql

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
$ create database nodesql;
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
$ git clone https://github.com/wclimb/Koa2-blog.git
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
### 演示

![](http://oswpupqu5.bkt.clouddn.com/blog1.gif)

### 注册

![](http://oswpupqu5.bkt.clouddn.com/signup1.png)

### 登陆

![](http://oswpupqu5.bkt.clouddn.com/signin1.png)

### 发表文章

![](http://oswpupqu5.bkt.clouddn.com/create1.png)

### 文章详情

![](http://oswpupqu5.bkt.clouddn.com/postcontent1.png)

### 文章列表

![](http://oswpupqu5.bkt.clouddn.com/posts1.png)

### 个人文章页以及正常编辑删除文章和评论


