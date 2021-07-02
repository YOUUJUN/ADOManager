<template>
    <view class="wrap">
        <view class="u-m-t-20 u-p-20 page-top-view">
            <view class="u-item-title">回收信息</view>
            <view v-if="car_m">
                <u-form :model="car_m" ref="uForm" :errorType="errorType" class="car-m-info">
                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="回收业务员" prop="empl_name">
                        <u-input :border="border" type="select" :select-open="empl_nameSheetShow"
                                 v-model="empl_nameLabel" placeholder="请选择回收业务员"
                                 @click="empl_nameSheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="回收渠道" prop="car_reclaim_way">
                        <u-input :border="border" type="select" :select-open="car_reclaim_waySheetShow"
                                 v-model="car_reclaim_wayLabel" placeholder="请选择回收渠道"
                                 @click="car_reclaim_waySheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="回收方式" prop="backtypename">
                        <u-input :border="border" type="select" :select-open="backtypenameSheetShow"
                                 v-model="backtypenameLabel" placeholder="请选择回收方式"
                                 @click="backtypenameSheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="拖车公司" prop="tc_cp_name">
                        <u-input :border="border" type="select" :select-open="tc_cp_nameSheetShow"
                                 v-model="tc_cp_nameLabel" placeholder="请选择拖车公司"
                                 @click="tc_cp_nameSheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="所属区域" prop="city_code">
                        <u-input :border="border" type="select" :select-open="city_codeSheetShow"
                                 v-model="city_codeLabel" placeholder="请选择所属区域"
                                 @click="city_codeSheetShow = true"></u-input>
                    </u-form-item>
                </u-form>
                <u-select mode="single-column" v-if="listData['empl_name']"
                          :default-value="[empl_nameSelectindex]"
                          :list="listData['empl_name']"
                          v-model="empl_nameSheetShow"
                          @confirm="selectEmplNameConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['car_reclaim_way']"
                          :default-value="[car_reclaim_waySelectindex]"
                          :list="listData['car_reclaim_way']"
                          v-model="car_reclaim_waySheetShow"
                          @confirm="selectCarReclaimWayConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['backtypename']"
                          :default-value="[backtypenameSelectindex]"
                          :list="listData['backtypename']"
                          v-model="backtypenameSheetShow"
                          @confirm="selectBacktypenameConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['tc_cp_name']"
                          :default-value="[tc_cp_nameSelectindex]"
                          :list="listData['tc_cp_name']"
                          v-model="tc_cp_nameSheetShow"
                          @confirm="selectTcCpNameConfirm"></u-select>
                <u-select mode="single-column" v-if="listData['city_code']"
                          :default-value="[city_codeSelectindex]"
                          :list="listData['city_code']"
                          v-model="city_codeSheetShow"
                          @confirm="selectCityCodeConfirm"></u-select>
            </view>
        </view>

        <view class="u-m-t-20 u-p-20 page-top-view">
            <view class="u-item-title">车辆信息</view>
            <view v-if="car_m">
                <u-form :model="car_m" ref="uForm" :errorType="errorType">

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="车辆销户" prop="cancel_flag">

                        <u-input :border="border" type="select" :select-open="cancel_flagSheetShow"
                                 v-model="cancel_flagLabel" placeholder="请选择车辆销户"
                                 @click="cancel_flagSheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="车辆类型" prop="car_kind">

                        <u-input :border="border" type="select" :select-open="car_kindSheetShow"
                                 v-model="car_kindLabel" placeholder="请选择车辆类型"
                                 @click="car_kindSheetShow = true"></u-input>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="牌照号码" prop="car_no">
                        <u-input :border="border" placeholder="请输入牌照号码" v-model="car_m.car_no"
                                 type="text"></u-input>

                        <u-keyboard ref="uKeyboard" mode="car" v-model="car_noSheetShow"
                                    @change="car_nochange" @backspace="car_nobackspace"></u-keyboard>

                        <u-button slot="right" type="success" size="medium"
                                  @click="car_noSheetShow=true"
                                  class="form-inner-btn">录入号码
                        </u-button>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="号牌种类" prop="car_no_type">
                        <u-input :border="border" type="select" :select-open="car_no_typeSheetShow"
                                 v-model="car_no_typeLabel" placeholder="请选择号牌种类"
                                 @click="car_no_typeSheetShow = true"></u-input>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="动力类别" prop="fuel_name">

                        <u-input :border="border" type="select" :select-open="fuel_nameSheetShow"
                                 v-model="fuel_nameLabel" placeholder="请选择动力类别"
                                 @click="fuel_nameSheetShow = true"></u-input>
                    </u-form-item>

                </u-form>

                <u-select mode="single-column" :list="cancel_flagSelectList"
                          :default-value="[cancel_flagSelectindex]"
                          v-model="cancel_flagSheetShow"
                          @confirm="selectCancelFlagConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['car_kind']"
                          :default-value="[car_kindSelectindex]"
                          :list="listData['car_kind']"
                          v-model="car_kindSheetShow"
                          @confirm="selectCarKindConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['car_no_type']"
                          :default-value="[car_no_typeSelectindex]"
                          :list="listData['car_no_type']"
                          v-model="car_no_typeSheetShow"
                          @confirm="selectCarNoTypeConfirm"></u-select>

                <u-select mode="single-column" v-if="listData['fuel_name']"
                          :default-value="[fuel_nameSelectindex]"
                          :list="listData['fuel_name']"
                          v-model="fuel_nameSheetShow"
                          @confirm="selectFuelNameConfirm"></u-select>

            </view>
        </view>

        <view class="u-m-t-20 u-p-20 page-top-view">
            <view class="u-item-title">价格信息</view>
            <view v-if="car_m">
                <u-form :model="car_m" ref="uForm" :errorType="errorType">
                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="是否溢价" prop="is_yj">
                        <u-input :border="border" type="select" :select-open="is_yjSheetShow"
                                 v-model="is_yjLabel" placeholder="请选择是否溢价"
                                 @click="is_yjSheetShow = true"></u-input>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="计价方式" prop="price_type">
                        <u-input :border="border" type="select" :select-open="price_typeSheetShow"
                                 v-model="price_typeLabel" placeholder="请选择计价方式"
                                 @click="price_typeSheetShow = true"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="称重(kg)" prop="heft">
                        <u-input :border="border" placeholder="请输入称重质量" v-model="car_m.heft"
                                 type="number"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="杂质(Kg)" prop="impurity">
                        <u-input :border="border" placeholder="请输入杂质重量" v-model="car_m.impurity"
                                 type="number"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="净重(Kg)" prop="suttle">
                        <u-input :border="border" placeholder="请输入车辆净重" v-model="car_m.suttle"
                                 type="number"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="残值单价(元/Kg)" prop="price">
                        <u-input :border="border" placeholder="请输入残值单价" v-model="car_m.price"
                                 type="number"></u-input>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="预估残值(元)" prop="estimate_amount">
                        <u-input :border="border" placeholder="请输入预估残值" v-model="car_m.estimate_amount"
                                 type="number"></u-input>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="钢圈材质" prop="is_lzgq">
                        <u-input :border="border" type="select" :select-open="is_lzgqSheetShow"
                                 v-model="is_lzgqLabel" placeholder="请选择钢圈材质"
                                 @click="is_lzgqSheetShow = true"></u-input>
                    </u-form-item>


                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="运输整理费" prop="traffic_fee">
                        <u-input :border="border" placeholder="请输入运输整理费" v-model="car_m.traffic_fee"
                                 type="text"></u-input>
                        <u-button slot="right" type="success" size="medium" @click=""
                                  class="form-inner-btn">关联账号
                        </u-button>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="预提经营费" prop="dealin_fee">
                        <u-input :border="border" placeholder="请输入预提经营费" v-model="car_m.dealin_fee"
                                 type="text"></u-input>
                        <u-button slot="right" type="success" size="medium" @click=""
                                  class="form-inner-btn">关联账号
                        </u-button>
                    </u-form-item>

                    <u-form-item label-width="180"
                                 :label-position="labelPosition" label="备注" prop="remark">
                        <u-input :border="border" placeholder="请输入备注" v-model="car_m.remark"
                                 type="textarea"></u-input>
                    </u-form-item>
                </u-form>

                <u-select mode="single-column" :list="is_yjSelectList"
                          :default-value="[is_yjSelectindex]"
                          v-model="is_yjSheetShow"
                          @confirm="selectIsYjConfirm"></u-select>

                <u-select mode="single-column" :list="price_typeSelectList"
                          :default-value="[price_typeSelectindex]"
                          v-model="price_typeSheetShow"
                          @confirm="selectPriceTypeConfirm"></u-select>

                <u-select mode="single-column" :list="is_lzgqSelectList"
                          :default-value="[is_lzgqSelectindex]"
                          v-model="is_lzgqSheetShow"
                          @confirm="selectIsLzgqConfirm"></u-select>


            </view>
        </view>
        <view class="u-m-t-20 u-p-20 ">
            <view class="u-item-title">车辆图片</view>
        </view>
        <view class="image-list">
            <u-upload
                    ref="swbUpload"
                    max-count="1"
                    name="image"
                    :action="action('car_45')"
                    :before-upload="swbbeforeUpload"
                    :file-list="swbImgList"
                    :show-progress="swbImgshowProgress"
            ></u-upload>
        </view>

        <view class="bottom-bar">
            <u-button type="primary" @click="submitBill">提交</u-button>
        </view>
    </view>
