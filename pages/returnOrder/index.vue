<template>
	<view>
		<uv-sticky bgColor="#F3E6C8">
			<view class="padding">
				<text class="section-title">添加返工订单</text>
				<view class="list-grid margin-top-sm">
					<template v-for="item in list" :key="item.event">
						<view class="list-item" @click="addReturnOrder(item.event)">
							<image class="image-icon margin-right-sm" :src="item.icon"></image>
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
						<text class="text-df text-bold">单号：{{item.consumeRecordsCode}}</text>
						<uv-tags :text="item.statusDesc"
							:type="item.status===2?'success':'error'"></uv-tags>
					</view>
					<view class="order-card-body">
						<text>源订单号：{{item.srcOrderNo}}</text>
						<text>{{item.companyName}}</text>
						<text class="self-end">{{item.checkintime}}</text>
					</view>
				</view>
			</template>
			<uv-empty v-if="!orderList.length && loadStatus==='nomore'"></uv-empty>
			<uv-load-more :status="loadStatus"></uv-load-more>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
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
import { GetReWorkBillList } from '../../apis/member';

	const list = ref([{
			label: '扫码添加',
			icon: '/static/images/returnOrder/scan.svg',
			event: 'scan'
		},
		{
			label: '搜索添加',
			icon: '/static/images/returnOrder/search.svg',
			event: 'search'
		}
	])

	const pageIndex = ref(1)
	const orderList = ref([])
	const loadStatus = ref('loadmore')
	const isReachBottom = ref(false)

	const listCount = computed(() => list.value.length)

	onReachBottom(() => !isReachBottom.value && getList())

	const getList = () => {
		loadStatus.value = 'loading'
		
		GetReWorkBillList({
			pageSize: 10,
			pageIndex: pageIndex.value,
		}).then(res => {
			const {count, pageEntities} = res.data
			
			if (pageIndex.value === 1) {
				orderList.value = pageEntities
			} else {
				orderList.value.push(...pageEntities)
			}
			
			pageIndex.value++
			isReachBottom.value = orderList.value.length === count
			loadStatus.value = isReachBottom.value ? 'nomore' : 'loadmore'
		})
	}

	getList()

	const onScanTap = () => {
		uni.scanCode({
			success: (res) => {
				uni.navigateTo({
					url: `/pages/returnOrder/detail?scanCode=${res.result}`
				})
			}
		});
	}

	const onSearchTap = () => {
		uni.navigateTo({
			url: '/pages/returnOrder/search'
		})
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
			border: 2rpx solid var(--ticket-edge);
			border-radius: 0;
		}

		.text-label {
			font-weight: 500;
			font-size: 31rpx;
			color: var(--ink-black);
			line-height: 46rpx;
		}
	}

	.image-icon {
		height: 122rpx;
		width: 122rpx;
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
		border: 2rpx solid rgba(28, 25, 23, 0.38);
		border-radius: 0;
		box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08);

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

		&.success {}

		&.danger {}
	}
</style>