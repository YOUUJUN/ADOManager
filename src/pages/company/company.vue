<template>
    <view>
        <view class="company-list" v-if="companyList.length>0">
            <u-cell-group>
                <u-cell-item v-for="(item, index) in companyList"
                             :key="item.__rowid" :title="item.orga_short_name"
                             @click="chooseCompany(item.__rowid)"></u-cell-item>
            </u-cell-group>
        </view>
        <view v-else>
            <u-empty text="暂无公司列表" mode="list"></u-empty>
        </view>
        <!--<view>
            <view class="flex-btn-group">
                <u-button type="primary" size="medium" @click="delItem">del</u-button>
                <u-button type="success" size="medium" @click="addItem">add</u-button>
                <u-button type="warning" size="medium" @click="editItem">edit</u-button>
            </view>
        </view>-->
    </view>

</template>

<script>



    export default {
        data() {
            return {
                groupName: 'phone_comp_list',
                moduleName: 'phone_comp_list',
                companyList: [],
                //下拉列表数据
                listData: {},
                action_refresh: 'Refresh',

                comp_ado_name: 'comp_list',
                action_login_company: 'LoginCompany'
            }
        },

        beforeCreate(){
            this.$e = new this.$Engine();
        },

        // onShow() {
        //     console.log('-----------------------onShow---------------------');
        //     console.log('this.$e===>1',this.$e);
        //     let adapter = this.$e.getActiveModule(this.moduleName, true).createAdapter(this, true);
        //     adapter.mappingData(this.comp_ado_name, "companyList");
        //     console.log('this.$e===>2',this.$e);
        //
        //     this.getCompanyData();
        //     console.log('this.$e===>3',this.$e);
        // },

        onLoad() {

            let adapter = this.$e.getActiveModule(this.moduleName, true).createAdapter(this, true);
            adapter.mappingData(this.comp_ado_name, "companyList");

            this.getCompanyData();
        },

        methods: {
            getCompanyData() {
                let that = this;
                this.$e.init(that.groupName, that.moduleName, null, {
                    _act: this.action_refresh,
                }).then(function (res) {
                    console.log('get in to refresh ===========>vue',that);
                    console.log('---------------companyList-------', that.companyList)
                });

                // util.initModule(that.groupName, that.moduleName, {
                //     actionName: that.action_refresh,
                // }).then(function (res) {
                //     if (res) {
                //         that.companyList = res.data[0].rows;
                //     }
                // });
            },

            chooseCompany(rowid) {
                console.log('this.$e====>', this.$e);
                // amn, name, ados, jsondata, options
                this.$e.call(this.moduleName, this.action_login_company, null, null, {
                    params: {
                        rowid: rowid,
                    }
                });
                uni.navigateBack();
            }
        }
    }
</script>

<style lang="scss">

</style>
