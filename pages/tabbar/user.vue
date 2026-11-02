<template>
	<view>
		<view class="page-contain">
			<view class="ticket user-card">
			<text class="page-brand">个人中心</text>
			<view class="ticket-perf"></view>
			<view class="user-info">
				<image class="user-avatar" :src="head_image || '/static/images/tabbar/avatar.png'" mode="aspectFill"></image>
				<view class="user-info-box">
					<text class="text-h2">{{accountNo|| '匿名用户'}}</text>
					<text class="text-label">{{name || '个性签名'}}</text>
				</view>
			</view>
		</view>
		<view class="ticket detail-banner">
			<view class="earn-head">
				<view class="total-text">累计收益(元)</view>
				<view class="arrow-contain" @click="goEarning">
					<text class="text">详情</text>
					<image class="detail-arrow" src="/static/images/tabbar/detail-arrow.svg"></image>
				</view>
			</view>
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
		<view class="ticket operation-card">
			<view class="flex-row align-center op-row" hover-stay-time="250" hover-class="click-hover"
				@click="goBind">
				<view class="flex-1 flex-row align-center">
					<image class="item-icon" src="/static/images/tabbar/bindEquipment.svg"></image>
					<text class="item-title">默认设备绑定</text>
				</view>
				<image class="item-icon" src="/static/images/ticket/chevron.svg"></image>
			</view>
			<view class="flex-row align-center op-row" hover-stay-time="250" hover-class="click-hover"
				@click="exit">
				<view class="flex-1 flex-row align-center">
					<image class="item-icon" src="/static/images/tabbar/exit-icon.svg"></image>
					<text class="item-title">退出登录</text>
				</view>
				<image class="item-icon" src="/static/images/ticket/chevron.svg"></image>
			</view>
		</view>
	</view>
		<tabbar-nav />
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
			uni.redirectTo({
				url: '/pages/index/login'
			})
		})
	}
</script>

<style lang="scss">
	.page-contain {
		position: relative;
		min-height: 100%;
		padding-top: calc(var(--status-bar-height) + 44px + 16px);
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 24rpx;
		background: var(--ticket-paper);
		box-sizing: border-box;
	}

	.user-card {
		margin-bottom: 28rpx;
	}

	.page-brand {
		display: block;
		font-size: 44rpx;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-black);
		line-height: 1.2;
	}

	.op-row {
		padding: 20rpx 0;
		border-bottom: 2rpx dashed var(--perf-line);
	}
	.op-row:first-child {
		padding-top: 0;
	}
	.op-row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.user-info {
		display: flex;
		align-items: center;
		padding: 24rpx 0 8rpx;
		position: relative;

		.user-avatar {
			width: 112rpx;
			height: 112rpx;
			max-width: 112rpx;
			max-height: 112rpx;
			overflow: hidden;
			border-radius: 50%;
			border: none;
			background: #E8DCC0;
			margin-right: 24rpx;
		}

		.user-info-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}

	.text-h2 {
		font-weight: 700;
		font-size: 34rpx;
		color: var(--ink-black);
		line-height: 53rpx;
		letter-spacing: 0.06em;
	}

	.text-label {
		font-size: 26rpx;
		color: var(--ink-muted);
		line-height: 42rpx;
	}

	.detail-banner {
		margin-bottom: 28rpx;
		position: relative;

		.earn-head {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.arrow-contain {
			display: flex;
			align-items: center;

			.text {
				font-size: 24rpx;
				color: var(--stamp-red);
				line-height: 42rpx;
			}
		}

		.detail-arrow {
			max-width: 30rpx;
			max-height: 30rpx;
		}

		.total-text {
			font-size: 22rpx;
			color: var(--ink-muted);
			line-height: 34rpx;
		}

		.total-income {
			font-family: ui-monospace, Menlo, Consolas, monospace;
			font-variant-numeric: tabular-nums;
			font-size: 56rpx;
			color: var(--ink-black);
			line-height: 72rpx;
			padding-bottom: 16rpx;
		}

		.contain {
			display: flex;
			justify-content: space-between;
			border-top: 2rpx dashed var(--perf-line);
			padding-top: 16rpx;
		}

		.income {
			font-family: ui-monospace, Menlo, Consolas, monospace;
			font-size: 36rpx;
			color: var(--ink-black);
			line-height: 52rpx;
		}

		.text {
			font-size: 22rpx;
			color: var(--ink-muted);
			line-height: 34rpx;
		}
	}

	.operation-card {
		margin-bottom: 24rpx;
	}

	.item-icon {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.item-title {
		font-size: 30rpx;
		color: var(--ink-black);
		line-height: 46rpx;
		margin-left: 15rpx;
	}
	.click-hover {
		background-color: var(--ticket-paper);
	}
</style>
