<template>
    <view class="wrap">
        <view class="wrap">
            <view class="u-tabs-box">
                <u-tabs-swiper activeColor="#f29100" ref="uTabs" :list="list" :current="current" @change="tabsChange"
                               :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
            </view>
            <swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
                    @animationfinish="animationfinish">
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <view v-if="car_m">
                                <u-form :model="car_m" ref="uForm" :errorType="errorType">
                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="证件类型" prop="card_type">
                                        <u-input :border="border" type="select" :select-open="card_typeSheetShow"
                                                 v-model="card_typeLabel" placeholder="请选择证件类型"
                                                 @click="card_typeSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="上传证件图片" prop="photo"
                                                 label-width="180">
                                        <u-upload
                                                ref="czsfzUpload"
                                                max-count="1"
                                                name="image"
                                                :action="action('czsfz')"
                                                :before-upload="czsfzbeforeUpload"
                                                :file-list="czsfzList"
                                                :show-progress="czsfzshowProgress"
                                        ></u-upload>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="证件编号" prop="car_owner_code">
                                        <u-input :border="border" placeholder="请输入证件编号" v-model="car_m.car_owner_code"
                                                 type="text"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车主类别" prop="car_owner_type">

                                        <u-input :border="border" type="select" :select-open="car_owner_typeSheetShow"
                                                 v-model="car_owner_typeLabel" placeholder="请选择车主类别"
                                                 @click="car_owner_typeSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车主名称" prop="car_owner_name">
                                        <u-input :border="border" placeholder="请输入车主名称" v-model="car_m.car_owner_name"
                                                 type="textarea"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="联系电话" prop="car_owner_phone">
                                        <u-input :border="border" placeholder="请输入联系电话" v-model="car_m.car_owner_phone"
                                                 type="number"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="邮寄地址" prop="car_owner_addr">
                                        <u-input :border="border" placeholder="请输入邮寄地址" v-model="car_m.car_owner_addr"
                                                 type="textarea"></u-input>
                                    </u-form-item>

                                </u-form>
                                <u-select mode="single-column" :list="card_typeSelectList" v-model="card_typeSheetShow"
                                          :default-value="[card_typeSelectindex]"
                                          @confirm="selectCardTypeConfirm"></u-select>

                                <u-select mode="single-column" v-if="listData['car_owner_type']"
                                          :default-value="[car_owner_typeSelectindex]"
                                          :list="listData['car_owner_type']"
                                          v-model="car_owner_typeSheetShow"
                                          @confirm="selectCarOwnerTypeConfirm"></u-select>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <view v-if="car_m">
                                <u-form :model="car_m" ref="uForm" :errorType="errorType">
                                    <u-form-item :label-position="labelPosition" label="上传身份证" prop="photo"
                                                 label-width="180">
                                        <u-upload
                                                ref="jbrsfzUpload"
                                                max-count="1"
                                                name="image"
                                                :action="action('jbrsfz')"
                                                :before-upload="jbrsfzbeforeUpload"
                                                :file-list="jbrsfzList"
                                                :show-progress="jbrsfzshowProgress"
                                        ></u-upload>
                                    </u-form-item>
                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="证件编号" prop="operater_code">
                                        <u-input :border="border" placeholder="请输入证件编号" v-model="car_m.operater_code"
                                                 type="text"></u-input>
                                    </u-form-item>
                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="经办人名称" prop="operater_name">
                                        <u-input :border="border" placeholder="请输入经办人名称" v-model="car_m.operater_name"
                                                 type="text"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="联系电话" prop="operater_tel">
                                        <u-input :border="border" placeholder="请输入联系电话" v-model="car_m.operater_tel"
                                                 type="number"></u-input>
                                    </u-form-item>
                                </u-form>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <view v-if="car_m">
                                <u-form :model="car_m" ref="uForm" :errorType="errorType">
                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="报废类型" prop="car_infotype">

                                        <u-input :border="border" type="select" :select-open="car_infotypeSheetShow"
                                                 v-model="car_infotypeLabel" placeholder="请选择报废类型"
                                                 @click="car_infotypeSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车辆销户" prop="cancel_flag">

                                        <u-input :border="border" type="select" :select-open="cancel_flagSheetShow"
                                                 v-model="cancel_flagLabel" placeholder="请选择车辆销户"
                                                 @click="cancel_flagSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="需要报废证" prop="discard_flag">

                                        <u-input :border="border" type="select" :select-open="discard_flagSheetShow"
                                                 v-model="discard_flagLabel" placeholder="请选择需要报废证"
                                                 @click="discard_flagSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="上传行驶证" prop="photo"
                                                 label-width="180">
                                        <u-upload
                                                ref="xszUpload"
                                                max-count="1"
                                                name="image"
                                                :action="action('xsz')"
                                                :before-upload="xszbeforeUpload"
                                                :file-list="xszList"
                                                :show-progress="xszshowProgress"
                                        ></u-upload>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="VIN码" prop="frame_no">
                                        <u-input :border="border" placeholder="请输入VIN码" v-model="car_m.frame_no"
                                                 type="text"></u-input>
                                        <u-button slot="right" type="success" size="medium" @click=""
                                                  class="form-inner-btn">解析VIN
                                        </u-button>
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
                                                 :label-position="labelPosition" label="车辆品牌" prop="car_brand">
                                        <u-input :border="border" placeholder="请输入车辆品牌" v-model="car_m.car_brand"
                                                 type="text"></u-input>
                                        <u-button slot="right" type="success" size="medium" @click=""
                                                  class="form-inner-btn">设置品牌
                                        </u-button>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车辆系列" prop="car_serial_name">
                                        <u-input :border="border" placeholder="请输入车辆系列" v-model="car_m.car_serial_name"
                                                 type="text"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车身颜色" prop="color">

                                        <u-input :border="border" type="select" :select-open="colorSheetShow"
                                                 v-model="colorLabel" placeholder="请选择车身颜色"
                                                 @click="colorSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="动力类别" prop="fuel_name">

                                        <u-input :border="border" type="select" :select-open="fuel_nameSheetShow"
                                                 v-model="fuel_nameLabel" placeholder="请选择动力类别"
                                                 @click="fuel_nameSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="使用性质" prop="used_kind_id">

                                        <u-input :border="border" type="select" :select-open="used_kind_idSheetShow"
                                                 v-model="used_kind_idLabel" placeholder="请选择使用性质"
                                                 @click="used_kind_idSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="是否监销" prop="inspect_flag">
                                        <u-input :border="border" type="select" :select-open="inspect_flagSheetShow"
                                                 v-model="inspect_flagLabel" placeholder="请选择是否监销"
                                                 @click="inspect_flagSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="发动机号码" prop="engine_no">
                                        <u-input :border="border" placeholder="请输入发动机号码" v-model="car_m.engine_no"
                                                 type="text"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="发动机型号" prop="sw_enginemodel">
                                        <u-input :border="border" placeholder="请输入发动机型号" v-model="car_m.sw_enginemodel"
                                                 type="text"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="变速箱类型" prop="gearbox">
                                        <u-input :border="border" type="select" :select-open="gearboxSheetShow"
                                                 v-model="gearboxLabel" placeholder="请选择变速箱类型"
                                                 @click="gearboxSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="生产年度" prop="made_year">
                                        <u-input :border="border" placeholder="请输入生产年度" v-model="car_m.made_year"
                                                 type="text"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="车辆年款" prop="nk">
                                        <u-input :border="border" placeholder="请输入车辆年款" v-model="car_m.nk"
                                                 type="text"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="进气形式" prop="jqxs">
                                        <u-input :border="border" type="select" :select-open="jqxsSheetShow"
                                                 v-model="jqxsLabel" placeholder="请选择进气形式"
                                                 @click="jqxsSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="排放标准" prop="pfbz">
                                        <u-input :border="border" type="select" :select-open="pfbzSheetShow"
                                                 v-model="pfbzLabel" placeholder="请选择排放标准"
                                                 @click="pfbzSheetShow = true"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="乘坐人数" prop="passenger_count">
                                        <u-input :border="border" placeholder="请输入乘坐人数" v-model="car_m.passenger_count"
                                                 type="number"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="排量" prop="displacement">
                                        <u-input :border="border" placeholder="请输入排量" v-model="car_m.displacement"
                                                 type="number"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="功率" prop="sw_power">
                                        <u-input :border="border" placeholder="请输入功率" v-model="car_m.sw_power"
                                                 type="number"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="整备质量" prop="total_weight">
                                        <u-input :border="border" placeholder="请输入整备质量" v-model="car_m.total_weight"
                                                 type="number"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="总公里数" prop="sw_mileage">
                                        <u-input :border="border" placeholder="请输入总公里数" v-model="car_m.sw_mileage"
                                                 type="number"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="注册登记日期" prop="regist_date">
                                        <u-input :border="border" placeholder="请选择日期" v-model="car_m.regist_date"
                                                 type="text"></u-input>
                                        <u-picker
                                                mode="time"
                                                v-model="regist_datePickerShow"
                                                :params="regist_dateParams"
                                                end-year="2025"
                                                @confirm="pickerRegistDateConfirm"
                                        ></u-picker>
                                        <u-button slot="right" type="success" size="medium"
                                                  @click="regist_datePickerShow = true"
                                                  class="form-inner-btn">选择
                                        </u-button>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="报废原因" prop="cause">
                                        <u-input :border="border" type="select" :select-open="causeSheetShow"
                                                 v-model="causeLabel" placeholder="请选择报废原因"
                                                 @click="causeSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="所属区域" prop="city_code">
                                        <u-input :border="border" type="select" :select-open="city_codeSheetShow"
                                                 v-model="city_codeLabel" placeholder="请选择所属区域"
                                                 @click="city_codeSheetShow = true"></u-input>
                                    </u-form-item>

                                </u-form>


                                <u-select mode="single-column" v-if="listData['car_infotype']"
                                          :default-value="[car_infotypeSelectindex]"
                                          :list="listData['car_infotype']"
                                          v-model="car_infotypeSheetShow"
                                          @confirm="selectCarInfotypeConfirm"></u-select>


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


                                <u-select mode="single-column" v-if="listData['color']"
                                          :default-value="[colorSelectindex]"
                                          :list="listData['color']"
                                          v-model="colorSheetShow"
                                          @confirm="selectColorConfirm"></u-select>


                                <u-select mode="single-column" v-if="listData['fuel_name']"
                                          :default-value="[fuel_nameSelectindex]"
                                          :list="listData['fuel_name']"
                                          v-model="fuel_nameSheetShow"
                                          @confirm="selectFuelNameConfirm"></u-select>


                                <u-select mode="single-column" v-if="listData['used_kind_id']"
                                          :default-value="[used_kind_idSelectindex]"
                                          :list="listData['used_kind_id']"
                                          v-model="used_kind_idSheetShow"
                                          @confirm="selectUsedKindIdConfirm"></u-select>

                                <u-select mode="single-column" :list="inspect_flagSelectList"
                                          :default-value="[inspect_flagSelectindex]"
                                          v-model="inspect_flagSheetShow"
                                          @confirm="selectInspectFlagConfirm"></u-select>


                                <u-select mode="single-column" v-if="listData['gearbox']"
                                          :default-value="[gearboxSelectindex]"
                                          :list="listData['gearbox']"
                                          v-model="gearboxSheetShow"
                                          @confirm="selectGearboxConfirm"></u-select>


                                <u-select mode="single-column" :list="jqxsSelectList"
                                          :default-value="[jqxsSelectindex]"
                                          v-model="jqxsSheetShow"
                                          @confirm="selectJqxsConfirm"></u-select>

                                <u-select mode="single-column" :list="pfbzSelectList"
                                          :default-value="[pfbzSelectindex]"
                                          v-model="pfbzSheetShow"
                                          @confirm="selectPfbzConfirm"></u-select>


                                <u-select mode="single-column" v-if="listData['cause']"
                                          :default-value="[causeSelectindex]"
                                          :list="listData['cause']"
                                          v-model="causeSheetShow"
                                          @confirm="selectCauseConfirm"></u-select>

                                <u-select mode="single-column" v-if="listData['city_code']"
                                          :default-value="[city_codeSelectindex]"
                                          :list="listData['city_code']"
                                          v-model="city_codeSheetShow"
                                          @confirm="selectCityCodeConfirm"></u-select>

                                <u-select mode="single-column" :list="cancel_flagSelectList"
                                          :default-value="[cancel_flagSelectindex]"
                                          v-model="cancel_flagSheetShow"
                                          @confirm="selectCancelFlagConfirm"></u-select>

                                <u-select mode="single-column" :list="discard_flagSelectList"
                                          :default-value="[discard_flagSelectindex]"
                                          v-model="discard_flagSheetShow"
                                          @confirm="selectDiscardFlagConfirm"></u-select>

                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <view v-if="car_m">
                                <u-form :model="car_m" ref="uForm" :errorType="errorType">
                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="牌照数" prop="car_no_num">
                                        <u-input :border="border" type="select" :select-open="car_no_numSheetShow"
                                                 v-model="car_no_numLabel" placeholder="请选择牌照数"
                                                 @click="car_no_numSheetShow = true"></u-input>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="全部牌照" prop="fj_pzs"
                                                 label-width="180">
                                        <u-switch v-model="fj_pzs_boolean" slot="right"
                                                  @change="fj_pzs_change"></u-switch>
                                    </u-form-item>


                                    <u-form-item :label-position="labelPosition" label="车主证件" prop="fj_czzj"
                                                 label-width="180">
                                        <u-switch v-model="fj_czzj_boolean" @change="fj_czzj_change" active-value="1"
                                                  inactive-value="0"
                                                  slot="right"></u-switch>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="机动车登记证" prop="fj_djz"
                                                 label-width="180">
                                        <u-switch v-model="fj_djz_boolean" @change="fj_djz_change" active-value="1"
                                                  inactive-value="0"
                                                  slot="right"></u-switch>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="机动车行驶证" prop="fj_xsz"
                                                 label-width="180">
                                        <u-switch v-model="fj_xsz_boolean" @change="fj_xsz_change" active-value="1"
                                                  inactive-value="0"
                                                  slot="right"></u-switch>
                                    </u-form-item>

                                    <u-form-item :label-position="labelPosition" label="委托书" prop="fj_wts"
                                                 label-width="180">
                                        <u-switch v-model="fj_wts_boolean" @change="fj_wts_change" active-value="1"
                                                  inactive-value="0"
                                                  slot="right"></u-switch>
                                    </u-form-item>
                                </u-form>

                                <u-select mode="single-column" :list="car_no_numSelectList"
                                          :default-value="[car_no_numSelectindex]"
                                          v-model="car_no_numSheetShow"
                                          @confirm="selectCarNoNumConfirm"></u-select>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
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
                                                 :label-position="labelPosition" label="缺件扣款(元)" prop="lost_amount">
                                        <u-input :border="border" placeholder="请输入缺件扣款" v-model="car_m.lost_amount"
                                                 type="number"></u-input>
                                    </u-form-item>


                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="应付残值" prop="car_amount">
                                        <u-input :border="border" placeholder="请输入应付残值" v-model="car_m.car_amount"
                                                 type="text"></u-input>
                                        <u-button slot="right" type="success" size="medium" @click=""
                                                  class="form-inner-btn">关联账号
                                        </u-button>
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
                                                 :label-position="labelPosition" label="合计金额(元)" prop="sum_amount">
                                        <u-input :border="border" placeholder="请输入合计金额" v-model="car_m.sum_amount"
                                                 type="number"></u-input>
                                    </u-form-item>

                                    <u-form-item label-width="180"
                                                 :label-position="labelPosition" label="总单价(元/Kg)" prop="sum_price">
                                        <u-input :border="border" placeholder="请输入总单价" v-model="car_m.sum_price"
                                                 type="number"></u-input>
                                    </u-form-item>

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

                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <view v-if="car_verify_item && car_verify_item.length>0">
                                <u-table class="verify-table">
                                    <u-tr class="u-tr">
                                        <u-th class="u-th">物料名称</u-th>
                                        <u-th class="u-th">标准数量</u-th>
                                        <u-th class="u-th">验收数量</u-th>
                                        <u-th class="u-th">应扣金额</u-th>
                                        <u-th class="u-th">实扣金额</u-th>
                                    </u-tr>

                                    <u-tr class="u-tr" v-for="(item, index) in car_verify_item">
                                        <u-td class="u-td">{{item.m_name}}</u-td>
                                        <u-td class="u-td">{{item.std_qty?item.std_qty:'&nbsp;'}}</u-td>
                                        <u-td class="u-td">
                                            <u-input :border="border" type="number" v-model="item.qty"></u-input>
                                        </u-td>
                                        <u-td class="u-td">
                                            <u-input :border="border" type="number" v-model="item.std_amount"></u-input>
                                            <!--                                            {{item.std_amount ? item.std_amount : '&nbsp;'
                                            }}-->
                                        </u-td>
                                        <u-td class="u-td">
                                            <u-input :border="border" type="number"
                                                     v-model="item.loss_amount"></u-input>
                                        </u-td>
                                    </u-tr>
                                </u-table>
                            </view>
                            <view v-else>
                                <u-empty text="暂无数据" mode="data"></u-empty>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
                            <u-upload
                                    ref="uUpload"
                                    max-count="6"
                                    name="image"
                                    :action="action('car_img')"
                                    :before-upload="carImgbeforeUpload"
                                    :before-remove="carImgbeforeRemove"
                                    :file-list="carImgList"
                                    :show-progress="carImgshowProgress"
                            ></u-upload>
                            <!--                            <u-button @click="submit">提交</u-button>-->
                        </view>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="swiper-item">
                    <scroll-view scroll-y style="height: 100%;width: 100%;">
                        <view class="page-box">
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
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
        <view class="bottom-bar">
            <view class="flex-btn-group">
                <u-button type="primary" size="medium" @click="saveBill">暂存</u-button>
                <u-button type="success" size="medium" @click="submitBill">提交</u-button>
            </view>
        </view>
    </view>
