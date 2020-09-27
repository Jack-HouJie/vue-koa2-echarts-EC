import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SocketService from '@/utils/socket_service'
// 2.1.2引入全局样式
import './assets/styles/global.less'
// 1.3引入axios，配置基础url，挂载至vue原型
import axios from 'axios'
// 1.3 设置请求路径前缀
axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
Vue.prototype.$http = axios

// import echarts from 'echarts'
// 1.2.2 vue原型上挂载echarts
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

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
