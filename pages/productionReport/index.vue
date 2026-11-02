<template>
	<view class="page-wrap">
		<view class="ticket reprot-card">
			<view class="report-title">
				<image class="report-img" src="/static/images/productionReport/clockIn.svg"></image>
				<text class="title-text">绩效收益</text>
			</view>
			<view class="report-nav">
				<view class="nav-item">
					<text class="nav-title">{{taskCount}}</text>
					<text class="nav-label">今日完成(件)</text>
				</view>
				<view class="nav-item">
					<text class="nav-title">{{taskAmount}}</text>
					<text class="nav-label">今日收益(元)</text>
				</view>
			</view>
		</view>
		<view class="ticket reprot-card">
			<view class="flex-row align-center menu-item" hover-stay-time="250" hover-class="click-hover"
				v-for="(item, index) in cellGroup" :key="index" @click="onClick(item)">
				<view class="flex-1 flex-row align-center">
					<image class="report-img" :src="item.icon"></image>
					<text class="item-title">{{item.title}}</text>
				</view>
				<image class="report-img" src="/static/images/productionReport/rightArrow.svg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		MyCompletedStatForToday
	} from '../../apis/production'
	export default {
		data() {
			return {
				taskCount: 0,
				taskAmount: 0,
				cellGroup: [{
						title: '报工',
						icon: '/static/images/productionReport/clockIn.svg',
					},
					{
						title: '批量报工',
						icon: '/static/images/productionReport/batchReport.svg',
					},
					{
						title: '多人报工',
						icon: '/static/images/productionReport/multiReport.svg',
					},
					{
						title: '查看订单',
						icon: '/static/images/productionReport/orderInfo.svg',
					}
				]
			}
		},
		methods: {
			onClick(e) {
				if (e.title == '批量报工') {
					// 调用小程序的扫码 API
					uni.scanCode({
						success: (res) => {
							console.log('扫码结果：', res);
							uni.navigateTo({
								// 批量报工工艺选择
								url: `/pages/productionReport/batch?orderItemNo=${res.result}`
							})
						}
					});
				} else {
					uni.navigateTo({
						url: `/pages/productionReport/list?type=${e.title}`
					})
				}
			}
		},
		onLoad() {
			MyCompletedStatForToday().then(res => {
				if (res.code === 0) {
					this.taskCount = res.data.taskCount
					this.taskAmount = res.data.taskAmount
				}
			})
		}
	}
</script>

<style lang="scss">
	.page-wrap {
		background: var(--ticket-paper);
		min-height: 100%;
		padding: 24rpx 32rpx 40rpx;
		box-sizing: border-box;
	}

	.reprot-card {
		margin-bottom: 28rpx;
	}

	.report-title {
		display: flex;
		align-items: center;
	}

	.title-text {
		font-weight: 600;
		font-size: 34rpx;
		color: var(--ink-black);
		line-height: 53rpx;
		letter-spacing: 0.08em;
	}

	.report-img {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.report-nav {
		margin-top: 30rpx;
		margin-bottom: 16rpx;
		display: flex;
		justify-content: space-between;

		.nav-item {
			width: 43%;
			background: var(--ticket-paper);
			border: 2rpx solid var(--ticket-edge);
			border-radius: 0;
			padding: 15rpx;
			display: flex;
			flex-direction: column;

			.nav-title {
				font-weight: bold;
				font-size: 46rpx;
				color: var(--ink-black);
				line-height: 61rpx;
				font-family: ui-monospace, Menlo, Consolas, monospace;
			}

			.nav-label {
				font-weight: 400;
				font-size: 27rpx;
				color: var(--ink-muted);
				line-height: 38rpx;
			}
		}
	}

	.menu-item {
		padding: 45.8rpx 0;

		&:not(:last-child) {
			border-bottom: 2rpx dashed var(--perf-line);
		}

		.item-title {
			font-size: 31rpx;
			color: var(--ink-black);
			line-height: 46rpx;
			margin-left: 22.9rpx;
		}
	}

	.click-hover {
		background: var(--ticket-paper);
	}
</style>