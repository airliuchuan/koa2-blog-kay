const mysql = require('mysql')
const config = require('../config')
const dbCfg = config.database
// 1.链接数据池
const pool = mysql.createPool({
  host: dbCfg.HOST,
  user: dbCfg.USERNAME,
  password: dbCfg.PASSWORD,
  database: dbCfg.DATABASE
})

// 用Promise封装mysql操作函数(await后边就跟的是Promise对象)
let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    // 获取一个操作链接
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, data) => {
          if(err) {
            reject(err)
          } else {
            resolve(data)
          }
          connection.release() // 关闭mysql连接
        })
      }
    })
  })
}

// 初始化表格 user_table post_table comment_table
// id name pass avatar moment
let user_table = 
  `create table if not exists user_table(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    pass VARCHAR(40) NOT NULL,
    avatar VARCHAR(100) NOT NULL,
    moment VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
  );`

  // id name title content md uid moment comments pv avatar 
let post_table =
  `create table if not exists post_table(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    md MEDIUMTEXT NOT NULL,
    uid VARCHAR(32) NOT NULL,
    moment VARCHAR(100) NOT NULL,
    comments VARCHAR(200) NOT NULL DEFAULT '0',
    pv VARCHAR(40) NOT NULL DEFAULT '0',
    avatar VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
  );`

  // id name content moment postid avatar
let comment_table =
`create table if not exists comment_table(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  content TEXT(0) NOT NULL,
  moment VARCHAR(40) NOT NULL,
  postid VARCHAR(40) NOT NULL,
  avatar VARCHAR(100) NOT NULL,
  PRIMARY KEY(id)
);`

// 封装建表
let createTable = sql => {
  return query(sql, [])
}

// 建表
createTable(user_table)
createTable(post_table)
createTable(comment_table)

// 注册用户
let insertUser = value => {
  let _sql = 'insert into user_table set name=?,pass=?,avatar=?,moment=?;'
  return query(_sql, value)
}
// 删除用户
let deleteUser = name => {
  let _sql =`delete from user_table where name=$'{name}';`
  return query(_sql)
}
// 查询用户
let findUser = name => {
  let _sql = `select * from user_table where name='${name}';` // 所有的赋值字段, 出了int类型都要加 '' ;
  return query(_sql)
}
// 发表文章
let insertPost = value => {
  let _sql = 'insert into post_table set name=?,title=?,content=?,md=?,uid=?,moment=?,avatar=?;'
  return query(_sql, value)
}
// 更新文章评论数
let updatePostComment = value => {
  let _sql = 'update post_table set comments=? where id=?;'// ?不加;
  return query(_sql, value)
}
// 更新浏览数
let updatePostPv = value => {
  let _sql = 'update post_table set pv=? where id=?;'
  return query(_sql, value)
}
// 发表评论
let insertComment = value => {
  let _sql = 'insert into comment_table set name=?,content=?,moment=?,postid=?,avatar=?;'
  return query(_sql, value)
}
// 通过名字查找用户信息
let findUserByName = name => {
  let _sql = `select * from user_table where name='${name}';`
  return query(_sql)
}
// 通过作者的名字查找文章信息
let findPostByUser = name => {
  let _sql = `select * from post_table where name='${name}';`
  return query(_sql)
}
// 通过文章id查找
let findPostById = id => {
  let _sql = `select * from post_table where id='${id}';`
  return query(_sql)
}
// 通过postid查找评论
let findCommentByPostid = id => {
  let _sql = `select * from comment_table where postid='${id}';`
  return query(_sql)
}

//通过评论id查找
let findCommentById = id => {
  let _sql = `select * from comment+table where id='${id}';`
  return query(_sql)
}
// 查询所有文章
let findAllPost = () => {
  let _sql = 'select * from post_table order by id desc;'
  return query(_sql)
}
// 查询分页文章
let findPostByPage = page => {
  let _sql = `select * from post_table order by id desc limit ${(page-1)*10},10;`
  return query(_sql)
}
// 个人文章分页
let findPostByUserPage = (name, page) => {
  let _sql = `select * from post_table where name='${name}' order by id desc limit ${(page-1)*10},10;`
  return query(_sql)
}
// 修改文章
let updatePost = value => {
  let _sql = 'update post_table set title=?,content=?,md=? where id=?;'
  return query(_sql, value)
}
// 删除文章
let deletePost = id => {
  let _sql = `delete from post_table where id='${id}';`
  return query(_sql)
}
// 删除评论
let deleteComment = id => {
  let _sql = `delete from comment_table where id='${id}';`
  return query(_sql)
}
// 删除文章所有评论
let deleteAllComment = id => {
  let _sql = `delete from comment_table where postid='${id}';`
  return query(_sql)
}
// 查找评论数
let findCommentLength = id => {
  let _sql = `select content from comment_table where postid in (select id from post_table where id='${id}');`
  return query(_sql)
}
// 滚动无限加载数据
let findPageById = page => {
  let _sql = `select * from post_table limit ${(page-1)*5},5;`
  return query(_sql)
}
// 评论分页
let findCommentByPage = (page, postId) => {
  let _sql = `select * from comment_table where postid='${postId}' order by id desc limit ${(page-1)*10},10;`
  return query(_sql)
}

module.exports = {
  insertUser,
  updatePostComment,
  updatePostPv,
  findUserByName,
  findPostByUser,
  findPostById,
  findCommentByPostid,
  findCommentById,
  findAllPost,
  query,
  createTable,
  insertUser,
  insertPost,
  insertComment,
  findCommentByPage,
  findPageById,
  findCommentLength,
  deleteAllComment,
  deleteComment,
  deletePost,
  updatePost,
  findPostByUserPage,
  findPostByPage,
  findUser,
  deleteUser,
}