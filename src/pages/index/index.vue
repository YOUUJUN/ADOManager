<template>
    <view>
        <u-navbar title-color="#000" back-icon-color="#000"
                  :is-fixed="isFixed" :is-back="isBack"
                  :back-text-style="{color: '#fff'}"
                  :back-icon-name="backIconName" :back-text="backText">
            <view class="slot-wrap" v-if="useSlot">
                <view class="map-wrap">
                    <text class="map-wrap-text">首页</text>
                </view>
            </view>
            <view class="navbar-right" slot="right" v-if="slotRight">
                <view class="message-box right-item">
                    <min-a to="company">选公司&nbsp;<u-icon name="arrow-right"></u-icon>&nbsp;</min-a>
                </view>
            </view>
        </u-navbar>
        <view class="list-wrap">
            <u-cell-group :title="item.name" v-for="(item, index) in menuGroupList" :key="index">
                <u-cell-item @click="openPage(inner.path)" :title="inner.name"
                             v-for="(inner, innerIndex) in item.children" :key="innerIndex" :icon="inner.icon"
                             :arrow="arrow">
                    <u-badge :absolute="false" v-if="inner.count" :count="inner.count" slot="right-icon"></u-badge>
                </u-cell-item>
            </u-cell-group>
        </view>
    </view>
</template>
<script>
    //const $e = require("@/yc-utils/engine_module.js");

    export default {
        data() {
            return {
                backText: '返回',
                backIconName: 'nav-back',
                isBack: true,
                isFixed: true,
                slotRight: true,
                arrow: true,
                useSlot: true,

                groupName: 'phone_app',
                moduleName: 'phone_app',
                action_init: 'InitRight',


                user_right_ado_name: 'user_right',
                menuList: [],

                //环境变量
                envs: {},
                title: '首页',

                adapter:{
                    phone_app:{
                        ados:{
                            user_right:{rows:'menuList',vars: '',options:{}}
                        },
                        group:true
                    }
                }
            }
        },

        // beforeCreate(){
        //     this.$e = new this.$Engine();
        // },

        computed: {
            // 计算属性的 getter
            menuGroupList() {
                console.log('1', this.$e)

                let list = [];
                if (this.menuList && this.menuList.length > 0) {
                    for (let i = 0, len = this.menuList.length; i < len; i++) {
                        let item = this.menuList[i];
                        let newItem = {};
                        let levels = item['level_code'].split('.');
                        let access = item['access_alias'].split('.');
                        if (levels.length == 2) {
                            newItem.parentId = '' + levels[0];
                        } else if (levels.length == 3) {
                            newItem.parentId = '' + levels[0] + '.' + levels[1];
                            if (access.length == 3) {
                                newItem.path = access[2];
                            } else {
                                newItem.path = access[0];
                            }
                            newItem.icon = item['img_path'];
                            if (this.envs[item['access_alias'] + '_num']) {
                                newItem.count = parseInt(this.envs[item['access_alias'] + '_num']);
                            }
                        } else {
                            continue;
                        }
                        newItem.id = item['level_code'];
                        newItem.name = item['right_name'];
                        if (newItem.name == '牌照领用') {
                            continue;
                        }
                        list.push(newItem);
                    }
                }
                return this.composeTree(list);
            }
        },

        onLoad() {
            this.$e = new this.$Engine(this);
            //this.getCompanyData();
        },

        onShow() {
            this.getMenuData();
        },

        methods: {
            submitAct() {
                console.log('----------------submitAct------------------');
            },

            composeTree: function (list = []) {
                const data = JSON.parse(JSON.stringify(list)) // 浅拷贝不改变源数据
                const result = []
                if (!Array.isArray(data)) {
                    return result
                }
                data.forEach(item => {
                    delete item.children
                })
                const map = {}
                data.forEach(item => {
                    map[item.id] = item
                })
                data.forEach(item => {
                    const parent = map[item.parentId]
                    if (parent) {
                        (parent.children || (parent.children = [])).push(item)
                    } else {
                        result.push(item)
                    }
                })
                return result
            },


            getMenuData() {
                console.log("$e",this.$e);
                let that = this;
                // let adapter = that.$e.getActiveModule(this.moduleName, true).createAdapter(this);
                // adapter.mappingData(that.user_right_ado_name, "menuList");

                that.$e.init(that.groupName, that.moduleName, null, {
                    _act: this.action_init,
                }).then(function (res) {
                    that.envs = that.$e.envs;
                    console.log('---------------getMenuData-------', that.menuList)
                });
            },

            openPage(path) {
                if (path) {
                    this.$openPage({
                        name: path,
                        query: {}
                    });
                }
            }
        }
    }
</script>

<style>
    .list-wrap {
        border-width: 1px;
        border-color: #ddd;
        border-style: dashed;
        background-color: rgb(250, 250, 250);
        padding: 20px 10px;
        border-radius: 3px;
    }

    .slot-wrap {
        display: flex;
        align-items: center;
        flex: 1;
        flex-direction: column;
    }

    .map-wrap-text {
        font-size: 32rpx;
        font-weight: 700;
        padding-right: 6rpx;
    }
</style>