</template>

<script>
    // const util = require("@/common/utils.js");

    export default {
        data() {
            return {

                border: false,
                labelPosition: 'left',
                errorType: ['message'],

                card_typeSelectList: [{
                    label: '居民身份证',
                    value: 'czsfz'
                }, {
                    label: '营业执照',
                    value: 'yyzz'
                }],
                card_typeSheetShow: false,
                card_typeSelectindex: 0,
                card_typeLabel: '',

                car_owner_typeSheetShow: false,
                car_owner_typeSelectindex: 0,
                car_owner_typeLabel: '',

                car_infotypeSheetShow: false,
                car_infotypeSelectindex: 0,
                car_infotypeLabel: '',

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
                cancel_flagSelectindex: 0,
                cancel_flagLabel: '',

                discard_flagSheetShow: false,
                discard_flagSelectList: [{
                    label: '否',
                    value: '0'
                }, {
                    label: '是',
                    value: '1'
                }
                ],
                discard_flagSelectindex: 0,
                discard_flagLabel: '',

                car_kindSheetShow: false,
                car_kindSelectindex: 0,
                car_kindLabel: '',

                car_no_typeSheetShow: false,
                car_no_typeSelectindex: 0,
                car_no_typeLabel: '',

                colorSheetShow: false,
                colorSelectindex: 0,
                colorLabel: '',

                fuel_nameSheetShow: false,
                fuel_nameSelectindex: 0,
                fuel_nameLabel: '',

                used_kind_idSheetShow: false,
                used_kind_idSelectindex: 0,
                used_kind_idLabel: '',


                inspect_flagSheetShow: false,
                inspect_flagSelectList: [{
                    label: '不需监销',
                    value: '0'
                }, {
                    label: '需要监销',
                    value: '1'
                }],
                inspect_flagSelectindex: 0,
                inspect_flagLabel: '',

                gearboxSheetShow: false,
                gearboxSelectindex: 0,
                gearboxLabel: '',


                jqxsSheetShow: false,
                jqxsSelectList: [{
                    label: '自然吸气',
                    value: '自然吸气'
                }, {
                    label: '涡轮增压',
                    value: '涡轮增压'
                }],
                jqxsSelectindex: 0,
                jqxsLabel: '',

                pfbzSheetShow: false,
                pfbzSelectList: [{
                    label: '国1',
                    value: '国1'
                }, {
                    label: '国2',
                    value: '国2'
                }, {
                    label: '国3',
                    value: '国3'
                }, {
                    label: '国4',
                    value: '国4'
                }, {
                    label: '国5',
                    value: '国5'
                }, {
                    label: '国6',
                    value: '国6'
                }
                ],
                pfbzSelectindex: 0,
                pfbzLabel: '',

                causeSheetShow: false,
                causeSelectindex: 0,
                causeLabel: '',

                city_codeSheetShow: false,
                city_codeSelectindex: 0,
                city_codeLabel: '',

                regist_dateParams: {
                    year: true,
                    month: true,
                    day: true
                },
                regist_datePickerShow: false,

                car_no_numSheetShow: false,
                car_no_numSelectList: [{
                    label: '0',
                    value: '0'
                }, {
                    label: '1',
                    value: '1'
                }, {
                    label: '2',
                    value: '2'
                }],
                car_no_numSelectindex: 0,
                car_no_numLabel: '',

                fj_pzs_boolean: false,
                fj_czzj_boolean: false,
                fj_djz_boolean: false,
                fj_xsz_boolean: false,
                fj_wts_boolean: false,

                is_yjSheetShow: false,
                is_yjSelectList: [{
                    label: '否',
                    value: '0'
                }, {
                    label: '是',
                    value: '1'
                }
                ],
                is_yjSelectindex: 0,
                is_yjLabel: '',

                price_typeSheetShow: false,
                price_typeSelectList: [{
                    label: '按辆',
                    value: '0'
                }, {
                    label: '按重量',
                    value: '1'
                }],
                price_typeSelectindex: 0,
                price_typeLabel: '',

                is_lzgqSheetShow: false,
                is_lzgqSelectList: [{
                    label: '铁质',
                    value: '0'
                }, {
                    label: '铝质',
                    value: '1'
                }],
                is_lzgqSelectindex: 0,
                is_lzgqLabel: '',

                empl_nameSheetShow: false,
                empl_nameSelectindex: 0,
                empl_nameLabel: '',

                car_reclaim_waySheetShow: false,
                car_reclaim_waySelectindex: 0,
                car_reclaim_wayLabel: '',

                backtypenameSheetShow: false,
                backtypenameSelectindex: 0,
                backtypenameLabel: '',

                tc_cp_nameSheetShow: false,
                tc_cp_nameSelectindex: 0,
                tc_cp_nameLabel: '',

                car_noSheetShow: false,

                groupName: 'phone_car_input_inner_desk',
                moduleName: 'phone_car_input_inner_bill',

                list: [
                    {
                        name: '车主信息'
                    },
                    {
                        name: '经办人信息'
                    },
                    {
                        name: '车辆信息'
                    },
                    {
                        name: '车辆附件信息'
                    },
                    {
                        name: '结算信息'
                    },
                    {
                        name: '缺件信息'
                    }, {
                        name: '图片信息'
                    },
                    {
                        name: '上传商务部图片'
                    }
                ],
                current: 0,
                swiperCurrent: 0,

                //环境变量
                envs: null,
                //下拉列表数据
                listData: null,
                //单据对象
                car_m: null,
                car_m_ado_name: 'car_m',
                //图片信息
                car_d: null,
                car_d_ado_name: 'car_d',
                //缺件信息
                car_verify_item: null,
                car_verify_item_ado_name: 'car_verify_item',

                page_first_action: '',

                img_read_action: 'image.Read',
                img_upload_action: 'image.Add',
                img_del_action: 'image.Del',

                czsfzList: [],
                czsfzshowProgress: false,

                xszList: [],
                xszshowProgress: false,

                jbrsfzList: [],
                jbrsfzshowProgress: false,


                carImgList: [],
                carImgshowProgress: false,

                swbImgList: [],
                swbImgshowProgress: false,

                action_bill_save: 'Save',
                action_bill_submit: 'CheckSave',
            }
        },

        onLoad() {
            // 解析路由参数
            var urlParams = this.$parseURL();
            if (urlParams.actionName) {
                this.page_first_action = urlParams['actionName'];
            }
            this.getListData();
        },

        methods: {
            // 点击退格键
            car_nobackspace() {
                if (this.car_m['car_no'].length) this.car_m['car_no'] = this.car_m['car_no'].substr(0, this.car_m['car_no'].length - 1);
            },

            // 键盘按键发生变化
            car_nochange(detail) {
                this.car_m['car_no'] += detail;
            },

            fj_pzs_change(value) {
                console.log('value---' + value);
                this.car_m['fj_pzs'] = value;
                if (value == '1') {
                    this.car_no_numLabel = '2';
                    this.car_m.car_no_num = '2';
                } else {
                    this.car_no_numLabel = '0';
                    this.car_m.car_no_num = '0';
                }
            },

            fj_czzj_change(value) {
                this.car_m['fj_czzj'] = value;
            },

            fj_djz_change(value) {
                this.car_m['fj_djz'] = value;
            },

            fj_xsz_change(value) {
                this.car_m['fj_xsz'] = value;
            },

            fj_wts_change(value) {
                this.car_m['fj_wts'] = value;
            },

            action(tag) {
                let url = util.getImagePath(this.img_upload_action, {
                    params: {
                        imgpos: tag
                    }
                });
                return url;
            },

            uploadImage(tag, filePath) {
                let that = this;
                let url = this.action(tag);
                util.uploadFile(url, filePath).then(function (res) {
                    that.showProgress = false;
                    if (res.data) {
                        const car_m_ado = res.data.find(item => item.name == that.car_m_ado_name);
                        if (car_m_ado && car_m_ado['rows'] && car_m_ado['rows'].length > 0) {
                            Object.assign(that.car_m, car_m_ado['rows'][0]);
                        }
                    }
                });
            },

            //车主身份证、车主营业执照
            czsfzbeforeUpload(index, list) {
                this.uploadImage('czsfz', list[index].url);
            },

            //经办人身份证
            jbrsfzbeforeUpload(index, list) {
                this.uploadImage('jbrsfz', list[index].url);
            },

            //车辆行驶证
            xszbeforeUpload(index, list) {
                this.uploadImage('xsz', list[index].url);
            },

            //车辆图片
            carImgbeforeUpload(index, list) {
                this.uploadImage('car_img', list[index].url);
            },

            //车辆图片删除
            carImgbeforeRemove(index, list) {
                let url = list[index].url;
                const item = this.carImgList.find(item => item.url == url);
                util.request(this.img_del_action, util.callAction, {
                    params: {
                        rowid: item['rowid'],
                    }
                }).then(function (res) {
                    console.log('------------delete img--------------' + JSON.stringify(res));
                });
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

            //提交
            saveBill() {
                let that = this;
                util.build_diff_data(that.moduleName, that.car_m_ado_name, [that.car_m]);
                //util.build_diff_data(that.moduleName, that.car_verify_item_ado_name, that.car_verify_item);
                util.request(that.action_bill_save, util.callAction, {}, util.diff_data).then(function (res) {
                    that.getListData(res);
                    console.log('------------save--------------' + JSON.stringify(res));
                });
            },

            submitBill() {
                let that = this;
                util.build_diff_data(that.moduleName, that.car_m_ado_name, [that.car_m]);
                //util.build_diff_data(that.moduleName, that.car_verify_item_ado_name, that.car_verify_item);
                util.request(that.action_bill_submit, util.callAction, {}, util.diff_data).then(function (res) {
                    that.getListData(res);
                    console.log('------------save--------------' + JSON.stringify(res));
                });
            },

            selectCardTypeConfirm(e) {
                e.map((val, index) => {
                    this.card_typeLabel = val.label;
                    //this.car_m.card_type = val.value;
                    this.card_typeSelectindex = this.card_typeSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectCarOwnerTypeConfirm(e) {
                e.map((val, index) => {
                    this.car_owner_typeLabel = val.label;
                    this.car_m.car_owner_type = val.value;
                    this.car_owner_typeSelectindex = this.listData['car_owner_type'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectCarInfotypeConfirm(e) {
                e.map((val, index) => {
                    this.car_infotypeLabel = val.label;
                    this.car_m.car_infotype = val.value;
                    this.car_infotypeSelectindex = this.listData['car_infotype'].findIndex(function (el) {
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

            selectDiscardFlagConfirm(e) {
                e.map((val, index) => {
                    this.discard_flagLabel = val.label;
                    this.car_m.discard_flag = val.value;
                    this.discard_flagSelectindex = this.discard_flagSelectList.findIndex(function (el) {
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

            selectColorConfirm(e) {
                e.map((val, index) => {
                    this.colorLabel = val.label;
                    this.car_m.color = val.value;
                    this.colorSelectindex = this.listData['color'].findIndex(function (el) {
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

            selectUsedKindIdConfirm(e) {
                e.map((val, index) => {
                    this.used_kind_idLabel = val.label;
                    this.car_m.used_kind_id = val.value;
                    this.used_kind_idSelectindex = this.listData['used_kind_id'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectInspectFlagConfirm(e) {
                e.map((val, index) => {
                    this.inspect_flagLabel = val.label;
                    this.car_m.inspect_flag = val.value;
                    this.inspect_flagSelectindex = this.inspect_flagSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectGearboxConfirm(e) {
                e.map((val, index) => {
                    this.gearboxLabel = val.label;
                    this.car_m.gearbox = val.value;
                    this.gearboxSelectindex = this.listData['gearbox'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectJqxsConfirm(e) {
                e.map((val, index) => {
                    this.jqxsLabel = val.label;
                    this.car_m.jqxs = val.value;
                    this.jqxsSelectindex = this.jqxsSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },

            selectPfbzConfirm(e) {
                e.map((val, index) => {
                    this.pfbzLabel = val.label;
                    this.car_m.pfbz = val.value;
                    this.pfbzSelectindex = this.pfbzSelectList.findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
            },


            selectCauseConfirm(e) {
                e.map((val, index) => {
                    this.causeLabel = val.label;
                    this.car_m.cause = val.value;
                    this.causeSelectindex = this.listData['cause'].findIndex(function (el) {
                        return (el.value === val.value && el.label === val.label);
                    });
                })
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

            pickerRegistDateConfirm(e) {
                this.car_m.regist_date = e.year + '-' + e.month + '-' + e.day;
            },

            selectCarNoNumConfirm(e) {
                e.map((val, index) => {
                    this.car_no_numLabel = val.label;
                    this.car_m.car_no_num = val.value;
                    if (val.value == 2) {
                        this.fj_pzs_boolean = true;
                    } else {
                        this.fj_pzs_boolean = false;
                    }
                    this.car_no_numSelectindex = this.car_no_numSelectList.findIndex(function (el) {
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

            selectEmplNameConfirm(e) {
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

            initSelectVal() {
                let that = this;
                //card_type
                that.card_typeLabel = that.card_typeSelectList[that.card_typeSelectindex].label;

                //car_owner_type
                that.car_owner_typeSelectindex = that.listData['car_owner_type'].findIndex(function (el) {
                    return (el.value === that.car_m['car_owner_type']);
                });
                if (that.car_owner_typeSelectindex >= 0) {
                    that.car_owner_typeLabel = that.listData['car_owner_type'][that.car_owner_typeSelectindex].label;
                }


                //car_infotype
                that.car_infotypeSelectindex = that.listData['car_infotype'].findIndex(function (el) {
                    return (el.value === that.car_m['car_infotype']);
                });
                if (that.car_infotypeSelectindex >= 0) {
                    that.car_infotypeLabel = that.listData['car_infotype'][that.car_infotypeSelectindex].label;
                }


                //cancel_flag
                that.cancel_flagSelectindex = that.cancel_flagSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['cancel_flag']);
                });
                if (that.cancel_flagSelectindex >= 0) {
                    that.cancel_flagLabel = that.cancel_flagSelectList[that.cancel_flagSelectindex].label;
                }


                //discard_flag
                that.discard_flagSelectindex = that.discard_flagSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['discard_flag']);
                });
                if (that.discard_flagSelectindex >= 0) {
                    that.discard_flagLabel = that.discard_flagSelectList[that.discard_flagSelectindex].label;
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


                //color
                that.colorSelectindex = that.listData['color'].findIndex(function (el) {
                    return (el.value === that.car_m['color']);
                });
                if (that.colorSelectindex >= 0) {
                    that.colorLabel = that.listData['color'][that.colorSelectindex].label;
                }


                //fuel_name
                that.fuel_nameSelectindex = that.listData['fuel_name'].findIndex(function (el) {
                    return (el.value === that.car_m['fuel_name']);
                });
                if (that.fuel_nameSelectindex >= 0) {
                    that.fuel_nameLabel = that.listData['fuel_name'][that.fuel_nameSelectindex].label;
                }


                //used_kind_id
                that.used_kind_idSelectindex = that.listData['used_kind_id'].findIndex(function (el) {
                    return (el.value === that.car_m['used_kind_id']);
                });
                if (that.used_kind_idSelectindex >= 0) {
                    that.used_kind_idLabel = that.listData['used_kind_id'][that.used_kind_idSelectindex].label;
                }


                //inspect_flag
                that.inspect_flagSelectindex = that.inspect_flagSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['inspect_flag']);
                });
                if (that.inspect_flagSelectindex >= 0) {
                    that.inspect_flagLabel = that.inspect_flagSelectList[that.inspect_flagSelectindex].label;
                }


                //gearbox
                that.gearboxSelectindex = that.listData['gearbox'].findIndex(function (el) {
                    return (el.value === that.car_m['gearbox']);
                });
                if (that.gearboxSelectindex >= 0) {
                    that.gearboxLabel = that.listData['gearbox'][that.gearboxSelectindex].label;
                }


                //jqxs
                that.jqxsSelectindex = that.jqxsSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['jqxs']);
                });
                if (that.jqxsSelectindex >= 0) {
                    that.jqxsLabel = that.jqxsSelectList[that.jqxsSelectindex].label;
                }


                //pfbz
                that.pfbzSelectindex = that.pfbzSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['pfbz']);
                });
                if (that.pfbzSelectindex >= 0) {
                    that.pfbzLabel = that.pfbzSelectList[that.pfbzSelectindex].label;
                }



                //cause
                that.causeSelectindex = that.listData['cause'].findIndex(function (el) {
                    return (el.value === that.car_m['cause']);
                });
                if (that.causeSelectindex >= 0) {
                    that.causeLabel = that.listData['cause'][that.causeSelectindex].label;
                }



                //city_code
                that.city_codeSelectindex = that.listData['city_code'].findIndex(function (el) {
                    return (el.value === that.car_m['city_code']);
                });
                if (that.city_codeSelectindex >= 0) {
                    that.city_codeLabel = that.listData['city_code'][that.city_codeSelectindex].label;
                }



                //car_no_num
                that.car_no_numSelectindex = that.car_no_numSelectList.findIndex(function (el) {
                    return (el.value === that.car_m['car_no_num']);
                });
                if (that.car_no_numSelectindex >= 0) {
                    that.car_no_numLabel = that.car_no_numSelectList[that.car_no_numSelectindex].label;
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

            initSwitchVal() {
                let that = this;
                that['fj_pzs_boolean'] = that.car_m['fj_pzs'] && that.car_m['fj_pzs'] == '1' ? true : false;
                that['fj_czzj_boolean'] = that.car_m['fj_czzj'] && that.car_m['fj_czzj'] == '1' ? true : false;
                that['fj_djz_boolean'] = that.car_m['fj_djz'] && that.car_m['fj_djz'] == '1' ? true : false;
                that['fj_xsz_boolean'] = that.car_m['fj_xsz'] && that.car_m['fj_xsz'] == '1' ? true : false;
                that['fj_wts_boolean'] = that.car_m['fj_wts'] && that.car_m['fj_wts'] == '1' ? true : false;
            },

            clearCarImg() {
                this.czsfzList = [];
                this.xszList = [];
                this.jbrsfzList = [];
                this.carImgList = [];
                this.swbImgList = [];
            },

            initCarImg() {
                if (this.car_d) {
                    for (let i = 0, len = this.car_d.length; i < len; i++) {
                        let item = this.car_d[i];
                        console.log('-----------------------------' + JSON.stringify(item))
                        item.src = util.getImagePath(this.img_read_action, {
                            params: {
                                img_no: item['img_no']
                            }
                        });

                        if (item['img_pos'] && (item['img_pos'] == 'yyzz' || item['img_pos'] == 'czsfz')) {
                            this.czsfzList.push({
                                url: item.src,
                                rowid: item['__rowid'],
                                error: false
                            })
                        } else if (item['img_pos'] && (item['img_pos'] == 'xsz')) {
                            this.xszList.push({
                                url: item.src,
                                rowid: item['__rowid'],
                                error: false
                            })

                        } else if (item['img_pos'] && (item['img_pos'] == 'jbrsfz')) {
                            this.jbrsfzList.push({
                                url: item.src,
                                rowid: item['__rowid'],
                                error: false
                            })

                        } else if (item['img_pos'] && (item['img_pos'].indexOf('car_img') > -1)) {
                            this.carImgList.push({
                                url: item.src,
                                rowid: item['__rowid'],
                                error: false
                            })
                        } else if (item['img_pos'] && (item['img_pos'] == 'car_45')) {
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

            getListData() {
                let that = this;
                util.initModule(that.groupName, that.moduleName, {
                    actionName: that.page_first_action
                }).then(function (res) {
                    if (res) {
                        if (res['envs']) {
                            that.envs = res['envs'];
                            console.log('-------envs----' + JSON.stringify(that.envs));
                        }

                        if (res['listData']) {
                            that.listData = res['listData'];
                            console.log('-------listData----' + JSON.stringify(that.listData));
                        }

                        if (res.data) {
                            const car_m_ado = res.data.find(item => item.name == that.car_m_ado_name);
                            if (car_m_ado && car_m_ado['rows'] && car_m_ado['rows'].length > 0) {
                                that.car_m = car_m_ado['rows'][0];
                                that.initSelectVal();
                                that.initSwitchVal();
                            }

                            const car_verify_item_ado = res.data.find(item => item.name == that.car_verify_item_ado_name);
                            if (car_verify_item_ado && car_verify_item_ado['rows'] && car_verify_item_ado['rows'].length > 0) {
                                that.car_verify_item = car_verify_item_ado['rows'];
                            }

                            const car_d_ado = res.data.find(item => item.name == that.car_d_ado_name);
                            if (car_d_ado && car_d_ado['rows'] && car_d_ado['rows'].length > 0) {
                                that.car_d = car_d_ado['rows'];
                                that.clearCarImg();
                                that.initCarImg();
                            }
                        }
                    }
                });
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
    }

    .swiper-box {
        flex: 1;
    }

    .swiper-item {
        height: 100%;
    }

    .form-inner-btn {
        padding: 0 10px;
    }

    .verify-table .u-td {
        height: auto;
    }

    .page-box {
        padding: 20rpx;
    }

    .pre-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .pre-item {
        flex: 0 0 32.5%;
        border-radius: 10rpx;
        height: 230rpx;
        overflow: hidden;
        position: relative;
        margin-bottom: 20rpx;
    }

    .pre-item-image {
        width: 100%;
        height: 230rpx;
    }

    .u-delete-icon {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        z-index: 10;
        background-color: $u-type-error;
        border-radius: 100rpx;
        width: 44rpx;
        height: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .u-progress {
        position: absolute;
        bottom: 10rpx;
        left: 8rpx;
        right: 8rpx;
        z-index: 9;
        width: auto;
    }

    .bottom-bar {
        height: 50px;
        background-color: rgb(255, 255, 255);
        padding-top: 14rpx;
        border-top: 1px solid #f0f0f0;
    }

    .flex-btn-group {
        display: flex;
    }

</style>
