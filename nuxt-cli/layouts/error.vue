<template>
  <div class="not-found">
    <h3>404</h3>
    <button @click="handleClick">
      去首页
    </button>
  </div>
</template>

<script>
export default {

  methods: {
    handleClick () {
      this.$router.push('/')
    }
  }

}
</script>

<style scoped>
.not-found{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>
