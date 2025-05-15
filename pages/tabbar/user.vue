<template>
	<view class="page-contain">
		<uv-navbar title="个人中心" bgColor="#D5E8FF" leftIcon=""></uv-navbar>
		<view class="user-card">
			<view class="user-info">
				<image class="user-avatar" :src="head_image || '/static/images/tabbar/avatar.png'"></image>
				<image src="/static/images/tabbar/edit.svg" class='editAvatar' @click="editAvatar"></image>
				<view class="user-info-box">
					<text class="text-h2">{{accountNo|| '匿名用户'}}</text>
					<text class="text-label">{{name || '个性签名'}}</text>
				</view>
			</view>
		</view>
		<view class="detail-banner">
			<view class="arrow-contain" @click="goEarning">
				<text class="text">详情</text>
				<image class="detail-arrow" src="/static/images/tabbar/detail-arrow.svg"></image>
			</view>
			<view class="total-text">累计收益(元)</view>
			<view class="total-income">{{totalIncome}}</view>
			<view class="contain">
				<view class="flex-column">
					<text class="income">{{todayIncome}}</text>
					<text class="text">今日收益(元)</text>
				</view>
				<view class="flex-column">
					<text class="income">{{curMonthIncome}}</text>
					<text class="text">本月收益(元)</text>
				</view>
			</view>
		</view>
		<view class="bg-white margin-lr-sm operation-card">
			<view class="flex-row align-center padding" hover-stay-time="250" hover-class="click-hover"
				@click="goBind">
				<view class="flex-1 flex-row align-center">
					<image class="item-icon" src="/static/images/tabbar/bindEquipment.svg"></image>
					<text class="item-title">默认设备绑定</text>
				</view>
				<uv-icon name="arrow-right" size="28rpx" color="#7f8699"></uv-icon>
			</view>
			<view class="flex-row align-center padding" hover-stay-time="250" hover-class="click-hover"
				@click="exit">
				<view class="flex-1 flex-row align-center">
					<image class="item-icon" src="/static/images/tabbar/exit-icon.svg"></image>
					<text class="item-title">退出登录</text>
				</view>
				<uv-icon name="arrow-right" size="28rpx" color="#7f8699"></uv-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		toRefs
	} from "vue";
import { LogOut, MyStatInfo } from "../../apis/member";
	const todayIncome = ref('0')
	const curMonthIncome = ref('0')
	const totalIncome = ref('0')
	const head_image = ref('')
	const accountNo = ref('')
	const name = ref('')
	
	onMounted(() => {
		MyStatInfo().then((res) => {
			todayIncome.value = res.data?.todayIncome 
			curMonthIncome.value = res.data?.curMonthIncome 
			totalIncome.value = res.data?.totalIncome 
			head_image.value = res.data?.userInfo?.headImage
			accountNo.value = res.data?.userInfo?.accountNo
			name.value = res.data?.userInfo?.name
		})
	})
	
	const editAvatar = () => {
		console.log('编辑头像')
	}
	const goEarning = () => {
		uni.navigateTo({
			url: '/pages/tabbar/earning'
		})
	}
	const goBind = () => {
		uni.navigateTo({
			url: '/pages/tabbar/bind'
		})
	}
	const exit = () => {
		LogOut().then(res => {
			console.log('退出登录', res)
			uni.$Utils.removeAllStorage()
			uni.navigateTo({
				url: '/pages/tabbar/index'
			})
		})
	}
</script>

<style lang="scss">
	.page-contain {
		position: relative;
		z-index: 1;
		padding-top: calc(var(--window-top) + var(--status-bar-height) + 44px);
		padding-left: 30rpx;
		padding-right: 30rpx;
	
		&::before {
			content: "";
			position: fixed;
			z-index: -1;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(180deg, #D5E8FF 0%, #F3F6FA 100%), #F5F6F8;
		}
	}

	.user-card {
		width: 92%;
		height: 100%;
		margin: 0 auto;
		// margin-top: $top;
		border-radius: 20rpx;
		position: relative;
	}

	.user-info {
		display: flex;
		align-items: center;
		padding: 50rpx 0 22rpx;
		position: relative;

		.user-avatar {
			max-width: 137rpx;
			max-height: 137rpx;
			overflow: hidden;
			border-radius: 190rpx;
			margin-right: 30rpx;
		}

		.editAvatar {
			max-width: 61rpx;
			max-height: 61rpx;
			position: absolute;
			bottom: 10%;
			left: 12%;
		}

		.user-info-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}

	.text-h2 {
		font-weight: 600;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}

	.text-label {
		font-weight: 500;
		font-size: 27rpx;
		color: #666666;
		line-height: 42rpx;
	}

	.detail-banner {
		background: url('/static/images/tabbar/detail-bg.png');
		background-repeat: no-repeat;
		background-size: contain;
		margin: 0 15rpx;
		position: relative;

		.arrow-contain {
			position: absolute;
			right: 3%;
			top: 3%;
			display: flex;
			align-items: center;

			.text {
				font-weight: 500;
				font-size: 27rpx;
				color: #3A5071;
				line-height: 42rpx;
			}
		}

		.detail-arrow {
			max-width: 30.53rpx;
			max-height: 30.53rpx;
		}

		.total-text {
			padding: 55rpx 0 0 34rpx;
			font-size: 23rpx;
			color: #657B9D;
			line-height: 34rpx;
		}

		.total-income {
			padding: 0 0 28rpx 30rpx;
			font-weight: 500;
			font-size: 61rpx;
			color: #3A5071;
			line-height: 69rpx;
		}

		.contain {
			padding: 0rpx 143rpx 30rpx 45.8rpx;
			display: flex;
			justify-content: space-between;
		}

		.income {
			font-weight: 500;
			font-size: 46rpx;
			color: #3A5071;
			line-height: 69rpx;
		}

		.text {
			font-size: 23rpx;
			color: #657B9D;
			line-height: 34rpx;
		}
	}

	.operation-card {
		margin-top: 17rpx;
		border-radius: 15rpx
	}

	.item-icon {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.item-title {
		font-weight: 500;
		font-size: 31rpx;
		color: #333333;
		line-height: 46rpx;
		margin-left: 15rpx;
	}
	.click-hover {
		background-color: #f1f1f1;
	}
</style>