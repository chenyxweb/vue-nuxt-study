export const state = () => ({
  name: '张三',
  age: 18,
  token: ''
})

export const mutations = {
  setToken(state, payload) {
    state.token = payload
  }
}
