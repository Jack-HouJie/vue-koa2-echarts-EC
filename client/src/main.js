import Vue from 'vue'
import router from './router' // vue-router
import store from './store' // vuex
import axios from 'axios'
import App from './App.vue' // 根组件
import SocketService from '@/utils/socket_service' // socket通信工具类
import './assets/styles/global.less' // 全局样式

// 1.2.2 挂载echarts(index.html中引入)
Vue.prototype.$echarts = window.echarts

// 1.3 配置挂载axios
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
Vue.prototype.$http = axios



// 连接到后台WebSocket服务器
SocketService.Instacne.connect()
// 把SocketService实例挂载到Vue原型上
// 使组件方便调用SocketService的方法
Vue.prototype.$socket = SocketService.Instacne

new Vue({
  router, 
  store,
  render: h => h(App)
}).$mount('#app')
