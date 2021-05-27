<template>
    <view class="container">

        <view class="status_bar"></view>

        <u-dropdown :close-on-click-mask="true" ref="uDropdown" activeColor="#2979ff" :borderBottom="false">
            <u-dropdown-item @change="" v-model="value1" title="搜索条件" :options="options1"></u-dropdown-item>
            <u-dropdown-item @change="" v-model="value2" title="业务员" :options="options2"></u-dropdown-item>
<!--            <u-dropdown-item title="属性">-->
<!--                &lt;!&ndash;                    <view class="slot-content">&ndash;&gt;-->
<!--                &lt;!&ndash;                        <view class="item-box">&ndash;&gt;-->
<!--                &lt;!&ndash;                            <view class="item" :class="[item.active ? 'active' : '']" @tap="" v-for="(item, index) in list" :key="index">&ndash;&gt;-->
<!--                &lt;!&ndash;                                {{item.label}}&ndash;&gt;-->
<!--                &lt;!&ndash;                            </view>&ndash;&gt;-->
<!--                &lt;!&ndash;                        </view>&ndash;&gt;-->
<!--                &lt;!&ndash;                        <u-button type="primary" @click="">确定</u-button>&ndash;&gt;-->
<!--                &lt;!&ndash;                    </view>&ndash;&gt;-->
<!--            </u-dropdown-item>-->
        </u-dropdown>


        <view>

            <uni-list>

                <template v-for="item of carListData">

                    <uni-swipe-action>
                        <uni-swipe-action-item :right-options="options">
                            <uni-list-item :clickable="true" @click="editCar(item.CAR_INDEX)">
                                <template v-slot:header="" style="display: flex;flex-direction: column;">
                                    <div>
                                        <div><span>车牌号：</span><span style="">{{item.CAR_NO}}</span></div>
                                        <div style="color:#999;font-size: 24rpx;margin-top: 10rpx;"><span>录入时间：</span><span style="">{{item.IN_DATE}}</span></div>
                                    </div>
                                </template>
                                <template v-slot:footer="" style="display: flex;flex-direction: column; justify-content: space-around;">
                                    <div>
                                        <div style="color:#999;font-size: 24rpx;margin-top: 10rpx;"><span>车型：</span><span>{{item.CAR_KIND}}</span></div>
                                        <uni-badge class="" text="车辆录入" type="error" :customStyle="badgeStyle"/>
                                    </div>
                                </template>
                            </uni-list-item>
                        </uni-swipe-action-item>
                    </uni-swipe-action>

                </template>
            </uni-list>


            <u-loadmore v-if="showLoadMore" status="loading" :loadText="{loading: '正在加载...'}" icon-type="circle" :is-dot="false" marginTop="14" marginBottom="14"/>

        </view>

    </view>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
                extraIcon1: {
                    color: '#007aff',
                    size: '22',
                    type: 'gear-filled'
                },

                badgeStyle : {
                    width : '60px',
                    marginTop : '10rpx'
                },

                carListData : [],

                options:[
                    {
                        text: '删除',
                        style: {
                            backgroundColor: '#dd524d'
                        }
                    }
                ],

                showLoadMore: false,

                barHeight : '24',


                //下拉栏
                value1: '',
                value2: '2',
                options1: [
                    {
                        label: '按车牌号',
                        value: 1,
                    },
                    {
                        label: '按回收单号',
                        value: 2,
                    }
                ],
                options2: [
                    {
                        label: '所有',
                        value: 1,
                    },
                    {
                        label: 'YOUJUN',
                        value: 2,
                    },
                    {
                        label: '张三',
                        value: 3,
                    },
                    {
                        label: '柯涵',
                        value: 4,
                    }
                ]

            }
        },

        onReady(){
            this.barHeight = plus.navigator.getStatusbarHeight();
            console.log('barHeight',this.barHeight);
        },

        onLoad() {
            this.getListDataFromDB();
        },
        onUnload() {
            this.showLoadMore = false;
        },

        onPullDownRefresh() {
            console.log('onPullDownRefresh');
            this.getListDataFromDB();
        },


        onReachBottom() {
            console.log("onReachBottom");
            this.showLoadMore = true;
            setTimeout(() => {
                this.getListDataFromDB();
            }, 300)
        },


        created(){
            // this.getListDataFromDB();
        },

        methods: {

            async getListDataFromDB(){

                let result = await this.$db.selectData('netless', 'car');

                console.log('result',result);
                for(let item of result.data){
                    let obj = {
                        CAR_INDEX : item.CAR_INDEX,
                        CAR_NO : item.CAR_NO,
                        IN_DATE : item.IN_DATE,
                        CAR_KIND : item.CAR_KIND,
                        CAR_OWNER_NAME : item.CAR_OWNER_NAME,
                        CAR_OWNER_PHONE : item.CAR_OWNER_PHONE,
                        CAR_OWNER_CODE : item.CAR_OWNER_CODE,
                        FUEL_NAME : item.FUEL_NAME,
                    };
                    this.carListData.push(obj);
                }

                uni.stopPullDownRefresh();
            },

            switchChange(e) {
                uni.showToast({
                    title: 'change:' + e.value,
                    icon: 'none'
                })
            },


            //下拉刷新
            initData(){
                setTimeout(() => {
                    uni.stopPullDownRefresh();
                }, 300);
            },
            setListData() {

            },



            //下拉栏

            /**
             *  点击导航栏 buttons 时触发
             */
            onNavigationBarButtonTap() {
                uni.showModal({
                    title: '提示',
                    content: '点击确定，修改输入框的内容为abc',
                    success: res => {
                        if (res.confirm) {
                            const currentWebview = this.$mp.page.$getAppWebview();
                            currentWebview.setTitleNViewSearchInputText("abc");
                        }
                    }
                });
            },






            //业务代码，编辑车辆信息
            editCar(index){
                uni.navigateTo({
                    url: `/pages/post/post`,
                    animationType: 'slide-in-left',
                    animationDuration: 250,
                    success : res => {
                        res.eventChannel.emit('editModel',{msg : index});
                    },
                    fail : msg =>{
                        console.log('msg', msg);
                    }
                });

            }


        }
    }
</script>

<style>
    /*填充导航栏*/
    .status_bar {
        height: calc(var(--status-bar-height) + 45px);
        width: 100%;
        background-color: #F8F8F8;
    }



</style>


<style>
    .sticky {
        background-color: #007aff;
        color: #fff;
        padding: 24rpx;
        margin: auto;
        font-size: 28rpx;
        line-height: 1;
        border-radius: 5px;
    }
</style>
