// state
export const state = () => ({
  list: [
    { id: 1, name: '吃饭', done: false },
    { id: 2, name: '睡觉', done: true },
    { id: 3, name: '打豆豆', done: false }
  ]
})

// getters
export const getters = {
  doneList (state) {
    return state.list.filter(item => item.done)
  },
  unDoneList (state) {
    return state.list.filter(item => !item.done)
  }
}

// mutations
export const mutations = {
  addTodo (state, payload) {
    state.list = [...state.list, payload]
  }
}

// actions
export const actions = {
  addTodo (context, payload) {
    console.log(context, payload)
    setTimeout(() => {
      context.commit('addTodo', payload)
    }, 2000)
  }
}
