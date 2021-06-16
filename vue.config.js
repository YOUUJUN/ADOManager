module.exports = {
    transpileDependencies: ['@dcloudio/uni-ui'],
    productionSourceMap : true,

    devServer: {
        proxy: {
            // 这个就是之前在.env.developement的VUE_APP_URL设置的，这两个得一样
            '/api': {
                target: 'http://erp.bfcgj.com',
                secure: false,   // https需要这个
                changeOrigin: true, // 是否允许跨域
                pathRewrite: {
                    '^/api': ''  // 给变量名重命名
                }
            },
            // 若存在多个访问接口时继续往后面加
        }
    }
}
