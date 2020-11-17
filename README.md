# 全局nuxt学习

## 1 客户端渲染(CSR)和服务端渲染(SSR)

- CSR：client side render
- SSR：server side render
- 如何判断是CSR还是SSR  (右键查看网页源码)
- 服务端渲染的优缺点 (SEO方面, 资源占用方面)

```
// 优点
1. 有利于SEO
2. 不占用客户端资源
3.更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面

// 缺点
1. 更多的服务器端负载
2.与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境
```

- 客户端渲染优缺点 (SEO方面, 资源占用方面)

```
// 优点
1. 客户端渲染可将静态资源部署到cdn上,实现高并发

// 缺点
1. 不利于SEO
2. 页面render发生在客户端,客户端需要占用更多的资源
3. 首页加载速度慢
```



## 2 简单手动搭建

### 2.1 安装

```
npm i vue vue-server-renderer express
```

### 2.2 编写服务端代码

```html
// index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>

    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ metas }}}
  </head>

  <body>
    <!--vue-ssr-outlet-->
    <!-- 自动注入 -->
  </body>
</html>

```



```js
// server.js

const Vue = require('vue')
const server = require('express')()
const fs = require('fs')
// 同步读取模板文件
const template = fs.readFileSync('./index.html', 'utf-8')
const renderer = require('vue-server-renderer').createRenderer({ template })

const context = {
  title: 'vue ssr',
  metas: `
      <meta name="keyword" content="vue,ssr">
      <meta name="description" content="vue srr demo">
  `,
}

// 监听请求
server.get('*', (req, res) => {
  // 创建vue实例
  const app = new Vue({
    data: {
      url: req.url,
    },
    template: `<div>您访问的url是: {{url}} </div>`,
  })

  // 拿到vue实例渲染出来的html string , 响应给前端
  renderer.renderToString(app, context, (err, html) => {
    console.log(html)
    if (err) {
      console.log(err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

// 监听端口
server.listen(8000, () => console.log('服务已启动在8000端口!!!'))

```

### 2.3 启动服务

```
nodemon server.js
```

### 2.4 访问

```
localhost:8000
```

## 3 Nuxt安装

### 3.1 安装

```bash
1 新建文件夹 nuxt-cli

2 npx create-nuxt-app .

3 注意: Rendering mode:选择 Universal (SSR / SSG)

```

### 3.2 **Universal** 和 SPA 的选择

```
选择Universal 

原因: 
SPA是单页应用，所以只有一个入口文件，sitemap(网站地图)也就只有一个url，这会导致网站辛辛苦苦搭建的服务端渲染最多只被搜索引擎收录一个页面。
而Universal则能实现所有网站路径完全被收录，这才是最初我们使用nuxt的初衷

ps:
sitemap.xml 网站地图，主要作用是告知搜索引擎站点中存在的链接，引导抓取收录。一般放在站点根目录即可（也有办法主动推送给网络爬虫，这里不展开讲）。主要包含信息是链接、最后修改时间、优先级。
谷歌免费xml生成工具     https://www.xml-sitemaps.com
http://www.sitemap-xml.org/
```

## 4 [Nuxt的生命周期](https://zh.nuxtjs.org/docs/2.x/concepts/nuxt-lifecycle/)

```
// 1 首次访问页面时
// 1.1 运行在服务端的钩子
钩子nuxtServerInit
钩子middleware---配置级别
钩子middleware---layouts级别
钩子middleware---页面级别
钩子validate
钩子asyncData
钩子fetch
钩子beforeCreate
钩子created

// 1.2 运行在客户端的钩子
钩子beforeCreate
钩子created
钩子beforeMount
钩子mounted
...

// 分割线-------------------------------------

// 2 路由进入页面时
// 2.1 运行在服务端的钩子
无

// 2.2 运行在客户端的钩子
钩子middleware---配置级别
钩子middleware---layouts级别
钩子middleware---页面级别
钩子validate
钩子asyncData
钩子fetch
钩子beforeCreate
钩子created
钩子beforeMount
钩子mounted
...

// 总结--------------------------------------
服务端钩子内访问服务端上下文store
客户端钩子内访问window, this(当前组件等)
created运行在客户端和服务端,因此不要访问window
```

###  nuxtServerInit

- 运行在服务端
- 是vuex的一个action, 钩子函数运行在服务端，只会运行一次。用来预填充store中的初始数据
- 使用

