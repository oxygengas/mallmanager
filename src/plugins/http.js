// 网络请求 封装axios (第三方插件本身与vue没有任何关系，vue可以支持安装插件)
import axios from 'axios'

// 定义插件对象
let MyHttp = {}
// 安装插件
MyHttp.install = function (Vue, options) {
    // 设置token ? 该代码只会在插件初始化的时候加载一次 （会出现no token的问题）
    // let AUTH_TOKEN = localStorage.getItem('token')
    // console.log('AUTH_TOKEN=>'+AUTH_TOKEN)
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
    // 使用拦截器解决(每一次请求前)
    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        if(config.url !== 'login'){
            config.headers['Authorization'] = localStorage.getItem('token')
        }
        return config;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      })
    // 设置基准路径
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    
    // axios添加实例属性
    Vue.prototype.$http = axios
}

// 导出插件
export default MyHttp