import Engine from './engine_module.js';
import {fn} from './utils_module.js';

const enginePlugin = {

};

enginePlugin.install = function (Vue, options) {

    Vue.mixin({
        beforeCreate: function () {
            if(!Vue.prototype.$e){
                Vue.prototype.$e  = new Engine();
                Vue.prototype.$e.fn = fn;
            }
        }
    });
}


export default enginePlugin
