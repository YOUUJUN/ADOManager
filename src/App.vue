<script>
    export default {
        onLaunch: function () {
            console.log('App Launch')
        },
       onLoad ( ) {
            console.log('App Show')
        },
        onHide: function () {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
    @import "uview-ui/index.scss";

    .u-card {
        margin: 10rpx !important;
    }

    .u-item-title {
        position: relative;
        font-size: 15px;
        padding-left: 8px;
        line-height: 1;
        margin-bottom: 11px;
        margin-top: 11px;
    }

    .u-item-title:after {
        position: absolute;
        width: 4px;
        top: -1px;
        height: 16px;
        /* #ifndef APP-NVUE */
        content: '';
        /* #endif */
        left: 0;
        border-radius: 10px;
        background-color: #f29100;
    }
</style>
