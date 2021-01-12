<template>
  <div class="index">
    <h3>Index Page {{ testStr }}</h3>
    <a href="/test">Test Page Diff 1</a>
  </div>
</template>
<script>
import { getQueryParam } from '&/script/utils'

export default {
  name: 'Test',
  data () {
    return {
      testStr: '5'
    }
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('fetchAPI', 'vue')
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item () {
      return this.$store.state.items['vue']
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
.index {
  background-color: blueviolet;
}
</style>