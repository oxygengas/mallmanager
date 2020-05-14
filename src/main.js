// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/layout.css'
import MyHttp from '@/plugins/http.js'
import cusBreadcrumb from '@/components/commons/cusBreadcrumb'

// 安装组件
Vue.use(ElementUI)
Vue.use(MyHttp)
Vue.use(require('vue-moment'))

// 是否是生产环境 （开发环境：输出一些重要的提示）
Vue.config.productionTip = false

// 注册公共组件
Vue.component('cusBreadcrumb', cusBreadcrumb)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
