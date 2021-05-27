import {call} from './engine';

const ADOManager = {
    adapter : {}
};

ADOManager.install = function (Vue, options) {

    Vue.prototype.$call = call;
    // Vue.prototype.$requetADO = requetADO;
    // Vue.prototype.$asyncCall = asyncCall;
    // Vue.prototype.$init = init;

    // Vue.mixin({
    //     data : {
    //
    //         car : {
    //             rows : [{
    //                 __row : 0,
    //                 __rownum : 0,
    //                 name : '',
    //                 tel : '',
    //                 id : ''
    //             }],
    //
    //             vars : {
    //                 ctrl1 : '',
    //                 ctrl2 : true
    //             }
    //         },
    //
    //         envs : {
    //
    //         }
    //
    //     }
    // })

};


export default ADOManager


