<template>

    <view class="wrap">

        <view class="u-tabs-box">
            <u-tabs-swiper activeColor="#f29100" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>

        <swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
            <swiper-item class="swiper-item">
                <scroll-view :class="'scroll'" scroll-y style="height: 100%;width: 100%;" @scrolltolower="">

<!--                    <uni-section title="车辆信息" type="line"></uni-section>-->

                    <uni-list>

<!--                        <uni-list-item title="列表右侧带箭头" rightText="右侧文字" />-->
                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>车牌号</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>皖YOUJUN</span>
                                </div>
                            </template>
                        </uni-list-item>
                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>车型</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>轿车</span>
                                </div>
                            </template>
                        </uni-list-item>
                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>品牌系列</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>福特野马</span>
                                </div>
                            </template>
                        </uni-list-item>
                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>回收单号</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>$HS999900000528</span>
                                </div>
                            </template>
                        </uni-list-item>

                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>车主名称</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>YOUJUN</span>
                                </div>
                            </template>
                        </uni-list-item>

                        <uni-list-item>
                            <template v-slot:header="">
                                <div class="item-header">
                                    <span>车主电话</span>
                                </div>
                            </template>
                            <template v-slot:footer="">
                                <div class="item-footer">
                                    <span>15656229989</span>
                                </div>
                            </template>
                        </uni-list-item>

                    </uni-list>


                </scroll-view>
            </swiper-item>
            <swiper-item class="swiper-item">
                <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="">


                </scroll-view>
            </swiper-item>

            <swiper-item class="swiper-item">
                <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="">


                </scroll-view>
            </swiper-item>

            <swiper-item class="swiper-item">
                <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="">

                    <view class="uni-list list-pd">
                        <view class="uni-list-cell cell-pd">
                            <view class="uni-uploader">
                                <view class="uni-uploader-head">
                                    <view class="uni-uploader-title">点击可预览选好的图片</view>
                                    <view class="uni-uploader-info">{{module4.imageList.length}}/9</view>
                                </view>
                                <view class="uni-uploader-body">
                                    <view class="uni-uploader__files">
                                        <block v-for="(image,index) in module4.imageList" :key="index">
                                            <view class="uni-uploader__file">
                                                <image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
                                            </view>
                                        </block>
                                        <view class="uni-uploader__input-box">
                                            <view class="uni-uploader__input" @tap="chooseImage"></view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                </scroll-view>
            </swiper-item>
        </swiper>


    </view>

