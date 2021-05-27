

<template>
    <view class="page-carnumber-test">
        <view class="number-wrap">
            <car-number v-model="carNumber" :length="length" @inputdone='handleDone'></car-number>
        </view>
    </view>
</template>

<script>
    import CarNumber from '@/components/codecook-carnumber/codecook-carnumber.vue';

    export default {
        components: {
            CarNumber
        },
        data() {
            return {
                carNumber: '',
                fuel_name : '汽油'
            }
        },

        onLoad(e) {
            console.log('e[\'car_no\']',e);
            this.carNumber = e['car_no'].trim();
            this.fuel_name = e['fuel_name'];
        },

        watch: {
            carNumber(num) {
                uni.$emit('getCarNo',{
                    msg : num
                });
            },
        },

        computed : {

            length (){
                if(this.fuel_name === '纯电'){
                    return 8;
                }else{
                    return 7;
                }
            }

        },


        methods: {

            handleDone(){
                this.$nextTick(()=>{
                    uni.navigateBack();
                })
            }

        },


        beforeMount() {
        },
    }
</script>

<style scoped lang="less">
    .number-wrap {
        padding: 30rpx;
    }
</style>
