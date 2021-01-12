<template>
  <div class="test">Test<span>{{ item }}</span></div>
</template>
<script>
import { getQueryParam } from '&/script/utils'

export default {
  name: 'Test',
  data () {
    return {
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