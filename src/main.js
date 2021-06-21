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

/**
 * 引入一个系统中的常量
 */
import erp_constant from "./utils/module/erp_constant";

Vue.filter("formatCarKind", function (val) {
    return erp_constant.kind(val);
});

Vue.filter("formatCarFlow", function (val) {
    return erp_constant.car_flow(val);
});

Vue.filter("formatCarNoKind", function (val) {
    return erp_constant.carno(val);
});

Vue.filter("formatSaleFlow", function (val) {
    return erp_constant.sale_flow(val);
});

Vue.filter("formatSplitFlow", function (val) {
    return erp_constant.split_flow(val);
});

Vue.filter("formatStoreFlow", function (val) {
    return erp_constant.store_flow(val);
});

Vue.config.productionTip = false
import mina from './components/min-a.vue'
Vue.component('min-a', mina)
// 注册路由
Vue.use(MinRouter)

import Engine from './utils/module/engine_module';
Vue.prototype.$Engine = Engine;

App.mpType = 'app'

const app = new Vue({
    store,
    ...App,
    minRouter
})
app.$mount()
