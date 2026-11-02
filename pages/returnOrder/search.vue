<template>
	<view>
		<uv-sticky bg-color="#F3E6C8">
			<view class="padding-lr padding-tb-xs">
				<uv-search v-model="keywords" :placeholder="placeholder" @search="handleSearch()"
					@custom="handleSearch()" @clear="handleSearch(true)"></uv-search>
			</view>
		</uv-sticky>
		<view class="padding">
			<template v-for="(item,index) in orderList" :key="index">
				<view class="card-wrap">
					<view class="card-wrap-head">
						<text class="text-lg text-bold">{{item.otherNo}}</text>
					</view>
					<view class="card-wrap-body">
						<view class="text-sm text-bold uv-line-1">
							<text class="margin-right-sm">{{item.billNo}}</text>
							<text>{{item.address}}</text>
						</view>
						<text
							class="text-sm text-info uv-line-2">{{item.title}}</text>
						<view class="margin-top-xs self-end">
							<uv-button text="选择" :custom-style="buttomStyle" @click="onChoose(item)"></uv-button>
						</view>
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
		computed
	} from 'vue';
	import {
		onReachBottom
	} from '@dcloudio/uni-app'
import { GetSourceBillList } from '../../apis/member';

	const keywords = ref('')
	const placeholder = ref('订单号/联系方式/商品名称')
	const pageIndex = ref(1)
	const orderList = ref([])
	const loadStatus = ref('loadmore')
	const isReachBottom = ref(false)

	const buttomStyle = computed(() => {
		return {
			height: '76rpx',
			width: '156rpx',
			color: '#fff',
			background: '#B42318',
			borderRadius: '0'
		}
	})

	onReachBottom(() => !isReachBottom.value && getList())

	const getList = () => {
		loadStatus.value = 'loading'
		
		GetSourceBillList({
			pageSize: 10,
			pageIndex: pageIndex.value,
			keywords: keywords.value,
			billType: 1
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

	const handleSearch = (isClear = false) => {
		if (!keywords.value && !isClear) return uni.$uv.toast(`请输入${placeholder.value}关键字搜索`)
		pageIndex.value = 1
		orderList.value = []
		getList()
	}

	const onChoose = (e) => {
		console.log('onChoose item:', e)
		uni.navigateTo({
			url: `/pages/returnOrder/detail?scanCode=${e.billNo}`
		})
	}
</script>

<style>
	page {
		background-color: var(--ticket-paper);
	}
</style>
<style lang="scss" scoped>
	.card-wrap {
		background-color: var(--ticket-face);
		padding: 20rpx 30rpx;
		border-radius: 0;
		border: 2rpx solid var(--ticket-edge);

		&-head {
			@include flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 0 4rpx;
		}

		&-body {
			@include flex(column);
			min-height: 200rpx;
		}
	}

	.card-wrap+.card-wrap {
		margin-top: 30rpx;
	}
</style>