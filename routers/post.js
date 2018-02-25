const Router = require('koa-router')
const moment = require('moment')
const userModel = require('../libs/mysql')
const Markdown = require('markdown-it')
const md = new Markdown()

const router = new Router({
  prefix: '/article'
})

// 获取全部文章和用户全部文章
router.get('/post', async (ctx, next) => {
  let posts,
      postsLength
  if(ctx.querystring) {
    let name = ctx.query.author,
        authorPosts,
        authorPostsLength
    await userModel.findPostByUserPage(name, 1)
      .then(res => {
        authorPosts = res
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '查询第一页作者文章失败'
        }
      })
    await userModel.findPostByUser(name)
      .then(res => {
        authorPostsLength = res.length
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '查询作者全部文章失败'
        }
      })
      await ctx.render('userPost.ejs', {
        session: ctx.session,
        authorPosts,
        authorPostsLength,
        authorPostsMaxPage: Math.ceil(authorPostsLength / 10)
      })
  } else {
    // 获取第一页数据, 一页10篇
    await userModel.findPostByPage(1)
      .then(res => {
        posts = res
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '查询第一页失败'
        }
      })
    await userModel.findAllPost()
      .then(res => {
        postsLength = res.length
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '查询全部文章失败'
        }
      })
    await ctx.render('post.ejs', { // 为什么一定要加await
      session: ctx.session,
      posts,
      postsLength,
      postsMaxPage: Math.ceil(postsLength / 10)
    })
  }
})

//文章详情页
router.get('/post/:postid', async (ctx, next) => {
  let detailPost,
      postPv,
      postid = ctx.params.postid,
      comments,
      commentsLength
  // 根据id获取文章详情
  await userModel.findPostById(postid)
    .then(res => {
      detailPost = res[0]
      postPv = parseInt(res[0].pv)
      // console.log(postPv)
      postPv += 1
    }).catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '获取文章详情失败'
      }
    })
  // 更新,浏览量
  await userModel.updatePostPv([postPv, postid])
  // 获取首页评论10条
  await userModel.findCommentByPage(1, postid)
    .then(res => {
      comments = res
    }).catch(err => {
      ctx.body = {
        code: 1,
        msg: '获取首页评论失败'
      }
    })
    // 获取文章的所有评论,计算总评论数
  await userModel.findCommentByPostid(postid)
    .then(res => {
      commentsLength = res.length
    }).catch(err => {
      ctx.body = {
        code: 1,
        msg: '获取总评论数失败'
      }
    })
  await ctx.render('postDetail.ejs', {
    session: ctx.session,
    detailPost,
    comments,
    commentsLength,
    commentsPages: Math.ceil(commentsLength / 10)
  })
  console.log(Math.ceil(commentsLength / 10))
})

// 获取发布页
router.get('/create', async (ctx, next) => {
  await ctx.render('create.ejs', {
    session: ctx.session
  })
})

// 处理发布文章post请求
router.post('/create', async (ctx, next) => {
  // 1. 收集数据库字段
  console.log('create')
  let title = ctx.request.body.title,
      content = ctx.request.body.content,
      name = ctx.session.user,
      uid = ctx.session.id,
      post_time = moment().format('YYYY-MM-DD HH:mm:ss'),
      avatar
  // 现在使用markdown不需要单独转译
  // let newContent = content.replace(/<"'>/g, (target) => {
  //   return {
  //     '<': '&lt;',
  //     '"': '&quot;',
  //     '>': '&gt;',
  //     "'": '&#39;'
  //   }
  // })
  let newTitle = title.replace(/<'">/g, (target) => {
    return {
      '<': '&lt;',
      '"': '&quot;',
      '>': '&gt;',
      "'": '&#39;'
    }[target]
  })
  // 2. 获取用户头像
  await userModel.findUserByName(name)
    .then(res => {
      avatar = res[0]['avatar']
      // console.log(avatar)
    }).catch(err => {
      console.log('获取头像失败', err)
      ctx.body = {
        code: 1,
        msg: '获取头像失败'
      }[target]
    })
  // 3. 插入文章
  await userModel.insertPost([name, title, content, md.render(content), uid, post_time, avatar])
    .then(res => {
      console.log('插入文章成功')
      ctx.body = {
        code: 0,
        msg: '插入文章成功'
      }
    }).catch(err => {
      throw err
      console.log('插入文章失败')
      ctx.body = {
        code: 1,
        msg: '插入文章失败'
      }
    })
})

//发布评论 这是一个巨坑*当你的pathname有 /:xxx 的时候, 一定要注意要把确定的放到前边, 否则会先执行/:xxx的
router.post('/:postid', async (ctx, next) => {
  // console.log(ctx.params.postid, ':postid')
  console.log('comment')
  let name = ctx.session.user,
      content = ctx.request.body.content,
      post_time = moment().format('YYYY-MM-DD YY:mm:ss'),
      postid = ctx.params.postid,
      avatar,
      commentNum
  await userModel.findUserByName(name) 
    .then(res => {
      avatar = res[0].avatar
    }).catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '查询用户失败'
      }
    })
  await userModel.insertComment([name, md.render(content), post_time, postid, avatar])
    .catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '发表评论失败'
      }
    })
  await userModel.findPostById(postid)
    .then(res => {
      commentNum = parseInt(res[0].comments)
      commentNum += 1
    })
  await userModel.updatePostComment([commentNum, postid])
    .then(res => {
      ctx.body = {
        code: 0,
        msg: '发表评论成功'
      }
    }).catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '更新评论数失败'
      }
    }) 
})