```js
// store/index.js

export const actions = {
  // 参数一: vuex的store实例,
  // 参数二: nuxt.js的服务端上下文
  nuxtServerInit (store, context) {
    console.log('store: ', store)
    console.log('context: ', context)
  }
}
```

###  middleware

> 中间件让我们能自定义一些函数, 运行在页面或者一组页面之前
>
> 运行在服务端(页面首次加载时)和客户端(路由跳转时)

可以定义在配置, 布局和页面级别

1. 定义在配置文件nuxt.config.js

```js
// middleware/auth.js

export default (context) => {
    // context 服务端上下文, 可以拿到 app实例, 路由, redux等等
  const { app, from, next, route, store } = context
  console.log('middleware-------', context)
}
```

```js
// nuxt.config.js
export default {
  router: {
    middleware: 'auth'
  },
}
```

2. 定义在lagouts内

```js
// layouts/default.vue

export default {
  // 方式一: 外部 --> 将中间件定义在middleware文件夹内
  // middleware: 'auth',

  // 方式二: 内部 --> 将中间件定义在当前页面中
  middleware (context) {
    console.log('middleware---layouts级别', context)
  }
}
```

3. 定义在pages内

```js
// pages/about.vue

export default {
  // 方式一: 外部 --> 将中间件定义在middleware文件夹内
  // middleware: 'auth',

  // 方式二: 内部 --> 将中间件定义在当前页面中
  middleware (context) {
    console.log('middleware---页面级别', context)
  }

}
```

> 运行顺序: 配置级别中间件 --> 布局级别中间件 --> 页面级别中间件

### validate
```js
  validate (context) {
    console.log('钩子validate')
     // 用于进入页面校验, return为true才可以进入
    return true
  }

```

###  asyncData 和 fetch

```js
// 读数据,返回合并给组件的data
asyncData(context){
    // 异步业务逻辑...
    console.log('钩子asyncData')
    return {
        name:'zs'
    }
}

// 读数据,提交给vuex
fetch ({store}) {
    // 异步业务逻辑
    console.log('钩子fetch')
    
    // 数据交给vuex
    store.commit(xxx,...)
}
```

### vue生命周期钩子...

## 5 路由

### 5.1 约定式路由

根据pages目录下文件层级自动生成 https://www.nuxtjs.cn/guide/routing

### 5.2 配置路由 

https://www.nuxtjs.cn/api/configuration-router#extendroutes

```js
// nuxt.config.js   router.extendRoute

router: {
    middleware: 'auth',
    extendRoutes (routes, resolve) {
      // 添加自定义路由, 也可以将所有的路由重新定义一遍, 默认会覆盖之前自动生成的路由
      const _routes = [
        {
          path: '/index',
          component: './pages/index.vue'
        },
        {
          path: '*',
          component: resolve(__dirname, 'pages/404.vue')
        },
        {
          path: '/goods/:id',
          component: './pages/goods.vue'
        }

      ]

      routes.push(..._routes)
    }
  },
```



### 5.3 自定义404页面

layouts/error.vue

### 5.4 路由动画

- 统一路由动画 (约定式写法)

```css
// assets/css/transition.css

/* 全局路由动画 fade动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}

/* 进入前,离开后 */
.page-enter,
.page-leave-to{
  opacity: 0;
}
```

```
// nuxt.config.js

// 配置全局样式
css: ['./assets/css/transition.css']
```

- 路由独享动画

```css
// assets/css/transition.css

/* 单个路由动画 入场出场动画 */
.move-enter-active,
.move-leave-active{
  transition: all 0.5s ease;
}
/* 进入前,离开后 */
.move-enter,
.move-leave-to{
  transform: translateX(-1920px);
}
```

```js
// 组件内

export default {

  transition: 'move',
  // ...
}
```

### 5.5 路由守卫

- 前置守卫 --- 中间件实现

```
// 依赖中间件middleware
1. 配置级别nuxt.config.js
2. 布局级别layouts
3. 页面级别pages

```

- 前置和后置守卫 --- 插件实现

```js
// plugins/router.js

// 挂载根组件之前运行,只会运行一次
export default ({ app, redirect }) => {
  app.router.beforeEach((to, from, next) => {
    // 插件全局前置守卫
      if (to.name === 'login' || to.name === 'about') {
      next()
    } else {
      redirect({ name: 'login' })
      // next('/login') // 不能使用, 需要使用redirect完成路由的强制跳转
    }
  })
    
    // 插件全局后置守卫
    router.afterEach((to, from) => {
      // ...
    })
}

```

