import Vue from 'vue'
import App from './App'
//uView
import uView from 'uview-ui';
Vue.use(uView);

import lodash from 'lodash';

lodash.defaultsDeep();



//uuid
import {v1 as uuidV1} from 'uuid';

import utils from './utils';

Vue.config.productionTip = false

Vue.prototype.$db = utils.db;

Vue.prototype.$uuid = uuidV1;

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
