<template>
    <view>

    </view>
</template>

<script>


    export default {
        data() {
            return {};
        },
        onLoad() {
            let that = this;

            console.log('haslogin' + this.$store.state.hasLogin);

            if (!this.$store.state.hasLogin) {
                that.$openPage({
                    name: 'login'
                })
            } else {
                that.$openPage({
                    name: 'index'
                })
            }
        },
    }
</script>

<style lang="scss">

</style>
