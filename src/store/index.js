import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//全局变量定义
const store = new Vuex.Store({
    //相当于data
    state: {
        hasLogin: false,
        username: '',
        sessionId: '',
        sessionValue: ''
    },

    //相当于methods
    mutations: {
        login(state, loginResult) {
            console.log('--------login-----------' + JSON.stringify(loginResult))
            state.hasLogin = true;

            state.username = loginResult.username;
            state.sessionId = loginResult.sid;
            state.sessionValue = loginResult.result;
        },

        logout(state) {
            state.hasLogin = false;

            state.username = '';
            state.sessionId = '';
            state.sessionValue = '';
        }
    },
    //可以同时执行多个mutations方法
    actions: {}
})

export default store
