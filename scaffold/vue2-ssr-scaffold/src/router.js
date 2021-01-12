// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/test', component: () => import('./pages/test.vue'), name: '测试页面' },
      { path: '/', component: () => import('./pages/index.vue'), name: '首页',  }
    ]
  })
}