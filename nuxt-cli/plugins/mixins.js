import Vue from 'vue'
import * as filters from '@/assets/js/filters'
import focus from '@/assets/js/directives/focus'

// 全局方法
const fn = () => console.log('哈哈哈')
Vue.prototype.$fn = fn // 有this的环境才可以访问这个函数

// 全局过滤器
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item])
})

// 自定义指令
Vue.directive('focus', focus)
