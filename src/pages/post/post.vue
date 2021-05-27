<template>

    <view class="wrap">
        <view class="u-tabs-box">
            <u-tabs-swiper activeColor="#f29100" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>
        <swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
            <swiper-item class="swiper-item">
                <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="">

                    <u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">

                        <u-form-item :label-position="labelPosition" label="车主姓名" prop="CAR_OWNER_NAME" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_NAME" placeholder="请填写车主姓名"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车主电话" prop="CAR_OWNER_PHONE" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_PHONE" placeholder="请填写车主电话"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车主身份证" prop="CAR_OWNER_CODE" label-width="160">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_CODE" placeholder="请填写车主身份证"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="燃油类型" prop="FUEL_NAME" label-width="150">
                            <u-input :border="border" type="select" :select-open="selectList.FUEL_NAME_LIST.show" @click="selectList.FUEL_NAME_LIST.show = true" v-model="model.FUEL_NAME" placeholder="请选择车辆类型"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车牌号码" prop="CAR_NO" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_NO" placeholder="请输入车牌号码"></u-input>
                            <u-button @click="openCarNoInput" slot="right" size="mini" type="success">输入</u-button>

                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车辆类型" prop="CAR_KIND" label-width="150">
                            <u-input :border="border" type="select" :select-open="selectList.CAR_KIND_LIST.show" @click="selectList.CAR_KIND_LIST.show = true" v-model="model.CAR_KIND" placeholder="请选择车辆类型"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="残值款" prop="ESTIMATE_AMOUNT" label-width="140">
                            <u-input :border="border" type="text" v-model="model.ESTIMATE_AMOUNT" placeholder="请输入残值款"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="录入时间" prop="IN_DATE" label-width="150">
                            <u-input @click="showCalendar" :disabled='true' :border="border" type="time" v-model="model.IN_DATE" placeholder="请选择录入时间"></u-input>
                            <u-icon @click="showCalendar" slot="right" name="calendar" size="40" color="#909399"></u-icon>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="上传图片" prop="photo" label-width="150">
                            <u-upload width="160" height="160"></u-upload>
                        </u-form-item>

                    </u-form>

                    <u-button @click="submit">提交</u-button>


                </scroll-view>
            </swiper-item>
            <swiper-item class="swiper-item">
                <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="">

                    <u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">

                        <u-form-item :label-position="labelPosition" label="车主姓名" prop="CAR_OWNER_NAME" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_NAME" placeholder="请填写车主姓名"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车主电话" prop="CAR_OWNER_PHONE" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_PHONE" placeholder="请填写车主电话"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车主身份证" prop="CAR_OWNER_CODE" label-width="160">
                            <u-input :border="border" type="text" v-model="model.CAR_OWNER_CODE" placeholder="请填写车主身份证"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="燃油类型" prop="FUEL_NAME" label-width="150">
                            <u-input :border="border" type="select" :select-open="selectList.FUEL_NAME_LIST.show" @click="selectList.FUEL_NAME_LIST.show = true" v-model="model.FUEL_NAME" placeholder="请选择车辆类型"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车牌号码" prop="CAR_NO" label-width="150">
                            <u-input :border="border" type="text" v-model="model.CAR_NO" placeholder="请输入车牌号码"></u-input>
                            <u-button @click="openCarNoInput" slot="right" size="mini" type="success">输入</u-button>

                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="车辆类型" prop="CAR_KIND" label-width="150">
                            <u-input :border="border" type="select" :select-open="selectList.CAR_KIND_LIST.show" @click="selectList.CAR_KIND_LIST.show = true" v-model="model.CAR_KIND" placeholder="请选择车辆类型"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="残值款" prop="ESTIMATE_AMOUNT" label-width="140">
                            <u-input :border="border" type="number" v-model="model.ESTIMATE_AMOUNT" placeholder="请输入残值款"></u-input>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="录入时间" prop="IN_DATE" label-width="150">
                            <u-input @click="showCalendar" :disabled='true' :border="border" type="time" v-model="model.IN_DATE" placeholder="请选择录入时间"></u-input>
                            <u-icon @click="showCalendar" slot="right" name="calendar" size="40" color="#909399"></u-icon>
                        </u-form-item>

                        <u-form-item :label-position="labelPosition" label="上传图片" prop="photo" label-width="150">
                            <u-upload width="160" height="160"></u-upload>
                        </u-form-item>


                    </u-form>

                    <u-button @click="submit">提交</u-button>

                </scroll-view>
            </swiper-item>
        </swiper>


        <u-select mode="single-column" :list="selectList.FUEL_NAME_LIST.data" v-model="selectList.FUEL_NAME_LIST.show" @confirm="choiceFuel"></u-select>
        <u-select mode="single-column" :list="selectList.CAR_KIND_LIST.data" v-model="selectList.CAR_KIND_LIST.show" @confirm="choiceKind"></u-select>

        <u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>

        <u-calendar v-model="calendar.show" ref="calendar" @change="calendarChange" :mode="calendar.mode"
                    :start-text="calendar.startText" :end-text="calendar.endText" :range-color="calendar.rangeColor"
                    :range-bg-color="calendar.rangeBgColor" :active-bg-color="calendar.activeBgColor" :btn-type="calendar.btnType"
        >
        </u-calendar>

    </view>