// 编辑文章页面get
router.get('/post/:postid/edit', async (ctx, next) => {
  let postid = ctx.params.postid,
      post
  await userModel.findPostById(postid)
    .then(res => {
      post = res[0]
    }).catch(err => {
      console.error(err)
    })
  await ctx.render('edit.ejs',{
    session: ctx.session,
    post
  })
})

// 编辑文章页面post
router.post('/post/:postid/edit', async (ctx, next) => {
  let title = ctx.request.body.title,
      content = ctx.request.body.content,
      postid = ctx.params.postid,
      allowEdit
  let newTitle = title.replace(/<"'>/g,target => {
    return {
      '<': '&lt;',
      '"': '&quot;',
      '>': '&gt;',
      "'": '&#39;'
    }[target]
  })
  await userModel.findPostById(postid)
    .then(res => {
      if(res[0].name === ctx.session.user && ctx.session.user) {
        allowEdit = true
      } else {
        allowEdit = false
      }
    }).catch(err => {
      ctx.body = {
        code: 1,
        msg: '查询文章失败'
      }
    })
  if(allowEdit) {
    await userModel.updatePost([newTitle, content, md.render(content), postid])
      .then(res => {
        ctx.body = {
          code: 0,
          msg: '修改成功'
        }
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '修改失败'
        }
      })
  } else {
    ctx.body = {
      code: 1,
      msg: '没有权限'
    }
  }
  
})

// 删除文章
router.post('/post/:postid/del', async (ctx, next) => {
  let postid = ctx.params.postid,
      allowDel
  // 查询文章, 确定当前登录用户是否是文章主人
  await userModel.findPostById(postid)
    .then(res => {
      if(res[0].name === ctx.session.user && ctx.session.user) {
        allowDel = true
      } else {
        allowDel = false
      }
    }).catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '查询文章失败'
      }
    })
  if(allowDel) {
    // 是文章主人, 删除
    await userModel.deletePost(postid)
      .catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '数据库出错'
        }
      })
    // 删除文章下的所有评论
    await userModel.deleteAllComment(postid)
      .then(res => {
        console.log('succ')
        ctx.body = {
          code: 0,
          msg: '删除成功, 并且删除所有评论'
        }
      }).catch(err => {
        console.log(err)
        ctx.body = {
          code: 1,
          msg: '数据库错误'
        }
      })
  } else {
    ctx.body = {
      code: 1,
      msg: '删除失败'
    }
  } 
})

// 删除评论
router.post('/post/:postid/comment/:commentid/del', async (ctx, next) => {
  let postid = ctx.params.postid,
      commentid = ctx.params.commentid,
      allowDel,
      postComments
  await userModel.findPostById(postid)
    .then(res => {
      if( ctx.session.user && res[0].name === ctx.session.user) {
        allowDel = true
      } else {
        allowDel = false
      }
    }).catch(err => {
      ctx.body = {
        code: 1,
         msg: '查询文章失败'
      }
    }) 
  if(allowDel) {
    await userModel.deleteComment(commentid)
      .then(res => {
        console.log('删除成功')
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '数据库错误'
        }
      })
    await userModel.findPostById(postid)
      .then(res => {
        postComments = parseInt(res[0].comments)
        postComments -= 1
      }).catch(err => {
        console.error(err)
        ctx.body = {
          code: 1,
          msg: '获取评论数失败'
        }
      })
    await userModel.updatePostComment([postComments,postid])
      .then(res => {
        console.log('更新成功')
        ctx.body = {
          code: 0,
          msg: '删除成功'
        }
      }).catch(err => {
        console.log(err)
        ctx.body = {
          code: 1,
          msg: '更新失败'
        }
      })
  } else {
    ctx.body = {
      code: 1,
      msg: '没有权限'
    }
  }
})

// 评论分页
router.post('/post/:postid/commentpage', async (ctx, next) => {
  var page = ctx.request.body.page,
      postid = ctx.params.postid
  await userModel.findCommentByPage(page,postid)
    .then(res => {
      ctx.body = {
        code: 0,
        msg: res
      }
    }).catch(err => {
      console.error(err)
      ctx.body = {
        code: 1,
        msg: '评论查询失败'
      }
    })
})

// 全部文章分页
router.post('/post/postspage', async (ctx, next) => {
  let page = ctx.request.body.page

  await userModel.findPostByPage(page)
    .then(res => {
      ctx.body = {
        code: 0,
        msg: res
      }
    }).catch(err => {
      console.log(err)
    })
})

// 个人文章分页
router.post('/post/userpage', async (ctx, next) => {
  let page = ctx.request.body.page,
      author = ctx.request.body.author

  await userModel.findPostByUserPage(author, page)
    .then(res => {
      ctx.body = {
        code: 0,
        msg: res
      }
    }).catch(err => {
      console.log(err)
    })
})

module.exports = router