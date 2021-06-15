<script>

    export default {
	    data (){
	        return {
                netWork : 'none'
            }
        },

        onLaunch() {
            uni.onTabBarMidButtonTap((options) => {
                console.log('options');
                setTimeout(()=>{
                    uni.navigateTo({
                        url: '/pages/post/post',
                        animationType: 'slide-in-bottom',
                        animationDuration: 250,
                        success : result => {
                            console.log('result', result);
                        },
                        fail : msg =>{
                            console.log('msg', msg);
                        }
                    });
                },0)
            })

        },

        created(){
            this.$db.closeDB('netless').catch(err=> {
                console.log('数据库未打开')
            }).finally(() => {
                this.initDB();
            })




            this.$e.init();


        },

		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},


        methods : {
            getNetworkType(){
                uni.getNetworkType({
                    success : result => {
                        this.netWork = result.networkType;
                        console.log('net', result);
                    }
                })
            },


            async initDB(){
                let isOpen = this.$db.isOpenDB('netless', '_doc/netless.db');

                if(!isOpen){
                    await this.$db.openComDB('netless', '_doc/netless.db');
                    this.createTableCar();

                    let result = await this.$db.isTableExit('netless', 'car');
                    console.log('result',result);
                }
            },

            createTableCar(){
                this.$db.executeSQL('netless', this.$db.createTableCarSQL).then(result => {
                    console.log('创建 car 表成功', result);
                }).catch(err => {
                    console.error('创建 car 表失败', err);
                })
            }


        }
	}

</script>


<style lang="scss">
    @import "uview-ui/index.scss";
</style>

<style>

    /*@import "assets/uni.css";*/

    /*@import "./components/colorui/main.css";*/
    /*@import "./components/colorui/icon.css";*/

</style>
