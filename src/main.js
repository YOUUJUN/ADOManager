import Vue from 'vue'
import store from './store'
import App from './App'


// 引入MinRouter文件
import MinRouter from './MinRouter'
// 引入router文件
import minRouter from './router'
// 引入全局uView
import uView from 'uview-ui';

Vue.use(uView);

Vue.config.productionTip = false

import $e from './utils/module/engine_module.js';
global.$e = $e;

import mina from './components/min-a.vue'
Vue.component('min-a', mina)

// if (!Vue.prototype['$e']) {
   Vue.prototype.$e = $e;
// }


// 注册路由
Vue.use(MinRouter)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App,
    minRouter
})
app.$mount()
