module.exports = {
  checkLogin: ctx => {
    if(!ctx.session || !ctx.session.user) {
      ctx.redirect('/user/signin')
      return false
    }
    return true
  },
  checkNotLogin: ctx => {
    if(ctx.session && ctx.session.user) {
      ctx.redirect('/article/post')
      return false
    } 
    return true;
  }
}