```js
export default {
    plugins:['@/plugins/router.js']
}
```



- 组件独享后置守卫 --- 钩子函数实现

```js
export default {

  beforeRouteLeave (to, from, next) {
    console.log(to)
    // 离开前确认操作
    const res = window.confirm('确定要离开么')
    next(res)
  }

}
```

## 6 数据交互

### 6.1 安装依赖

https://www.nuxtjs.cn/guide/modules

```bash
npm i @nuxtjs/axios @nuxtjs/proxy
```

### 6.2 添加配置

```js
// nuxt.config.js

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    proxy: true // 开启axios跨域
    // prefix:'/api', // baseURL 基地址,自动拼接上
  },

  // 配置代理
  proxy: {
    '/api': {
      target: 'http://localhost:8888/', // 代理的目标地址
      changeOrigin: true // 跨域
      // pathRewrite: {
      // '^api': ''
      // }
    }
  },
```

### 6.3 使用

```js
  async asyncData ({ $axios }) {
    const res1 = await $axios.get('/data.json') // 请求static目录下的同域资源
    const res2 = await $axios.get('/api') // 请求跨域资源
    return {
      msg1: res1.data.msg,
      msg2: res2.data.msg
    }
  },
```



## 7 拦截器和token登录拦截

```js
// 添加plugins -- 页面中只运行一次的添加到plugins中
// plugins/axios.js

export default ({ $axios }) => {
  console.log('axios', $axios)
  // 添加请求拦截器
  $axios.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么

      // 请求时添加上token
      config.headers.token = 'token'

      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  $axios.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么

      // 响应token失效,删除本地存储的token跳转login页面,

      return response
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
}

```

```js
// 添加配置
// nuxt.config.js	
  
plugins: [
    '@/plugins/router.js',
    {
      src: '@/plugins/axios.js',
      ssr: true // 服务端 ???
    }
  ],
```

## 8 自定义loading组件

> nuxt自带loading进度条效果

https://www.nuxtjs.cn/api/configuration-loading#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%A0%E8%BD%BD%E7%BB%84%E4%BB%B6

```vue
// 自定义加载组件

<template lang="html">
  <div class="loading-page" v-if="loading">
    <p>Loading...</p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
  }
</style>
```

```js
// 配置  nuxt.config.js

module.exports = {
  loading: '~/components/loading.vue'
}
```

## 9 vuex

> store文件夹下的每一个js文件就是一个模块, 将会被自动注入到vuex中, 并自动添加namespace

演示

```js
// store/todos.js

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

```

```vue

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
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  transition: 'move',

  fetch({ store }) {
    console.log('钩子fetch')
    // fetch里处理异步请求, 将数据通过commit-mutations 或 dispatch-actions, 将书存储到redux中
  },

  async asyncData({ $axios }) {
    const res1 = await $axios.get('/data.json') // 请求static目录下的同域资源
    // const res2 = await $axios.get('/api') // 请求跨域资源
    return {
      msg1: res1.data.msg
    }
  },

  data() {
    return {
      age: 18,
      input: ''
    }
  },

  computed: {
    // 映射toods.js模块的list
    // ...mapState('todos', ['list']), // 映射state方式一
    ...mapState({ // 映射state方式二
      list: (state) => {
        console.log(state)
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
  },

  beforeMount() {
    console.log('钩子beforeMount')
  },

  mounted() {
    console.log('钩子mounted')
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

```

## 10 状态持久化和token校验

```bash
// 1 安装
npm i cookie-universal-nuxt // 功能: 可以操作(获取和移除)nuxt项目中, 客户端和服务端的cookie信息

// 2 添加modules nuxt.config.js, 上下文会添加一个 $cookies
modules: ['@nuxtjs/axios', 'cookie-universal-nuxt']

// 3 登录完成时, 将用户信息存储到 vuex 和 cookie中, 若存在来源页面跳转到来源页面,若没有来源页面就跳转到首页
this.$cookies.set('user', xxx)
this.$store.commit('user/setToken', xxx)

// 4 刷新页面时(进入应用时), 将cookie中的用户信息存储到vuex中
// store/index.js
/* eslint-disable no-console */
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

// 5 axios中的请求拦截器中携带vuex中的用户信息进行用户身份识别, 根据响应的状态码判断是否跳转到登录页面(拦截到登录页面时需要携带来源页面信息) plugins/axios.js
// 为什么携带vuex中的token而不是cookie中的? 在内存中读取数据比在硬盘中读取数据快
```

