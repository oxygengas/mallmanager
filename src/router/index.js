import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
// @:表示项目的根
import AppLogin from '@/components/login/AppLogin'
import AppHome from '@/components/AppHome'
import AppWelcome from '@/components/AppWelcome'
import AppUser from '@/components/users/AppUser'
import AppRights from '@/components/rights/AppRights'
import AppRoles from '@/components/rights/AppRoles'
import AppGoodsList from '@/components/goods/AppGoodsList'
import AppGoodsAdd from '@/components/goods/AppGoodsAdd'
import AppGoodsEdit from '@/components/goods/AppGoodsEdit'
import AppGoodsParams from '@/components/goods/AppGoodsParams'
import AppGoodsCategories from '@/components/goods/AppGoodsCategories'
import AppOrders from '@/components/orders/AppOrders'
import AppReports from '@/components/reports/AppReports'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: AppHome,
      children: [{
        path: '/',
        name: 'welcome',
        component: AppWelcome
      }, {
        path: '/users',
        name: 'users',
        component: AppUser
      }, {
        path: '/rights',
        name: 'rights',
        component: AppRights
      }, {
        path: '/roles',
        name: 'roles',
        component: AppRoles
      }, {
        path: '/goodsadd',
        name: 'goodsadd',
        component: AppGoodsAdd
      }, {
        path: '/goodsedit/:id',
        name: 'goodsedit',
        component: AppGoodsEdit
      }, {
        path: '/goods',
        name: 'goods',
        component: AppGoodsList
      }, {
        path: '/categories',
        name: 'categories',
        component: AppGoodsCategories
      }, {
        path: '/params',
        name: 'params',
        component: AppGoodsParams
      }, {
        path: '/orders',
        name: 'orders',
        component: AppOrders
      },{
        path: '/reports',
        name: 'reports',
        component: AppReports
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin
    },
  ]
})

// 之前请求token验证只是写在axios（但是不发送请求？）
// 普通页面跳转也需要验证 （之前写在home.vue中）
// 路由守卫 => 全局前置守卫
router.beforeEach((to, from, next) => {
  // 1.放过登录请求
  if (to.name === 'login') {
    next()
  } else {
    // 2.非登录 验证token
    let token = localStorage.getItem('token')
    if (!token) { // true 没有登录
      // 跳转登录
      Message.warning('没有登录，请先登录')
      router.push({
        name: 'login'
      })
      return 
    }
  }
  next()
})

export default router
