<template>
  <div class="goods">
    <div>goods</div>
    <nuxt-link to="/about">
      about
    </nuxt-link>
  </div>
</template>

<script>
export default {

  transition: 'move',

  mounted () {
    console.log(this.$route)
  }

}
</script>

<style scoped>
.goods{
  background-color: sandybrown;
}
</style>
