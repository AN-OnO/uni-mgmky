<template>
	<view class="page-container">
		<uv-sticky bg-color="#F3E6C8">
			<view class="padding">
				<text class="section-title">添加返工订单</text>
				<!-- <view>
					<image :src="$IMG_URL + defaultIcon"></image>
					<text>扫码添加</text>
				</view> -->
				<view class="list-grid margin-top-sm">
					<template v-for="item in list" :key="item.event">
						<view class="list-item" @click="addReturnOrder(item.event)">
							<image class="image-icon margin-right-sm" :src="$IMG_URL + item.icon"></image>
							<text class="text-label">{{item.label}}</text>
						</view>
					</template>
				</view>
			</view>
		</uv-sticky>
		<view class="margin-top-sm padding">
			<text class="section-title">返单列表</text>
			<template v-for="(item,index) in orderList" :key="index">
				<view class="order-card margin-top">
					<view class="order-card-head">
						<text class="text-df text-bold">单号：{{item.orderItemNo}}</text>
						<uv-tags :text="item.orderStatus===0?'未审核':'已审核'"
							:type="item.orderStatus===0?'error':'success'"></uv-tags>
					</view>
					<view class="order-card-body">
						<text>源订单号：{{item.sourceOrderItemNo}}</text>
						<text>{{item.address}}</text>
						<text class="self-end">{{item.checkinTime}}</text>
					</view>
				</view>
			</template>
			<uv-empty v-if="!orderList.length"></uv-empty>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import {
		onReachBottom
	} from '@dcloudio/uni-app'

	const defaultIcon = ref('/app/物流.svg')
	const list = ref([{
			label: '扫码添加',
			icon: '/app/物流.svg',
			event: 'scan'
		},
		{
			label: '搜索添加',
			icon: '/app/物流.svg',
			event: 'search'
		}
	])

	const pageIndex = ref(0)
	const pageSize = ref(10)
	const isReachBottom = ref(false)
	const orderList = ref([])

	const listCount = computed(() => list.value.length)

	onReachBottom(() => !isReachBottom.value && getList())

	const getList = () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const data = [{
						address: '汝河路-永昌广告印务',
						orderItemNo: '240820000041478',
						sourceOrderItemNo: '240820000041478',
						checkinTime: '2025-03-17 21:26',
						orderStatus: 0
					},
					{
						address: '汝河路-永昌广告印务',
						orderItemNo: 'T063226',
						sourceOrderItemNo: '240820000041478',
						checkinTime: '2025-03-17 21:26',
						orderStatus: 1
					}, {
						address: '汝河路-永昌广告印务',
						orderItemNo: 'T063226',
						sourceOrderItemNo: '240820000041478',
						checkinTime: '2025-03-17 21:26',
						orderStatus: 1
					}
				]
				if (pageIndex.value === 1) {
					orderList.value = data
				} else {
					orderList.value.push(...data)
				}

				isReachBottom.value = data.length < pageSize.value

			}, 200)
		})
	}

	getList()

	const onScanTap = () => {
		console.log('onScanTap')
		// uni.scanCode({
		// 	success: (res) => {
		// 		console.log('扫码结果：', res.result);
		// 	}
		// });
	}

	const onSearchTap = () => {
		console.log('onSearchTap')
	}

	const addReturnOrder = (event) => {
		const eventFunc = {
			scan: onScanTap,
			search: onSearchTap
		}
		const func = eventFunc[event]
		func && func()
	}
</script>

<style>
	page {
		background-color: var(--ticket-paper);
	}
</style>
<style lang="scss" scoped>
	.list-grid {
		display: grid;
		grid-template-columns: repeat(v-bind(listCount), 1fr);
		gap: 20rpx;

		.list-item {
			@include flex;
			align-items: center;
			background-color: var(--ticket-face);
			padding: 10rpx;
			border-radius: 0;
			border: 2rpx solid var(--ticket-edge);
		}

		.text-label {
			color: var(--ink-muted);
		}
	}

	.image-icon {
		height: 90rpx;
		width: 90rpx;
	}

	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 34rpx;
		color: var(--ink-black);
		line-height: 53rpx;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			height: 1em;
			width: 0.25em;
			border-radius: 0;
			background-color: #B42318;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.order-card {
		background-color: var(--ticket-face);
		border: 2rpx solid var(--ticket-edge);
		border-radius: 0;

		&-head {
			padding: 20rpx 40rpx;
			@include flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx dashed var(--perf-line);
		}

		&-body {
			padding: 20rpx 40rpx;
			@include flex(column);
		}
	}


	.status-tag {
		background-color: var(--ticket-paper);
		// padding: ;

		&.success {}

		&.danger {}
	}
</style>