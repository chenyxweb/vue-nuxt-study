<template>
  <div class="login">
    login
    <nuxt-link to="/goods">
      goods
    </nuxt-link>
    <!--  -->
    <button @click="handleClick">
      登录操作
    </button>
  </div>
</template>

<script>
export default {

  beforeRouteLeave (to, from, next) {
    console.log(to)
    const res = window.confirm('确定要离开么')
    next(res)
  },
  methods: {
    handleClick() {
      // 将用户信息存储到 vuex 和 cookie中
      this.$cookies.set('token', '123123123123')
      this.$store.commit('user/setToken', '123123123123')
    }
  }

}
</script>

<style>

</style>
