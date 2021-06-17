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
                    name: 'login',
                    query: {}
                })
            } else {
                that.$openPage({
                    name: 'index',
                    query: {}
                })
            }
        },
    }
</script>

<style lang="scss">

</style>