## 11 element-ui使用

```
// 1 安装
npm i element-ui
```

```js
// 2 配置plugins/element-ui.js

import Vue from 'vue'
import ElementUI from 'element-ui'

// 全量引入
Vue.use(ElementUI)

// 按需引入
// import { Button } from "element-ui";
// Vue.use(Button)
```

```js
// 3 配置 nuxt.config.js

  css: [
    './assets/css/transition.css', // 添加transition样式
    'element-ui/lib/theme-chalk/index.css' // 添加element-ui的样式
  ],

  plugins: [
    '@/plugins/router.js',
    {
      src: '@/plugins/axios.js',
      ssr: true
    },
    {
      src: '@/plugins/element-ui.js',
      ssr: true // (默认为 true) 如果值为 false，该文件只会在客户端被打包引入。
    }
  ],
      
  build: {
    // transpile: ['/^element-ui/'] // 单独提取出来
  },
```

## 12 全局定义方法, 过滤器, 指令, 样式

> plugins文件夹的功能类似于 vue-cli 中的main.js

### 全局方法, 过滤器, 指令

```js
// plugins/mixins.js

import Vue from 'vue'
import * as filters from '@/assets/js/filters'
import focus from '@/assets/js/directives/focus'

// 1 全局方法
const fn = () => console.log('哈哈哈')
Vue.prototype.$fn = fn // 有this的环境才可以访问这个函数

// 2 全局过滤器注册
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item])
})

// 3 自定义指令注册
Vue.directive('focus', focus)

```

```js
// assets/js/filters.js

// 全局过滤器定义

// 日期补零
export const fillZero = (d) => {
  return d < 10 ? '0' + d : '' + d
}

// 格式化日期
export const formatDate = (timeStamp) => {
  const d = new Date(timeStamp)

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const hour = d.getHours()
  const min = d.getMinutes()
  const sec = d.getSeconds()

  return `${year}-${fillZero(month)}-${fillZero(date)} ${fillZero(hour)}:${fillZero(min)}:${fillZero(sec)}`
}

```

```js
// assets/js/directives/focus.js

// 自定义指令定义

// 自动获取焦点指令
export default {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el) {
    el.focus()
  }
}

```

### 全局样式

```css
// assets/css/transition.css

/* 全局路由动画 fade动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
/* 进入前,离开后 */
.page-enter,
.page-leave-to{
  opacity: 0;
}


/* 单个路由动画 入场出场动画 */
.move-enter-active,
.move-leave-active{
  transition: all 0.5s ease;
}
/* 进入前,离开后 */
.move-enter,
.move-leave-to{
  transform: translateX(-1920px);
}

```

```js
// nuxt.config.js

  // 全局样式
  css: [
    './assets/css/transition.css', // 添加transition样式
    'element-ui/lib/theme-chalk/index.css' // 添加element-ui的样式
  ],
```

## 13 meta使用

### [全局meta](https://www.nuxtjs.cn/api/configuration-head)

```js
// nuxt.config.js

export default {
  head: {
    title: 'my website title',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'my website description'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  }
}
```

### [页面meta](https://www.nuxtjs.cn/api/pages-head)

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello World!'
      }
    },
    head() {
      return {
        title: this.title, // 可以通过this访问页面中的数据
        meta: [
          {
            hid: 'description', // 和全局meta设置相同的hid, 可以覆盖全局设置的meta, hid为description的meta只显示一个
            name: 'description',
            content: 'My custom description'
          }
        ]
      }
    }
  }
</script>
```

## 14 使用sass

### 安装使用sass

https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-css/

```
// 安装
npm install node-sass sass-loader --dev
```

### 全局样式变量配置

https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-build/#styleresources

https://github.com/nuxt-community/style-resources-module/

```
// 安装
npm i @nuxtjs/style-resources -D
```

```scss
// 定义变量
// assets/variables.scss

$gray:gray;
```

```js
// 配置
// nuxt.config.js

  // sass全局变量配置
  buildModules: ['@nuxtjs/style-resources'],
  styleResources: {
    scss: [
      '@/assets/variables.scss'
    ]
  }
```

```scss
// 使用变量

color:$gray;
```

## 15 自定义html模板

https://zh.nuxtjs.org/docs/2.x/concepts/views/#document-apphtml

```html
// app.html
// 自动注入nuxt的attrs

