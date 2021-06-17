<template>
	<view>

		<view class="u-demo-area">
			<u-toast ref="uToast"></u-toast>
			<u-swiper @change="" :height="270" :list="swiperList" :title="false" :effect3d="true"
					  indicator-pos="bottomCenter" mode="round" :interval="3000" @click=""></u-swiper>
		</view>

		<u-notice-bar :autoplay="false" playState="play" :speed="170" @getMore=""
					  mode="horizontal" @end="" @close="" @click="" :show="true" type="none" :list="noticeList"
					  :moreIcon="true" :volumeIcon="true" :duration="3000" :isCircular="true">
		</u-notice-bar>

<!--		<navigator hover-class="none" :url="'/pages/basics/' + item.name" class="nav-li" navigateTo :class="'bg-'+item.color"-->
<!--				   :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">-->
<!--			<view class="nav-title">{{item.title}}</view>-->
<!--			<view class="nav-name">{{item.name}}</view>-->
<!--			<text :class="'cuIcon-' + item.cuIcon"></text>-->
<!--		</navigator>-->

		<view class="nav-list">

			<navigator hover-class="none" @tap="navigatorTo(0)" class="nav-li bg-cyan"
					   :style="[{animation: 'show ' + ((1)*0.2+1) + 's 1'}]">
				<u-badge :is-center="false" type="error" :count="8" :is-dot="false" :offset="[-8, -8]" size="default"></u-badge>

				<view class="nav-title">车辆录入</view>
				<view class="nav-name">layout</view>
<!--				<text class="cuIcon-edit"></text>-->
				<u-icon class="icon" name="edit-pen" size="40" color="#fff"></u-icon>
			</navigator>

			<navigator hover-class="none" @tap="navigatorTo(1)" url="" class="nav-li bg-orange"
					   :style="[{animation: 'show ' + ((2)*0.2+1) + 's 1'}]">
				<view class="nav-title">暂存车辆</view>
				<view class="nav-name">layout</view>
				<text class="cuIcon-list"></text>
			</navigator>

			<navigator hover-class="none" @tap="navigatorTo(2)" url="" class="nav-li bg-red"
					   :style="[{animation: 'show ' + ((2)*0.2+1) + 's 1'}]">
				<view class="nav-title">车辆查询</view>
				<view class="nav-name">layout</view>
				<text class="cuIcon-search"></text>
			</navigator>

			<navigator hover-class="none" @tap="navigatorTo(3);justTest();" url="" class="nav-li bg-olive"
					   :style="[{animation: 'show ' + ((3)*0.2+1) + 's 1'}]">
				<view class="nav-title">待上传车辆</view>
				<view class="nav-name">layout</view>
				<text class="cuIcon-upload"></text>
			</navigator>

		</view>



<!--		<view>-->
<!--			<view>-->
<!--				<u-toast ref="uToast"></u-toast>-->
<!--				<u-grid :col="col" @click="click" v-if="!isSwiper" :border="border">-->
<!--					<u-grid-item name="item1" :index="0" @click="itemClick">-->
<!--						<u-badge count="9" :offset="[col == 3 ? 20 : 14, col == 3 ? 30 : 20]"></u-badge>-->
<!--						<u-icon name="photo" :size="46"></u-icon>-->
<!--						<view class="grid-text">车辆录入</view>-->
<!--					</u-grid-item>-->
<!--					<u-grid-item :index="1"  @click="itemClick">-->
<!--						<u-icon name="lock" :size="46"></u-icon>-->
<!--						<view class="grid-text">车辆列表</view>-->
<!--					</u-grid-item>-->
<!--					<u-grid-item :index="2" @click="justTest">-->
<!--						<image src="https://cdn.uviewui.com/uview/grid/hot5.png" :style="{-->
<!--							top: col == 3 ? '14rpx' : '8rpx',-->
<!--							right: col == 3 ? '40rpx' : '28rpx'-->
<!--						}" style="width: 34rpx;height: 34rpx;" class="badge-icon" mode="widthFix"></image>-->
<!--						<u-icon name="hourglass" :size="46"></u-icon>-->
<!--						<view class="grid-text">车辆上传</view>-->
<!--					</u-grid-item>-->

<!--				</u-grid>-->
<!--			</view>-->
<!--		</view>-->


	</view>
</template>

<script>
	export default {
		data() {
			return {

				noticeList: [
					'锦瑟无端五十弦，一弦一柱思华年',
					'庄生晓梦迷蝴蝶，望帝春心托杜鹃',
					'沧海月明珠有泪，蓝田日暖玉生烟'
				],

				swiperList: [{
					image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东'
				},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],

			};
		},


        onReady(){

        },

		methods: {

			justTest(){
				// let sql = `
				// 	ID INT PRIMARY KEY  NOT NULL,
				// 	CAR_OWNER_NAME TEXT NOT NULL,
				// 	CAR_OWNER_PHONE INTEGER,
				// 	CAR_OWNER_CODE TEXT,
				// 	CAR_NO TEXT NOT NULL,
				// 	CAR_KIND TEXT,
				// 	ESTIMATE_AMOUNT REAL
				// 	IN_DATE TEXT
				// `;
				// this.$db.createTable('netless','car',sql);

				this.$db.delTable('netless', 'car');
			},



			//navigator
			navigatorTo(index){
				console.log(index);
				let url = "";
				switch(index){
					case 0:
						url = "/pages/post/post";

						uni.navigateTo({
							url: url,
							animationType: 'slide-in-bottom',
							animationDuration: 250,
							success : result => {
								console.log('result', result);
							},
							fail : msg =>{
								console.log('msg', msg);
							}
						});
						return;
					case 1:
						url = "/pages/carList/carList";
						break;
					case 2 :
						url = "/pages/carSearch/carSearch";
						break;
				}

				uni.navigateTo({
					url: url,
					success : result => {
						console.log('result', result);
					},
					fail : msg =>{
						console.log('msg', msg);
					}
				});
			}


		}
	};
</script>

<style scoped lang="scss">

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.badge-icon {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
	}

	.swiper {
		height: 480rpx;
	}

	.indicator-dots {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.indicator-dots-item {
		background-color: $u-tips-color;
		height: 6px;
		width: 6px;
		border-radius: 10px;
		margin: 0 3px;
	}

	.indicator-dots-active {
		background-color: $u-type-primary;
	}
</style>

<style>
	@import '../../assets/better-colorUI.css';


	page, body {
		height: 100%;
		background-color: #fff;
	}


	.nav-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0 40upx 0;
		justify-content: space-between;
		margin-top:80rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.nav-li {
		/*flex:auto;*/
		padding: 30upx;
		border-radius: 12upx;
		width: 40%;
		margin-bottom: 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li .icon {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

</style>
