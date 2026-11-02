<template>
	<view class="detail-page">
		<view v-if="!order" class="empty-block">
			<image class="empty-icon" src="/static/images/ticket/empty.svg" mode="aspectFit" />
			<text class="empty-title">找不到这张工单</text>
			<text class="empty-hint">单号可能已失效。返回查单页重新搜索。</text>
		</view>

		<view v-else class="detail-body">
			<view class="ticket mast">
				<view class="card-head">
					<text class="ticket-no">{{ order.saleOrderNo }}</text>
					<text class="status-stamp" :class="'status-stamp--' + order.status">{{ order.statusDesc }}</text>
				</view>
				<text class="product-name">{{ order.productName }}</text>
				<text class="spec">{{ order.spec }}</text>
			</view>

			<view class="ticket section">
				<text class="section-title">客户</text>
				<view class="ticket-perf"></view>
				<view class="card-row">
					<text class="row-label">名称</text>
					<text class="row-value">{{ order.companyName }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">联系</text>
					<text class="row-value">{{ order.contactName }} {{ order.contactMobile }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">地址</text>
					<text class="row-value">{{ order.deliveryAddress }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">方式</text>
					<text class="row-value">{{ order.deliveryMethodDesc }}</text>
				</view>
			</view>

			<view class="ticket section">
				<text class="section-title">工单</text>
				<view class="ticket-perf"></view>
				<view class="card-row">
					<text class="row-label">子单</text>
					<text class="row-value mono">{{ order.orderItemNo }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">数量</text>
					<text class="row-value">{{ order.quantity }}{{ order.unit }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">金额</text>
					<text class="row-value">{{ order.amount }} 元</text>
				</view>
				<view class="card-row">
					<text class="row-label">下单</text>
					<text class="row-value mono">{{ order.checkintime }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">备注</text>
					<text class="row-value">{{ order.remark || '无' }}</text>
				</view>
			</view>

			<view class="ticket section">
				<text class="section-title">进度</text>
				<view class="ticket-perf"></view>
				<view v-for="step in order.technologies" :key="step.name" class="step">
					<view class="step-mark" :class="'step-mark--' + step.status"></view>
					<view class="step-body">
						<view class="step-line">
							<text class="step-name">{{ step.name }}</text>
							<text class="step-state">{{ step.statusDesc }}</text>
						</view>
						<text v-if="step.operatorName || step.finishedAt" class="step-meta">
							{{ step.operatorName }} {{ step.finishedAt }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		findOrder
	} from './orders.js'

	const order = ref(null)

	onLoad((options) => {
		const orderItemNo = decodeURIComponent(options?.orderItemNo || '')
		order.value = findOrder(orderItemNo)
	})
</script>

<style lang="scss" scoped>
	.detail-page {
		min-height: 100%;
		background: var(--ticket-paper);
		box-sizing: border-box;
	}

	.detail-body {
		padding: 24rpx 32rpx 48rpx;
	}

	.mast,
	.section {
		margin-bottom: 24rpx;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16rpx;
	}

	.status-stamp {
		flex-shrink: 0;
		padding: 4rpx 12rpx;
		border: 2rpx solid currentColor;
		font-size: 22rpx;
		letter-spacing: 0.08em;
		font-weight: 700;
	}

	.status-stamp--producing {
		color: var(--stamp-red);
	}

	.status-stamp--pending_delivery {
		color: var(--ink-black);
	}

	.status-stamp--delivered {
		color: var(--ink-green);
	}

	.product-name {
		display: block;
		margin-top: 16rpx;
		font-size: 36rpx;
		font-weight: 700;
		line-height: 1.4;
		color: var(--ink-black);
	}

	.spec {
		display: block;
		margin-top: 8rpx;
		font-size: 26rpx;
		line-height: 1.45;
		color: var(--ink-muted);
	}

	.section-title {
		display: block;
		font-size: 30rpx;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--ink-black);
	}

	.card-row {
		display: flex;
		align-items: flex-start;
		margin-top: 12rpx;
	}

	.row-label {
		width: 72rpx;
		flex-shrink: 0;
		font-size: 24rpx;
		color: var(--ink-muted);
	}

	.row-value {
		flex: 1;
		font-size: 28rpx;
		line-height: 1.45;
		color: var(--ink-black);
	}

	.mono {
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-variant-numeric: tabular-nums;
	}

	.step {
		display: flex;
		align-items: flex-start;
		margin-top: 20rpx;
	}

	.step-mark {
		width: 16rpx;
		height: 16rpx;
		margin-top: 10rpx;
		margin-right: 16rpx;
		border: 2rpx solid var(--ink-muted);
		flex-shrink: 0;
	}

	.step-mark--doing {
		background: var(--stamp-red);
		border-color: var(--stamp-red);
	}

	.step-mark--done {
		background: var(--ink-green);
		border-color: var(--ink-green);
	}

	.step-body {
		flex: 1;
	}

	.step-line {
		display: flex;
		justify-content: space-between;
		gap: 16rpx;
	}

	.step-name {
		font-size: 28rpx;
		font-weight: 700;
		color: var(--ink-black);
	}

	.step-state {
		font-size: 24rpx;
		color: var(--ink-muted);
	}

	.step-meta {
		display: block;
		margin-top: 4rpx;
		font-size: 24rpx;
		color: var(--ink-muted);
	}

	.empty-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 120rpx 64rpx;
	}

	.empty-icon {
		width: 120rpx;
		height: 120rpx;
	}

	.empty-title {
		margin-top: 24rpx;
		font-size: 32rpx;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-black);
	}

	.empty-hint {
		margin-top: 12rpx;
		font-size: 26rpx;
		line-height: 1.5;
		text-align: center;
		color: var(--ink-muted);
	}
</style>
