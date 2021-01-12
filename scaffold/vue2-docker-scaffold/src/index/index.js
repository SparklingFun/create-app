// 向template挂载入口Vue文件，一般不建议修改
import Vue from 'vue'
import Index from './index.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from './store'

// 引入路由
/* eslint-disable */
const TestPage = () => import(/* webpackChunkName: "user" */ './pages/TestPage.vue')

const router = new VueRouter({
  routes: [
    { path: '/testpage', component: TestPage, name: '测试页' }
  ],
  mode: 'history'
})

Vue.use(VueRouter)
Vue.use(Vuex)

new Vue({
  router: router,
  store: new Vuex.Store(store),
  render: (h) => h(Index)
}).$mount('#app')
