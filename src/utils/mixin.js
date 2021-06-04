import {call} from './engine';

const ADOManager = {
    adapter : {}
};

ADOManager.install = function (Vue, options) {

    Vue.prototype.$call = call;
    // Vue.prototype.$requetADO = requetADO;
    // Vue.prototype.$asyncCall = asyncCall;
    // Vue.prototype.$init = init;

    Vue.mixin({
        data : {
            car_rows:[],
            car_vars:{} ,


            ados: {
                car: {
                    rows: [{
                        __row: 0,
                        __rownum: 0,
                        name: '',
                        tel: '',
                        id: ''
                    }],
                    vars: {
                        ctrl1: '',
                        ctrl2: true
                    }
                },
            },
            envs : {

            },
            views:{
                abc:{
                    type:"1/宝马;2:大众"
                }
            }


        },
        methods:{
            save(){
                this.getADO();
            }
        }
    })

};

var adapter={
    ados: {
        car: {
            rows: vue.car_rows,
            vars: vue.car_vars
        }
    }
}

export default ADOManager


