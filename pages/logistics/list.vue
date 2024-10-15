<template>
	<view style="height: 100%;">
	<view style="background-color: #333333; padding-bottom: 30rpx;">
		<view class="title">
			物流
		</view>
		<view style="display: flex; justify-content: space-around;">
			<view>
				<view class="amount">3</view>
				<view class="today-info">今日取送(单)</view>
			</view>
			<view>
				<view class="amount">2164.43</view>
				<view class="today-info">今日收益(元)</view>
			</view>
		</view>
	</view>
	<view style="background-color: #F0F1F5; height: 100%;">
		<view style="width: 92%; margin: auto; ">
			<view class="flex-between">
				<uv-tabs :list="list" lineColor='#333333' @click="click"></uv-tabs>
				<uv-icon name="search" size="32"></uv-icon>
			</view>
			<uv-list v-for="(item, index) in [1,2,3]" :key="index" style="margin-top: 15rpx;border-radius: 15rpx;">
				<uv-list-item style="margin: 20rpx;">
					<view class="flex-between">
						<text style="font-weight: 500;font-size: 34rpx;">鹤壁市-黎阳快印</text>
						<text style="color: #F6801E;">寄付</text>
					</view>
					<view style="display: flex; align-items: center;">
						<image src="../../static/images/logistics/Local (已定位).svg"
							style=" max-width: 30rpx; max-height: 30rpx;" mode=""></image>
						<text class="line-clamp">河南省河南省 郑州市金水区河南省/郑州市/金水区/新河南省河南省
							郑州市金水区河南省/郑州市/金水郑州市金水区河南省/郑州市/金水</text>
					</view>
					<text class="line-clamp" style="
						margin-bottom: 15rpx;
						height: 85rpx;
						-webkit-line-clamp: 2;
						color: #808080;">特价喷墨画册【喷墨画册】：260x185mm-封面260x185mm-封面：200g铜版纸特价喷墨画册【喷墨画册】：260x185mm-封面：200g铜版纸-单面彩色</text>
					<button v-if="['开始取送','完成取送'].includes(buttonText)" class="list-button">
						<image
							:src="buttonText === '开始取送' ? '/static/images/logistics/开始.svg':'/static/images/logistics/完成.svg'"
							class="image"
							 mode=""></image><text class="button-text">{{buttonText}}</text>
					</button>
				</uv-list-item>
			</uv-list>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonText: '开始取送',
				list: [{
					name: '待取送(5)',
				}, {
					name: '取送中(8)',
				}, {
					name: '已完成(5)'
				}, ]
			}
		},
		methods: {
			click(item) {
				console.log('item', item);
				if (item.index === 0) {
					this.buttonText = '开始取送'
				} else if (item.index === 1) {
					this.buttonText = '完成取送'
				} else {
					this.buttonText = ''
				}
			}
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
	}
	.title {
		font-size: 34rpx;
		text-align: center;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		line-height: 53rpx;
	}

	.amount {
		font-weight: 500;
		font-size: 46rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 69rpx;
		text-align: center;
	}

	.today-info {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.6);
		line-height: 38rpx;
		text-align: center;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
	}

	.line-clamp {
		display: -webkit-box;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.list-button {
		height: 69rpx;
		margin-right: 0;
		background: #333333;
		border-radius: 191rpx
	}
	.image {
		max-width: 45.8rpx;max-height: 45.8rpx;
	}
	.button-text {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255,255,255,0.9);
		line-height: 42rpx;
		vertical-align: super;
	}
</style>