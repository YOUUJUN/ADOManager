<template>
    <view>
        <u-navbar title-color="#000" back-icon-color="#000"
                  :is-fixed="isFixed" :is-back="isBack"
                  :back-text-style="{color: '#fff'}"
                  :back-icon-name="backIconName" :back-text="backText">
            <view class="slot-wrap" v-if="useSlot">
                <view class="map-wrap">
                    <text class="map-wrap-text">内勤回收列表</text>
                </view>
            </view>
            <view class="navbar-right" slot="right" v-if="slotRight">
                <view class="message-box right-item">
                    <u-button size="mini" @click="addBill" :custom-style="addBillCustomStyle" shape="circle"
                              type="primary">
                        <u-icon name="plus"></u-icon>
                        增加单据
                    </u-button>
                    <!--                    <min-a to="phone_car_input_inner_desk_micro_bill">增加单据&nbsp;<u-icon name="arrow-right"></u-icon>&nbsp;</min-a>-->
                </view>
            </view>
        </u-navbar>
        <u-dropdown ref="uDropdown">
            <u-dropdown-item title="筛选">
                <view class="slot-content" style="background-color: #FFFFFF;">
                    <scroll-view scroll-y="true" style="height: 200rpx;">
                        <u-form :model="searchInfo" ref="uForm" class="search-form">
                            <u-form-item label-width="180"
                                         :label-position="labelPosition" label="车牌号码" prop="car_no">
                                <u-input :border="border" placeholder="请输入车牌号码" v-model="searchInfo.data.car_no"
                                         type="text"></u-input>
                            </u-form-item>

                            <u-form-item label-width="180"
                                         :label-position="labelPosition" label="回收单号" prop="billno">
                                <u-input :border="border" placeholder="请输入回收单号" v-model="searchInfo.data.billno"
                                         type="text"></u-input>
                            </u-form-item>
                        </u-form>
                    </scroll-view>
                    <view class="u-p-20">
                        <u-button type="primary" @click="closeDropdown">确定</u-button>
                    </view>
                </view>
            </u-dropdown-item>
        </u-dropdown>
        <u-top-tips ref="uTips"></u-top-tips>
        <view class="wrap">
            <view class="u-tabs-box">
                <u-tabs-swiper activeColor="#f29100" ref="uTabs" :list="list" :current="current" @change="tabsChange"
                               :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
            </view>
            <swiper class="swiper-box" :current="swiperCurrent" @transition="transition" style="height: 100%;"
                    @animationfinish="animationfinish">
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="onreachBottom">
                        <view class="swiper-div">
                            <view v-if="data_list_data.length>0">
                                <view class="item" v-for="(item, index) in data_list_data" :key="index">
                                    <u-card margin='0rpx'
                                            @click="chooseBill(item.__rowid)">
                                        <view class="" slot="body">
                                            <view>车&nbsp;&nbsp;主: {{item.car_owner_name }}</view>
                                            <view>车&nbsp;&nbsp;型: {{item.car_kind | formatCarKind}}</view>
                                            <view>车牌号码: {{item.car_no}}</view>
                                            <view>号牌种类: {{item.car_no_type | formatCarNoKind}}</view>
                                            <view>回收时间: {{item.bill_date}}</view>
                                        </view>
                                        <view class="" slot="head">
                                            <u-row gutter="16" justify="flex-end">
                                                <u-col span="9">
                                                    <text class="title u-line-2">单&nbsp;&nbsp;号: {{item.invoice_id}}
                                                    </text>
                                                </u-col>
                                                <u-col span="3">
                                                    <u-tag mode="light" type="error" shape="circle"
                                                           :text="item.bill_status | formatCarFlow"></u-tag>
                                                </u-col>
                                            </u-row>
                                        </view>
                                    </u-card>
                                </view>
                            </view>
                            <view v-else>
                                <u-empty text="暂无数据" mode="list"></u-empty>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%; width: 100%;" @scrolltolower="onreachBottom">
                        <view class="swiper-div">
                            <view v-if="data_done_data.length>0">
                                <view class="item" v-for="(item, index) in data_done_data" :key="index">
                                    <u-card margin='0rpx'
                                            @click="chooseBill(item.__rowid)">
                                        <view class="" slot="body">
                                            <view>车&nbsp;&nbsp;主: {{item.car_owner_name }}</view>
                                            <view>车&nbsp;&nbsp;型: {{item.car_kind | formatCarKind}}</view>
                                            <view>车牌号码: {{item.car_no}}</view>
                                            <view>号牌种类: {{item.car_no_type | formatCarNoKind}}</view>
                                            <view>回收时间: {{item.bill_date}}</view>
                                        </view>
                                        <view class="" slot="head">
                                            <u-row gutter="16" justify="flex-end">
                                                <u-col span="9">
                                                    <text class="title u-line-2">单&nbsp;&nbsp;号: {{item.invoice_id}}
                                                    </text>
                                                </u-col>
                                                <u-col span="3">
                                                    <u-tag mode="light" type="error" shape="circle"
                                                           :text="item.bill_status | formatCarFlow"></u-tag>
                                                </u-col>
                                            </u-row>
                                        </view>
                                    </u-card>
                                </view>
                            </view>
                            <view v-else>
                                <u-empty text="暂无数据" mode="list"></u-empty>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
    import UIcon from "uview-ui/components/u-icon/u-icon";

    //const util = require("@/common/utils.js");

    export default {
        components: {UIcon},
        data() {
            return {

                addBillCustomStyle: {
                    marginRight: '10px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
                },

                backText: '返回',
                backIconName: 'nav-back',
                isBack: true,
                isFixed: true,
                slotRight: true,
                arrow: true,
                useSlot: true,

                border: false,
                labelPosition: 'left',
                errorType: ['message'],

                searchInfo: {
                    data: {
                        car_no: '',
                        billno: ''
                    }
                },
                options: [
                    {
                        text: '收藏',
                        style: {
                            backgroundColor: '#007aff'
                        }
                    },
                    {
                        text: '删除',
                        style: {
                            backgroundColor: '#dd524d'
                        }
                    }
                ],
                current: 0,
                swiperCurrent: 0,
                loadStatus: ['loadmore', 'loadmore'],
                isScroll: false,
                groupName: 'phone_car_input_inner_desk',
                moduleName: 'phone_car_input_inner_desk',
                data_list_ado_name: 'data_list',
                data_list_data: [],
                list: [{
                    name: '待处理'
                }, {
                    name: '已处理'
                }],

                data_done_data: [],
                data_done_ado_name: 'data_done',
                action_bill_edit: 'bill.Edit',

                action_bill_add: 'bill.Add',
                action_filter: 'filter.Refresh',


                adapter:{
                    phone_car_input_inner_desk:{
                        ados:{
                            data_done:{rows:'data_done_data',vars: '',options:{}},
                            data_list:{rows:'data_list_data',vars: '',options:{}}
                        },
                        group:true
                    }
                }
            }
        },

        // beforeCreate() {
        //
        // },

        onLoad() {
            this.$e = new this.$Engine(this);

            this.getData();
        },

        onShow() {
            //changeActiveModule
            //util.changeActiveModule(this.moduleName);
        },

        methods: {
            showTips(message) {
                this.$refs.uTips.show({
                    title: message,
                    type: 'warning'
                });
            },

            closeDropdown() {
                let that = this;
                this.$refs.uDropdown.close();
                util.request(that.action_filter, util.callAction, {
                    params: {
                        db: that.current == 1 ? that.data_done_ado_name : that.data_list_ado_name
                    }
                }, that.searchInfo).then(function (res) {
                    if (res) {
                        that.initData(res);
                    }
                });
            },


            getData() {
                let that = this;
                this.$e.init(that.groupName, that.moduleName).then(function (res) {
                    console.log('get in to refresh ===========>vue', that);
                    console.log('---------------companyList-------', that.companyList)
                });
                // util.initModule(that.groupName, that.moduleName).then(function (res) {
                //     if (res) {
                //         that.initData(res);
                //     }
                // });
            },

            initData(res) {
                let ado = res.data.find(item => item.name === this.data_list_ado_name);
                if (ado) {
                    this.data_list_data = ado.rows;
                    this.$set(this.list, 0, {
                        name: '待处理',
                        dbname: 'data_list',
                        totalSize: ado['totalSize'],
                        currentPage: ado['currentPage']
                    });
                }

                ado = res.data.find(item => item.name === this.data_done_ado_name);
                if (ado) {
                    this.data_done_data = ado.rows;
                    this.$set(this.list, 1, {
                        name: '已处理',
                        dbname: 'data_done',
                        totalSize: ado['totalSize'],
                        currentPage: ado['currentPage']
                    });
                }
            },

            // tabs通知swiper切换
            tabsChange(index) {
                this.swiperCurrent = index;
            },
            // swiper-item左右移动，通知tabs的滑块跟随移动
            transition(e) {
                let dx = e.detail.dx;
                this.$refs.uTabs.setDx(dx);
            },
            // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
            // swiper滑动结束，分别设置tabs和swiper的状态
            animationfinish(e) {
                let current = e.detail.current;
                this.$refs.uTabs.setFinishCurrent(current);
                this.swiperCurrent = current;
                this.current = current;
            },
            // scroll-view到底部加载更多
            onreachBottom() {
                console.log(this.current);
                let that = this;
                var adoName = (that.current == 1) ? that.data_done_ado_name : that.data_list_ado_name;

                var ado = that.$e.getADO(adoName, that.moduleName);
                console.log('-------------1-------', ado)
                console.log('-------------2--------', ado.getDataPage())
                if (ado.hasNextPage()) {
                    ado.nextPage();
                } else {
                    this.showTips('没有更多数据了')
                }


            },

            chooseBill(rowid) {
                let that = this;
                // util.request(that.action_bill_edit, util.callAction, {
                //     params: {
                //         rowid: rowid,
                //         db: that.list[that.current].dbname
                //     }
                // }).then(function (res) {
                //     console.log('------------chooseBill--------------' + JSON.stringify(res));
                //     that.$openPage({
                //         name: that.groupName + '_bill',
                //         query: {
                //             actionName: 'Edit'
                //         }
                //     });
                // });
            },

            addBill() {
                let that = this;

                this.$e.call(this.moduleName, this.action_bill_add, null, null, {
                    params: {
                        db: that.data_list_ado_name,
                    }
                }).then(function (res) {
                    that.$openPage({
                        name: that.groupName + '_micro_bill',
                        query: {
                            actionName: 'Add',
                            checkid: that.$e._checkid
                        }
                    });
                });


                // util.request(that.action_bill_add, util.callAction, {
                //     params: {
                //         db: that.list[that.current].dbname
                //     }
                // }).then(function (res) {
                //     that.$openPage({
                //         name: that.groupName + '_micro_bill',
                //         query: {
                //             actionName: 'Add'
                //         }
                //     });
                // });
            }
        }
    }
</script>

<style lang="scss">
    .wrap {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--window-top));
        width: 100%;
        background: #f0f0f0;
    }

    .swiper-box {
        flex: 1;
    }

    .swiper-item {
        height: 100%;
    }

    .search-form {
        padding: 0 10px;
    }

    .slot-wrap {
        display: flex;
        align-items: center;
        flex: 1;
        flex-direction: column;
    }

    .map-wrap-text {
        font-size: 32 rpx;
        font-weight: 700;
        padding-right: 6 rpx;
    }
</style>
