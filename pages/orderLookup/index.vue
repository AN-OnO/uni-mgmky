<template>
	<view class="lookup-page">
		<uv-sticky bgColor="#F3E6C8" :offsetTop="0">
			<view class="search-bar">
				<input
					class="search-input"
					type="text"
					confirm-type="search"
					placeholder="单号 / 客户 / 品名 / 手机号"
					placeholder-class="search-placeholder"
					:value="keyword"
					@input="onInput"
					@confirm="onSearch"
				/>
				<view class="scan-btn" hover-class="scan-btn--pressed" @tap="onScan">
					<image class="scan-icon" src="/static/images/ticket/scan.svg" mode="aspectFit" />
					<text>扫码</text>
				</view>
			</view>
		</uv-sticky>

		<view v-if="!searched" class="empty-block">
			<image class="empty-icon" src="/static/images/ticket/empty.svg" mode="aspectFit" />
			<text class="empty-title">查一张工单</text>
			<text class="empty-hint">输入关键字后点键盘搜索，或直接扫码。示例：永昌、241015</text>
		</view>

		<view v-else-if="results.length === 0" class="empty-block">
			<image class="empty-icon" src="/static/images/ticket/empty.svg" mode="aspectFit" />
			<text class="empty-title">没有匹配的订单</text>
			<text class="empty-hint">「{{ keyword }}」没有对应工单。换个单号或客户名再试。</text>
		</view>

		<view v-else class="result-list">
			<text class="result-count">{{ results.length }} 张工单</text>
			<view
				v-for="order in results"
				:key="order.orderItemNo"
				class="ticket order-card"
				hover-class="order-card--pressed"
				@tap="openDetail(order.orderItemNo)"
			>
				<view class="card-head">
					<text class="ticket-no">{{ order.saleOrderNo }}</text>
					<text class="status-stamp" :class="'status-stamp--' + order.status">{{ order.statusDesc }}</text>
				</view>
				<text class="product-name">{{ order.productName }}</text>
				<view class="ticket-perf"></view>
				<view class="card-row">
					<text class="row-label">客户</text>
					<text class="row-value">{{ order.companyName }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">子单</text>
					<text class="row-value mono">{{ order.orderItemNo }}</text>
				</view>
				<view class="card-row">
					<text class="row-label">当前</text>
					<text class="row-value">{{ order.currentTechnologyName }} · {{ order.quantity }}{{ order.unit }}</text>
				</view>
				<view class="card-foot">
					<text class="foot-time">{{ order.checkintime }}</text>
					<text class="foot-link">查看详情</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import {
		findOrders
	} from './orders.js'

	const keyword = ref('')
	const searched = ref(false)
	const queryText = ref('')

	const results = computed(() => {
		if (!searched.value) return []
		return findOrders(queryText.value)
	})

	const onInput = (event) => {
		keyword.value = event.detail.value
	}

	const onSearch = () => {
		const text = keyword.value.trim()
		if (!text) {
			uni.$uv.toast('请输入单号、客户或品名')
			return
		}
		queryText.value = text
		searched.value = true
	}

	const onScan = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix'],
			success: (res) => {
				const code = String(res.result || '').trim()
				if (!code) {
					uni.$uv.toast('没有识别到内容')
					return
				}
				keyword.value = code
				queryText.value = code
				searched.value = true
			},
			fail: (err) => {
				if (err.errMsg !== 'scanCode:fail cancel') {
					uni.showToast({
						title: '扫码失败，请重试',
						icon: 'none'
					})
				}
			}
		})
	}

	const openDetail = (orderItemNo) => {
		uni.navigateTo({
			url: `/pages/orderLookup/detail?orderItemNo=${encodeURIComponent(orderItemNo)}`
		})
	}
</script>

<style lang="scss" scoped>
	.lookup-page {
		min-height: 100%;
		background: var(--ticket-paper);
		box-sizing: border-box;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 16rpx 32rpx 20rpx;
		background: var(--ticket-paper);
		box-sizing: border-box;
	}

	.search-input {
		flex: 1;
		height: 88rpx;
		padding: 0 24rpx;
		background: var(--ticket-face);
		border: 2rpx solid var(--ticket-edge);
		color: var(--ink-black);
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.search-placeholder {
		color: var(--ink-muted);
	}

	.scan-btn {
		width: 120rpx;
		height: 88rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--ticket-face);
		color: var(--stamp-red);
		border: 2rpx solid var(--stamp-red);
		font-size: 22rpx;
		font-weight: 700;
		letter-spacing: 0.08em;
		flex-shrink: 0;
	}

	.scan-btn--pressed {
		opacity: 0.85;
	}

	.scan-icon {
		width: 36rpx;
		height: 36rpx;
		margin-bottom: 4rpx;
	}

	.empty-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 64rpx 40rpx;
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

	.result-list {
		padding: 8rpx 32rpx 40rpx;
	}

	.result-count {
		display: block;
		margin: 8rpx 0 20rpx;
		font-size: 24rpx;
		letter-spacing: 0.08em;
		color: var(--ink-muted);
	}

	.order-card {
		margin-bottom: 24rpx;
	}

	.order-card--pressed {
		opacity: 0.88;
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
		font-size: 32rpx;
		font-weight: 700;
		line-height: 1.4;
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
		font-size: 26rpx;
		line-height: 1.45;
		color: var(--ink-black);
	}

	.mono {
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-variant-numeric: tabular-nums;
	}

	.card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.foot-time {
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-size: 22rpx;
		color: var(--ink-muted);
	}

	.foot-link {
		font-size: 24rpx;
		letter-spacing: 0.08em;
		color: var(--stamp-red);
	}
</style>
