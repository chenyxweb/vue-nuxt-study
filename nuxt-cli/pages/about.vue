
<template>
  <div class="about">
    <div>about</div>
    <nuxt-link to="/">
      首页
    </nuxt-link>
    <nuxt-link to="/goods">
      goods
    </nuxt-link>
    <div class="content">
      <h3>数据交互</h3>
      <div>同域资源响应数据: {{ msg1 }}</div>
      <!-- <div>跨域资源响应数据: {{ msg2 }}</div> -->

      <h3>redux演示</h3>
      <input v-model="input" type="text" @keyup.enter="handleAddTodo">
      <div>todo-list</div>
      <ul>
        <li v-for="item in list" :key="item.id">
          {{ item.name }} -- {{ item.done?'已完成':'未完成' }}
        </li>
      </ul>

      <h3>element-ui演示</h3>
      <el-button type="primary">
        按钮
      </el-button>

      <!-- 全局filters演示 -->
      <div>{{ 9|fillZero }}</div>
      <div>{{ date | formatDate }}</div>

      <!-- 自定义指令演示 -->
      <input v-focus type="text">
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  transition: 'move',

  fetch({ store }) {
    console.log('钩子fetch')
  },

  async asyncData({ $axios }) {
    const res1 = await $axios.get('/data.json') // 请求static目录下的同域资源
    // const res2 = await $axios.get('/api') // 请求跨域资源
    return {
      msg1: res1.data.msg,
      date: +new Date()
    }
  },

  data() {
    return {
      age: 18,
      input: '',
      title: 'about页面'
    }
  },

  computed: {
    // 映射toods.js模块的list
    // ...mapState('todos', ['list']), // 映射state方式一
    ...mapState({ // 映射state方式二
      list: (state) => {
        // console.log(state)
        return state.todos.list
      }
    }),
    ...mapGetters('todos', ['doneList', 'unDoneList'])
  },

  beforeCreate() {
    console.log('钩子beforeCreate')
  },

  created() {
    console.log('钩子created')
    this.$fn() // 全局方法测试
  },

  beforeMount() {
    console.log('钩子beforeMount')
  },

  mounted() {
    console.log('钩子mounted')
  },

  // 页面meta信息
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'desc',
          content: 'about页面的meta信息'
        }
      ]
    }
  },

  // 方式一: 将中间件定义在middleware文件夹内
  // middleware: 'auth',

  // 方式二: 将中间件定义在当前页面中
  middleware(context) {
    console.log('钩子middleware---页面级别')
  },

  validate(context) {
    console.log('钩子validate')
    return true
  },

  methods: {
    handleAddTodo() {
      this.m_addTodo({ id: +new Date(), name: this.input, done: false }) // 同步
      // this.a_addTodo({ id: +new Date(), name: this.input, done: false }) // 异步
      this.input = ''
    },

    ...mapMutations('todos', { m_addTodo: 'addTodo' }), // 映射同步的mutations
    ...mapActions('todos', { a_addTodo: 'addTodo' }) // 映射异步的actions

  }

}
</script>

<style scoped>
</style>