</template>

<script>
    export default {
        data() {
            let that = this;
            return {
                list: [
                    {
                        name: '第一屏'
                    },
                    {
                        name: '第二屏',
                        count: 12
                    }
                ],
                current: 0,
                swiperCurrent: 0,


                model: {
                    CAR_OWNER_NAME : '123',
                    CAR_OWNER_PHONE : '12',
                    CAR_OWNER_CODE : '123456',
                    FUEL_NAME : '汽油',
                    CAR_NO : '皖YOUJUN',
                    CAR_KIND : '轿车',
                    ESTIMATE_AMOUNT : 200,
                    IN_DATE : '2021-5-14',
                },

                selectList : {
                    FUEL_NAME_LIST : {
                        show : false,
                        data : [
                            {
                                value : '汽油',
                                label : '汽油'
                            },
                            {
                                value : '柴油',
                                label : '柴油'
                            },
                            {
                                value : '纯电',
                                label : '纯电'
                            }
                        ]
                    },

                    CAR_KIND_LIST : {
                        show : false,
                        data : [
                            {
                                value : '轿车',
                                label : '轿车'
                            },
                            {
                                value : '面包车',
                                label : '面包车'
                            },
                            {
                                value : '货车',
                                label : '货车'
                            }
                        ]
                    }
                },

                calendar : {
                    show : false,
                    mode : 'date',
                    result: "请选择日期",
                    startText: '开始',
                    endText: '结束',
                    rangeColor: '#2979ff',
                    rangeBgColor: 'rgba(41,121,255,0.13)',
                    activeBgColor: '#2979ff',
                    btnType: 'primary',
                },

                rules: {

                },

                border: false,


                radioCheckWrap: false,
                labelPosition: 'left',
                codeTips: '',
                errorType: ['message'],
            };
        },
        onLoad() {
            console.log('onLoad====>');
            this.initData();
        },

        created(){
            console.log('created====>');

            this.$call(this,'model');

            for(let item in this.model){
                let prop = `model.${item}`;
                console.log('prop',prop);
                this.$watch(prop,function(newbie,old){
                    console.log('old==>',old, 'new==>',newbie);

                    ado.setVaueAt(row, "", )
                })
            }
        },

        computed: {
            borderCurrent() {
                return this.border ? 0 : 1;
            }
        },

        onReady() {
            // this.$refs.uForm.setRules(this.rules);
        },
        methods: {

            //tabs
            // tab栏切换
            change(index) {
                this.swiperCurrent = index;
            },

            transition({ detail: { dx } }) {
                this.$refs.tabs.setDx(dx);
            },

            animationfinish({ detail: { current } }) {
                this.$refs.tabs.setFinishCurrent(current);
                this.swiperCurrent = current;
                this.current = current;
            },




            showCalendar(index) {
                this.calendar.show = !index;
            },

            calendarChange(e) {
                if (this.mode == 'range') {
                    this.calendar.result = e.startDate + " - " + e.endDate;
                } else {
                    this.calendar.result = e.result;
                    this.model.IN_DATE = e.result;
                }
            },

            openCarNoInput(){

                uni.navigateTo({
                    url: `/pages/carNo/carNo?fuel_name=${this.model.FUEL_NAME}&car_no=${this.model.CAR_NO}`,
                    success : result => {
                        console.log('result', result);
                    },
                    fail : msg =>{
                        console.log('msg', msg);
                    }
                });

                uni.$on('getCarNo',(res) => {
                    this.model.CAR_NO = res.msg.trim();
                });

            },


            //选择燃油类型
            choiceFuel(e){
                console.log('e=>',e);
                console.log('value',e[0].value);
                this.model.FUEL_NAME = e[0].value;
            },

            choiceKind(e){
                this.model.CAR_KIND = e[0].value;
            },



            submit() {
                let data = {
                    CAR_INDEX : this.$uuid()
                };
                Object.assign(data, this.model);
                this.$db.insertData('netless', 'car', data);


                // this.$refs.uForm.validate(valid => {
                //     console.log("valid==>",valid);
                //     if (valid) {
                //         $u.toast('alright');
                //         console.log('验证通过');
                //     } else {
                //         console.log('验证失败');
                //     }
                // });
            },


            // checkbox选择发生变化
            checkboxGroupChange(e) {
                this.model.likeFruit = e;
            },
            // radio选择发生变化
            radioGroupChange(e) {
                this.model.payType = e;
            },
            // 勾选版权协议
            checkboxChange(e) {
                this.model.agreement = e.value;
            },


            codeChange(text) {
                this.codeTips = text;
            },
            // 获取验证码
            getCode() {
                if(this.$refs.uCode.canGetCode) {
                    // 模拟向后端请求验证码
                    uni.showLoading({
                        title: '正在获取验证码',
                        mask: true
                    })
                    setTimeout(() => {
                        uni.hideLoading();
                        // 这里此提示会被this.start()方法中的提示覆盖
                        this.$u.toast('验证码已发送');
                        // 通知验证码组件内部开始倒计时
                        this.$refs.uCode.start();
                    }, 2000);
                } else {
                    this.$u.toast('倒计时结束后再发送');
                }
            },








            //业务代码
            //初始化编辑数据
            initData(){
                const eventChannel = this.getOpenerEventChannel();
                eventChannel.on('editModel',(data) => {
                    console.log('data.msg',data.msg);
                    let car_index = data.msg;

                    this.$db.selectData('netless', 'car', `CAR_INDEX = '${car_index}'`).then(res => {
                        console.log('res==>',res);
                        this.model = {
                            CAR_OWNER_NAME : res.data[0].CAR_OWNER_NAME,
                            CAR_OWNER_PHONE : res.data[0].CAR_OWNER_PHONE,
                            CAR_OWNER_CODE : res.data[0].CAR_OWNER_CODE,
                            FUEL_NAME : res.data[0].FUEL_NAME,
                            CAR_NO : res.data[0].CAR_NO,
                            CAR_KIND : res.data[0].CAR_KIND,
                            ESTIMATE_AMOUNT : res.data[0].ESTIMATE_AMOUNT,
                            IN_DATE : res.data[0].IN_DATE,
                        }
                    });

                })
            }


        }
    };
</script>

<style scoped lang="scss">
    .wrap {
        padding: 30rpx;
    }

    .agreement {
        display: flex;
        align-items: center;
        margin: 40rpx 0;

        .agreement-text {
            padding-left: 8rpx;
            color: $u-tips-color;
        }
    }
</style>


<style>
    /* #ifndef H5 */
    page {
        height: 100%;
        background-color: #fff;
    }
    /* #endif */
</style>

<style lang="scss" scoped>
    .wrap {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--window-top));
        width: 100%;
    }
    .swiper-box {
        flex: 1;
    }
    .swiper-item {
        height: 100%;
    }
</style>

