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
