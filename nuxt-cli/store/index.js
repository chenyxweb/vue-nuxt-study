export const actions = {
  // 参数一: vuex的上下文
  // 参数二: nuxt.js的上下文
  nuxtServerInit (store, context) {
    // console.log('store: ', store)
    // console.log('context: ', context)
    console.log('钩子nuxtServerInit')
    const { $cookies } = context
    // 从cookie中拿token信息, 存储到vuex中
    const token = $cookies.get('token') || ''
    store.commit('user/setToken', token)
  }
}
