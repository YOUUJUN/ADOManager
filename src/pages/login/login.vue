<template>
    <view class="page-box">
        <u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
            <u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120"
                         :label-position="labelPosition" label="账号" prop="userid">
                <u-input :border="border" placeholder="请输入账号" v-model="model.userid" type="text"></u-input>
            </u-form-item>
            <u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="lock" label-width="120"
                         :label-position="labelPosition" label="密码" prop="pwd">
                <u-input :password-icon="true" :border="border" type="password" v-model="model.pwd"
                         placeholder="请输入密码"></u-input>
            </u-form-item>
        </u-form>
        <u-button @click="submit" type="primary">提交</u-button>
    </view>
</template>

<script>

    // const $e = require("@/yc-utils/engine_module.js");


    export default {
        data() {
            return {
                action_login: 'Login',
                groupName: 'sys_user_login',
                moduleName: 'sys_user_login',
                model: {
                    userid: 'a0002',
                    pwd: 'a1111'
                },
                // model: {
                //     userid: '',
                //     pwd: ''
                // },
                list_data:[],
                list_vars:{},
                rules: {
                    userid: [
                        {
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur',
                        },
                        {
                            min: 5,
                            max: 20,
                            message: '账号长度在5到20个字符',
                            trigger: ['change', 'blur'],
                        }
                    ],
                    pwd: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: ['change', 'blur'],
                        },
                        {
                            min: 5,
                            message: '密码长度在5到20个字符',
                            trigger: ['change', 'blur'],
                        }
                    ],
                },
                border: false,
                labelPosition: 'left',
                codeTips: '',
                errorType: ['message'],
            };
        },

        onReady() {
            //让validate 生效
            this.$refs.uForm.setRules(this.rules);
        },

        beforeCreate(){
            this.$e = new this.$Engine();
        },

        methods: {
            submit() {
                console.log("this==>",this);
                let vm = this;
                this.$refs.uForm.validate(valid => {
                    if (valid) {
                        console.log('-----------------------------------', this.$e);
                        this.$e.init(this.groupName, this.moduleName, null, {
                            _act: this.action_login,
                            params: this.model
                        }).then(function (res) {

                            if (res && res['envs']) {
                                console.log('this',this);
                                //修改store中登录状态
                                vm.$store.commit('login', res['envs']);
                                //缓存登录信息
                                // this.$cache.set('autoLoginInfo', {
                                //     userid: res['envs']['sid'],
                                //     pwd: res['envs']['result']
                                // }, 0);

                                //保存用户名信息，用于显示
                                // this.$cache.set('username', res['envs']['username'], 0);

                                if (vm.$store.state.hasLogin) {
                                    vm.$openPage({
                                        name: 'index',
                                        query: {}
                                    })


                                    // uni.navigateTo({
                                    //     url: `/pages/index/index`,
                                    //     animationType: 'slide-in-left',
                                    //     animationDuration: 250,
                                    //     success : res => {
                                    //         res.eventChannel.emit('send',{
                                    //             vueP : vm,
                                    //             msg : vm.$e
                                    //         });
                                    //     },
                                    //     fail : msg =>{
                                    //         console.log('msg', msg);
                                    //     }
                                    // });
                                }
                            }
                            console.log('-----------res-----------' + JSON.stringify(res));
                        });

                        // util.initModule(that.groupName, that.moduleName, {
                        //     actionName: this.action_login,
                        //     params: this.model
                        // }).then(function (res) {
                        //     if (res && res['envs']) {
                        //         //修改store中登录状态
                        //         that.$store.commit('login', res['envs']);
                        //         //缓存登录信息
                        //         that.$cache.set('autoLoginInfo', {
                        //             userid: res['envs']['sid'],
                        //             pwd: res['envs']['result']
                        //         }, 0);
                        //
                        //         //保存用户名信息，用于显示
                        //         that.$cache.set('username', res['envs']['username'], 0);
                        //
                        //         if (that.$store.state.hasLogin) {
                        //             that.$openPage({
                        //                 name: 'index',
                        //                 query: {}
                        //             })
                        //         }
                        //     }
                        // });
                        console.log('验证通过');
                    } else {
                        console.log('验证失败');
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    .page-box {
        padding: 20rpx;
    }
</style>
