# koa-blog
node+koa2+mysql (欢迎star)

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


