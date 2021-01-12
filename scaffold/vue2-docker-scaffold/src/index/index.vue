<template>
  <div class="example-index">
    <!-- 这里是Vue的入口文件，配置在index.js，统一被Webpack读取并生成独立页面入口 -->
    <span>This is Index Page.</span>
  </div>
</template>
<script>
// 框架内置Axios, Element-UI
export default {
  data () {
    return {}
  },
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="sass" rel="stylesheet/sass" scoped>
@import './index.sass'
</style>
