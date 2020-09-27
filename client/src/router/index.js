import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    name: 'ScreenPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ScreenPage.vue')
  },
  {
    // 2.1
    path: '/seller',
    name: 'SellerPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SellerPage.vue')
  },
  {
    // 2.2
    path: '/trend',
    name: 'TrendPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/TrendPage.vue')
  },
  {
    path: '/map',
    name: 'MapPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/MapPage.vue')
  },
  {
    path: '/rank',
    name: 'RankPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/RankPage.vue')
  },
  {
    path: '/hot',
    name: 'HotPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/HotPage.vue')
  },
  {
    path: '/stock',
    name: 'StockPage',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/StockPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