</template>
<script>
    import permision from "@/assets/permission.js";
    const sourceType = [
        ['camera'],
        ['album'],
        ['camera', 'album']
    ];
    const sizeType = [
        ['compressed'],
        ['original'],
        ['compressed', 'original']
    ];

    export default {
        data() {
            return {
                list: [
                    {
                        name: '车辆信息'
                    },
                    {
                        name: '车主信息',
                        count: 2
                    },
                    {
                        name: '财务信息',
                        count: 12
                    },
                    {
                        name: '车辆图片',
                        count: 8
                    }
                ],
                current: 0,
                swiperCurrent: 0,




                module4 : {
                    imageList: []
                },

                sourceTypeIndex: 2,
                sourceType: ['拍照', '相册', '拍照或相册'],
                sizeTypeIndex: 0,
                sizeType: ['压缩', '原图', '压缩或原图'],
                countIndex: 8,
                count: [1, 2, 3, 4, 5, 6, 7, 8, 9]

            }
        },

        onLoad (){

        },

        methods : {

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







            //module4  图片组件
            sourceTypeChange: function(e) {
                this.sourceTypeIndex = parseInt(e.detail.value)
            },
            sizeTypeChange: function(e) {
                this.sizeTypeIndex = parseInt(e.detail.value)
            },
            countChange: function(e) {
                this.countIndex = e.detail.value;
            },
            chooseImage: async function() {
                // #ifdef APP-PLUS
                // TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
                if (this.sourceTypeIndex !== 2) {
                    let status = await this.checkPermission();
                    if (status !== 1) {
                        return;
                    }
                }
                // #endif

                if (this.module4.imageList.length === 9) {
                    let isContinue = await this.isFullImg();
                    console.log("是否继续?", isContinue);
                    if (!isContinue) {
                        return;
                    }
                }
                uni.chooseImage({
                    sourceType: sourceType[this.sourceTypeIndex],
                    sizeType: sizeType[this.sizeTypeIndex],
                    count: this.module4.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.module4.imageList.length : this.count[this.countIndex],
                    success: (res) => {
                        this.module4.imageList = this.module4.imageList.concat(res.tempFilePaths);
                    },
                    fail: (err) => {
                        // #ifdef APP-PLUS
                        if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
                            this.checkPermission(err.code);
                        }
                        // #endif
                        // #ifdef MP
                        uni.getSetting({
                            success: (res) => {
                                let authStatus = false;
                                switch (this.sourceTypeIndex) {
                                    case 0:
                                        authStatus = res.authSetting['scope.camera'];
                                        break;
                                    case 1:
                                        authStatus = res.authSetting['scope.album'];
                                        break;
                                    case 2:
                                        authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
                                        break;
                                    default:
                                        break;
                                }
                                if (!authStatus) {
                                    uni.showModal({
                                        title: '授权失败',
                                        content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
                                        success: (res) => {
                                            if (res.confirm) {
                                                uni.openSetting()
                                            }
                                        }
                                    })
                                }
                            }
                        })
                        // #endif
                    }
                })
            },
            isFullImg: function() {
                return new Promise((res) => {
                    uni.showModal({
                        content: "已经有9张图片了,是否清空现有图片？",
                        success: (e) => {
                            if (e.confirm) {
                                this.module4.imageList = [];
                                res(true);
                            } else {
                                res(false)
                            }
                        },
                        fail: () => {
                            res(false)
                        }
                    })
                })
            },
            previewImage: function(e) {
                var current = e.target.dataset.src
                uni.previewImage({
                    current: current,
                    urls: this.module4.imageList
                })
            },
            async checkPermission(code) {
                let type = code ? code - 1 : this.sourceTypeIndex;
                let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
                    await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
                        'android.permission.READ_EXTERNAL_STORAGE');

                if (status === null || status === 1) {
                    status = 1;
                } else {
                    uni.showModal({
                        content: "没有开启权限",
                        confirmText: "设置",
                        success: function(res) {
                            if (res.confirm) {
                                permision.gotoAppSetting();
                            }
                        }
                    })
                }

                return status;
            }
        }
    }
</script>


<style>
    body,page {
        height:100%;
    }
</style>

<style scoped>

    .wrap{
        height:100%;
        display: flex;
        flex-direction: column;
    }

    /deep/ .u-tabs-box{
        flex:none;
    }

    /deep/ .swiper-box{
        flex:auto;
    }


    /deep/ .uni-list-item__container{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    /deep/ .uni-list{
        flex:auto;
        height:100%;
        margin-top:18rpx;
        border-bottom-color: #c8c7cc;
        border-bottom-style: solid;
        border-bottom-width: 0.5px;
    }

    /deep/ .uni-section{
        flex:none;
    }

    /deep/.uni-scroll-view-content{
        display: flex;
        flex-direction: column;
    }



    /*--列表样式--*/
    .item-header{
        color : rgba(0,0,0,0.7);
    }

    .item-footer{
        font-size: 15px;
        color : rgba(0,0,0,0.5);
    }



    /*--图片组件--*/

    .cell-pd {
        padding: 22rpx 30rpx;
    }

    .list-pd {
        margin-top: 50rpx;
    }

    /* 上传 */
    .uni-uploader {
        flex: 1;
        flex-direction: column;
    }
    .uni-uploader-head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .uni-uploader-info {
        color: #B2B2B2;
    }
    .uni-uploader-body {
        margin-top: 16rpx;
    }
    .uni-uploader__files {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .uni-uploader__file {
        margin: 10rpx;
        width: 210rpx;
        height: 210rpx;
    }
    .uni-uploader__img {
        display: block;
        width: 210rpx;
        height: 210rpx;
    }
    .uni-uploader__input-box {
        position: relative;
        margin:10rpx;
        width: 208rpx;
        height: 208rpx;
        border: 2rpx solid #D9D9D9;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
        content: " ";
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
        width: 4rpx;
        height: 79rpx;
    }
    .uni-uploader__input-box:after {
        width: 79rpx;
        height: 4rpx;
    }
    .uni-uploader__input-box:active {
        border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
        background-color: #999999;
    }
    .uni-uploader__input {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

</style>