</template>

<script>


    export default {
        data() {
            return {

                border: false,
                labelPosition: 'left',
                errorType: ['message'],

                groupName: 'phone_car_input_inner_desk',
                moduleName: 'phone_car_input_inner_bill',


                city_codeSheetShow: false,
                city_codeSelectindex: 0,
                city_codeLabel: '',


                empl_nameSheetShow: false,
                empl_nameSelectindex: '',
                empl_nameLabel: '',

                car_reclaim_waySheetShow: false,
                car_reclaim_waySelectindex: '',
                car_reclaim_wayLabel: '',

                backtypenameSheetShow: false,
                backtypenameSelectindex: '',
                backtypenameLabel: '',

                tc_cp_nameSheetShow: false,
                tc_cp_nameSelectindex: '',
                tc_cp_nameLabel: '',


                cancel_flagSheetShow: false,
                cancel_flagSelectList: [{
                    label: '不需注销',
                    value: '0'
                }, {
                    label: '需要注销',
                    value: '1'
                }, {
                    label: '已注销',
                    value: '9'
                }],
                cancel_flagSelectindex: '',
                cancel_flagLabel: '',

                car_kindSheetShow: false,
                car_kindSelectindex: '',
                car_kindLabel: '',

                car_no_typeSheetShow: false,
                car_no_typeSelectindex: '',
                car_no_typeLabel: '',

                fuel_nameSheetShow: false,
                fuel_nameSelectindex: '',
                fuel_nameLabel: '',

                is_yjSheetShow: false,
                is_yjSelectList: [{
                    label: '否',
                    value: '0'
                }, {
                    label: '是',
                    value: '1'
                }
                ],
                is_yjSelectindex: '',
                is_yjLabel: '',

                price_typeSheetShow: false,
                price_typeSelectList: [{
                    label: '按辆',
                    value: '0'
                }, {
                    label: '按重量',
                    value: '1'
                }],
                price_typeSelectindex: '',
                price_typeLabel: '',

                is_lzgqSheetShow: false,
                is_lzgqSelectList: [{
                    label: '铁质',
                    value: '0'
                }, {
                    label: '铝质',
                    value: '1'
                }],
                is_lzgqSelectindex: '',
                is_lzgqLabel: '',

                car_noSheetShow: false,

                //环境变量
                envs: null,
                //下拉列表数据


                //单据对象
                car_m_array: [],
                car_m: null,
                car_m_ado_name: 'car_m',
                //图片信息
                car_d: [],
                car_d_ado_name: 'car_d',

                car_img: [],

                page_first_action: '',

                listData: {},


                img_read_action: 'image.Read',
                img_upload_action: 'image.Add',
                img_del_action: 'image.Del',

                swbImgList: [],
                swbImgshowProgress: false,

                action_bill_submit: 'Save',
                //viewData: {},

                checkid: '',

                adapter: {
                    phone_car_input_inner_desk: {
                        group: true
                    },
                    phone_car_input_inner_bill: {
                        ados: {
                            car_m: {rows: 'car_m_array', vars: 'listData', options: {view: 'bill_free'}},
                            car_d: {rows: 'car_d', vars: '', options: {}}
                        }
                    },
                }
            }
        },

        onLoad() {
            this.$e = new this.$Engine(this);

            var urlParams = this.$parseURL();
            if (urlParams.actionName) {
                this.page_first_action = urlParams['actionName'];
                this.checkid = urlParams['checkid'];
            }
            this.getListData();
        },

        methods: {
            action(tag) {
                // let url = util.getImagePath(this.img_upload_action, {
                //     params: {
                //         imgpos: tag
                //     }
                // });
                return null;
            },

            uploadImage(tag, filePath) {
                let that = this;
                let url = this.action(tag);
                // util.uploadFile(url, filePath).then(function (res) {
                //     that.showProgress = false;
                //     if (res.data) {
                //         const car_m_ado = res.data.find(item => item.name == that.car_m_ado_name);
                //         if (car_m_ado && car_m_ado['rows'] && car_m_ado['rows'].length > 0) {
                //             Object.assign(that.car_m, car_m_ado['rows'][0]);
                //         }
                //     }
                // });
            },

            //商务部45角图
            swbbeforeUpload(index, list) {
                this.uploadImage('car_45', list[index].url);
            },

            // 预览图片
            previewImage(index) {
                let photoList = this.imageList.map(item => {
                    return item.src;
                });
                uni.previewImage({
                    current: index,     // 当前显示图片的链接/索引值
                    urls: photoList,    // 需要预览的图片链接列表，photoList要求必须是数组
                    loop: true   // 是否可循环预览
                });
            },


            selectCityCodeConfirm(e) {
                e.map((val, index) => {
                    this.city_codeLabel = val.label;
                    this.car_m.city_code = val.value;
                    this.city_codeSelectindex = this.listData['city_code'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectCancelFlagConfirm(e) {
                e.map((val, index) => {
                    this.cancel_flagLabel = val.label;
                    this.car_m.cancel_flag = val.value;
                    this.cancel_flagSelectindex = this.cancel_flagSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectCarKindConfirm(e) {
                e.map((val, index) => {
                    this.car_kindLabel = val.label;
                    this.car_m.car_kind = val.value;
                    this.car_kindSelectindex = this.listData['car_kind'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectCarNoTypeConfirm(e) {
                e.map((val, index) => {
                    this.car_no_typeLabel = val.label;
                    this.car_m.car_no_type = val.value;
                    this.car_no_typeSelectindex = this.listData['car_no_type'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectFuelNameConfirm(e) {
                e.map((val, index) => {
                    this.fuel_nameLabel = val.label;
                    this.car_m.fuel_name = val.value;
                    this.fuel_nameSelectindex = this.listData['fuel_name'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectEmplNameConfirm(e) {
                console.log('-------selectEmplNameConfirm------');
                e.map((val, index) => {
                    this.empl_nameLabel = val.label;
                    this.car_m.empl_name = val.value;
                    this.empl_nameSelectindex = this.listData['empl_name'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectCarReclaimWayConfirm(e) {
                e.map((val, index) => {
                    this.car_reclaim_wayLabel = val.label;
                    this.car_m.car_reclaim_way = val.value;
                    this.car_reclaim_waySelectindex = this.listData['car_reclaim_way'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectBacktypenameConfirm(e) {
                e.map((val, index) => {
                    this.backtypenameLabel = val.label;
                    this.car_m.backtypename = val.value;
                    this.backtypenameSelectindex = this.listData['backtypename'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectTcCpNameConfirm(e) {
                e.map((val, index) => {
                    this.tc_cp_nameLabel = val.label;
                    this.car_m.tc_cp_name = val.value;
                    this.tc_cp_nameSelectindex = this.listData['tc_cp_name'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectIsYjConfirm(e) {
                e.map((val, index) => {
                    this.is_yjLabel = val.label;
                    this.car_m.is_yj = val.value;
                    this.is_yjSelectindex = this.is_yjSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectPriceTypeConfirm(e) {
                e.map((val, index) => {
                    this.price_typeLabel = val.label;
                    this.car_m.price_type = val.value;
                    this.price_typeSelectindex = this.price_typeSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectIsLzgqConfirm(e) {
                e.map((val, index) => {
                    this.is_lzgqLabel = val.label;
                    this.car_m.is_lzgq = val.value;
                    this.is_lzgqSelectindex = this.is_lzgqSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            // 点击退格键
            car_nobackspace() {
                if (this.car_m['car_no'].length) this.car_m['car_no'] = this.car_m['car_no'].substr(0, this.car_m['car_no'].length - 1);
            },

            // 键盘按键发生变化
            car_nochange(detail) {
                this.car_m['car_no'] += detail;
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

            initSelectVal() {
                let that = this;

                //cancel_flag
                that.cancel_flagSelectindex = that.cancel_flagSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['cancel_flag']);
                });
                if (that.cancel_flagSelectindex >= 0) {
                    that.cancel_flagLabel = that.cancel_flagSelectList[that.cancel_flagSelectindex].label;
                }

                //car_kind
                that.car_kindSelectindex = that.listData['car_kind'].findIndex(function (el) {
                    return (el.value === that.car_m['car_kind']);
                });
                if (that.car_kindSelectindex >= 0) {
                    that.car_kindLabel = that.listData['car_kind'][that.car_kindSelectindex].label;
                }

                //car_no_type
                that.car_no_typeSelectindex = that.listData['car_no_type'].findIndex(function (el) {
                    return (el.value === that.car_m['car_no_type']);
                });
                if (that.car_no_typeSelectindex >= 0) {
                    that.car_no_typeLabel = that.listData['car_no_type'][that.car_no_typeSelectindex].label;
                }

                //fuel_name
                that.fuel_nameSelectindex = that.listData['fuel_name'].findIndex(function (el) {
                    return (el.value === that.car_m['fuel_name']);
                });
                if (that.fuel_nameSelectindex >= 0) {
                    that.fuel_nameLabel = that.listData['fuel_name'][that.fuel_nameSelectindex].label;
                }

                //is_yj
                that.is_yjSelectindex = that.is_yjSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['is_yj']);
                });
                if (that.is_yjSelectindex >= 0) {
                    that.is_yjLabel = that.is_yjSelectList[that.is_yjSelectindex].label;
                }

                //price_type
                that.price_typeSelectindex = that.price_typeSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['price_type']);
                });
                if (that.price_typeSelectindex >= 0) {
                    that.price_typeLabel = that.price_typeSelectList[that.price_typeSelectindex].label;
                }

                //is_lzgq
                that.is_lzgqSelectindex = that.is_lzgqSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['is_lzgq']);
                });
                if (that.is_lzgqSelectindex >= 0) {
                    that.is_lzgqLabel = that.is_lzgqSelectList[that.is_lzgqSelectindex].label;
                }

                //empl_name
                that.empl_nameSelectindex = that.listData['empl_name'].findIndex(function (el) {
                    return (el.value === that.car_m['empl_name']);
                });
                if (that.empl_nameSelectindex >= 0) {
                    that.empl_nameLabel = that.listData['empl_name'][that.empl_nameSelectindex].label;
                }

                //car_reclaim_way
                that.car_reclaim_waySelectindex = that.listData['car_reclaim_way'].findIndex(function (el) {
                    return (el.value === that.car_m['car_reclaim_way']);
                });
                if (that.car_reclaim_waySelectindex >= 0) {
                    that.car_reclaim_wayLabel = that.listData['car_reclaim_way'][that.car_reclaim_waySelectindex].label;
                }

                //backtypename
                that.backtypenameSelectindex = that.listData['backtypename'].findIndex(function (el) {
                    return (el.value === that.car_m['backtypename']);
                });
                if (that.backtypenameSelectindex >= 0) {
                    that.backtypenameLabel = that.listData['backtypename'][that.backtypenameSelectindex].label;
                }

                //tc_cp_name
                that.tc_cp_nameSelectindex = that.listData['tc_cp_name'].findIndex(function (el) {
                    return (el.value === that.car_m['tc_cp_name']);
                });
                if (that.tc_cp_nameSelectindex >= 0) {
                    that.tc_cp_nameLabel = that.listData['tc_cp_name'][that.tc_cp_nameSelectindex].label;
                }

            },

            clearCarImg() {
                // this.czsfzList = [];
                // this.xszList = [];
                // this.jbrsfzList = [];
                // this.carImgList = [];
                this.swbImgList = [];
            },

            initCarImg() {
                if (this.car_d) {
                    for (let i = 0, len = this.car_d.length; i < len; i++) {
                        let item = this.car_d[i];
                        console.log('-----------------------------' + JSON.stringify(item))
                        if (item['img_pos'] && (item['img_pos'] == 'car_45')) {
                            this.swbImgList.push({
                                url: item.src,
                                rowid: item['__rowid'],
                                error: false
                            })
                        } else {
                            // this.carImgList.push({
                            //     url: item.src,
                            //     rowid: item['__rowid'],
                            //     error: false
                            // })
                        }
                    }
                }
            },

            submitBill() {
                let that = this;
                this.$e.call(this.moduleName, this.action_bill_submit, this.car_m_ado_name + ', ' + this.car_d_ado_name, {}, {}).then(function (res) {

                });

                // this.$e.init(that.groupName, that.moduleName, that.checkid, (that.action_bill_submit, util.callAction, {}, util.diff_data).then(function (res) {
                //     // that.getListData(res);
                //     uni.navigateBack();
                //     console.log('------------save--------------' + JSON.stringify(res));
                // });
                // util.build_diff_data(that.moduleName, that.car_m_ado_name, [that.car_m]);
                // //util.build_diff_data(that.moduleName, that.car_verify_item_ado_name, that.car_verify_item);
                // util.request(that.action_bill_submit, util.callAction, {}, util.diff_data).then(function (res) {
                //     // that.getListData(res);
                //     uni.navigateBack();
                //     console.log('------------save--------------' + JSON.stringify(res));
                // });
            },

            getListData: function () {
                let that = this;
                this.$e.init(that.groupName, that.moduleName, that.checkid, {
                    _act: this.page_first_action,
                }).then(function (res) {
                    that.car_m = that.car_m_array[0];
                    //that.listData =
                    //console.log('get in to refresh ======car_m=====>vue', that.car_m);
                    console.log('get in to refresh ======car_d=====>vue', that.listData);
                });

                // util.initModule(that.groupName, that.moduleName, {
                //     actionName: that.page_first_action
                // }).then(function (res) {
                //     if (res) {
                //         if (res['envs']) {
                //             that.envs = res['envs'];
                //             console.log('-------envs----' + JSON.stringify(that.envs));
                //         }
                //
                //         if (res['listData']) {
                //             that.listData = res['listData'];
                //             console.log('-------listData----' + JSON.stringify(that.listData));
                //         }
                //
                //         if (res.data) {
                //             const car_m_ado = res.data.find(item => item.name == that.car_m_ado_name);
                //             if (car_m_ado && car_m_ado['rows'] && car_m_ado['rows'].length > 0) {
                //                 that.car_m = car_m_ado['rows'][0];
                //                 that.initSelectVal();
                //             }
                //
                //             const car_d_ado = res.data.find(item => item.name == that.car_d_ado_name);
                //             if (car_d_ado && car_d_ado['rows'] && car_d_ado['rows'].length > 0) {
                //                 that.car_d = car_d_ado['rows'];
                //                 that.clearCarImg();
                //                 that.initCarImg();
                //             }
                //             console.log('------------car_d------' + JSON.stringify(that.car_d))
                //         }
                //     }
                // });
            }
        }
    }
</script>

<style lang="scss">
    .form-inner-btn {
        padding: 0 10px;
    }

    .u-card {
        margin: 0 !important;
        border-radius: 0 !important;
    }

    .wrap {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #ededed;
    }

    .u-m-t-20 {
        background: #ffffff;
    }

    .flex-btn-group {
        display: flex;
    }

    .bottom-bar {
        margin-top: 20rpx;
        padding: 20rpx;
        background-color: #ffffff;
    }

    .image-list {
        margin-top: 20rpx;
        padding: 20rpx;
        background-color: #ffffff;
    }
</style>