<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}

    <!-- 自定义head -->

  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

## 16 nuxt中资源访问

### 内部资源

```html
<!-- 会被打包的资源  assets目录下 -->
<img src="@/assets/images/111.png" alt="">

<!-- 不会被打包的静态资源 static目录下 -->
<img src="/images/222.png" alt="">
```

### 外部资源

- 自定义html模板内

  ```html
<!DOCTYPE html>
  <html {{ HTML_ATTRS }}>
    <head {{ HEAD_ATTRS }}>
      {{ HEAD }}
  
      <!-- 自定义head -->
  
    </head>
    <body {{ BODY_ATTRS }}>
      {{ APP }}
  	
    <!-- 引入外部资源 -->  
      <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </body>
  </html>
  
  ```

- nuxt.config.js 内

```js
export default {
  head: {
    title: 'nuxt-cli',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '全局meta信息' }
    ],
    // 使用link引入外部css,字体等, 使用script引入外部脚本文件等
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js' }
    ]
  },
}
```

- 组件内

```js
export default {
    head(){
        return {
            title: '标题',
            meta: [],
            script: [
                {src:'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js'}
            ]
        }
    }
}
```

注意: 

- app.html和nuxt.config.js内部配置的外部资源, 全局共享.  
- 组件内配置的外部仅当前组件可用
- 配置在head中的外部资源会阻塞页面

## 17 nuxt项目使用typescript

### 新建typescript项目

```bash
md nuxt-ts
cd nuxt-ts
npx create-nuxt-app .

选择 
typescript
Universal模式
```

### 在原有项目中添加

```
https://typescript.nuxtjs.org/guide/
```

### 使用class-api

```
// 安装
npm i vue-property-decorator vue-class-component
```

```vue
<template>
  <div class="about">
    <div>about</div>
    <!-- 演示 -->
    <div>{{ count }}</div>
    <div>{{ dCount }}</div>
    <el-button type="primary" @click="handleClick">
      count++
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  mounted () {
    console.log('mounted')
  }
})
export default class About extends Vue {
  // props
  @Prop() readonly msg: string | undefined;

  // data
  count: number = 0;

  // computed
  get dCount (): number {
    return this.count * 2
  }

  // watch
  @Watch('count', { immediate: true })
  countChange () {
    console.log('count,change')
  }

  // methods
  handleClick (e: MouseEvent) {
    this.count++
    console.log(e.pageX, e.pageY)
  }
}
</script>

<style>
</style>

```

### 重写vue类型接口

```ts
import Vue from 'vue'
import { NuxtAxiosInstance } from "@nuxtjs/axios";

declare module "vue/types/vue" {
  interface Vue {
    // 报错的添加到这里进行类型定义
    $axios: NuxtAxiosInstance;
  }
}
```

### vuex中使用ts

```
// 安装
npm i vuex-class
```

```ts
import { Component, Vue } from 'vue-property-decorator'
// 引入装饰器
import { State, Getter, Action, Mutation } from 'vuex-class'

export default Class Demo extends Vue {

  // https://class-component.vuejs.org/guide/property-type-declaration.html#property-type-declaration
  // Declare mapped getters and actions on type level.
  // You may need to add `!` after the property name
  // to avoid compilation error (definite assignment assertion).
    
    // ...mapState({ list: (state) => state.todos.list }),
    @State((state) => state.todos.list) list!:object[]
    // ...mapGetters('todos', ['doneList', 'unDoneList'])
    @Getter('todos/doneList') doneList!:object[]
    @Getter('todos/unDoneList') unDoneList!:object[]
    // ...mapMutations('todos', { m_addTodo: 'addTodo' }), // 映射同步的mutations
    @Mutation('todos/addTodo') m_addTodo!:(payload:object)=>void
    // ...mapActions('todos', { a_addTodo: 'addTodo' }) // 映射异步的actions
    @Action('todos/addTodo') a_addTodo!:(payload:object)=>void
}
```

## 18 部署

- 本地 npm run build

- 将 .nuxt, package.json, static 等目录复制到服务器指定目录

- 服务器 npm install  安装依赖

- 服务器 npm run start 启动nuxt服务

```js
// 可以配置server选项指定nuxt项目运行的服务器地址和端口号
// nuxt.config.js

export default {
  server: {
    port: 8000, 
    host: '0.0.0.0'
  },
}

// nuxt 项目将会运行在  --->  服务器地址:8000
```

远程连接工具: finallShell

pm2

