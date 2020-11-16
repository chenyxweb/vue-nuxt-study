export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-cli',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // 该配置项可用于覆盖 Nuxt.js 自动生成的 vue-router 配置
  router: {
    middleware: 'auth',
    extendRoutes (routes, resolve) {
      // 添加自定义路由
      const _routes = [
        {
          path: '/index',
          component: './pages/404.vue'
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

  // Global CSS (https://go.nuxtjs.dev/config-css)
  // 全局样式
  css: ['./assets/css/transition.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/router.js',
    {
      src: '@/plugins/axios.js',
      ssr: true // 服务端 ???
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],

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

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // loading组件
  loading: '~/components/loading.vue'
  // loading: {
  //   color: '#daa520',
  //   background: 'white'
  // }
}