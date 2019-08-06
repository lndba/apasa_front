// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueWechatTitle from 'vue-wechat-title'
import login from './components/Login'
import index from './components/Index'
import echarts from 'echarts'
import 'echarts/theme/macarons.js'

Vue.prototype.$echarts = echarts
Vue.prototype.$store = store
Vue.prototype.$axios = axios
axios.defaults.headers['Content-Type'] = "application/json"
Vue.config.productionTip = false
Vue.use(iView)
Vue.use(VueWechatTitle)


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})

router.beforeEach(function (to, from, next) {
    if (to.meta.requireAuth) {
        if (store.state.token) {
            next()
        } else {
            next({
                name: 'login',
            })
        }
    } else {
        next()
    }
})

axios.defaults.timeout = 5000; // 超时时间

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });
