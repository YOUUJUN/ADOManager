import MinRouter from './MinRouter'

// 配置路由
const router = new MinRouter({
    routes: [
        {
            path: 'pages/main/main',
            name: 'main'
        },
        {
            path: 'pages/login/login',
            name: 'login'
        },
        {
            path: 'pages/index/index',
            name: 'index'
        },
        {
            path: 'pages/company/company',
            name: 'company'
        }
    ]
})

export default router
