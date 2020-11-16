// 挂载根组件之前运行
export default ({ app, redirect }) => {
  app.router.beforeEach((to, from, next) => {
    // if (to.name === 'login' || to.name === 'about') {
    //   next()
    // } else {
    //   redirect({ name: 'login' })
    //   // next('/login')
    // }
    next()
  })
}
