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
        },
        {
            path: 'pages/phone_inner_input_desk/desk',
            name: 'phone_car_input_inner_desk'
        },
        {
            path: 'pages/phone_inner_input_desk/bill/bill',
            name: 'phone_car_input_inner_desk_bill'
        },

        {
            path: 'pages/phone_inner_input_desk/micro_bill/micro_bill',
            name: 'phone_car_input_inner_desk_micro_bill'
        }
    ]
})

export default router
