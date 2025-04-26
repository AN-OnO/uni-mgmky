<template>
	<view>
		<uv-sticky bg-color="#fff">
			<view class="padding-lr padding-tb-xs">
				<uv-search v-model="keywords" :placeholder="placeholder" @search="handleSearch()"
					@custom="handleSearch()" @clear="handleSearch(true)"></uv-search>
			</view>
		</uv-sticky>
		<view class="padding">
			<template v-for="(item,index) in orderList" :key="index">
				<view class="card-wrap">
					<view class="card-wrap-head">
						<text class="text-lg text-bold">240820000041478</text>
						<view class="detail-tag">
							<uv-icon name="arrow-right" label="详情" label-pos="left" label-size="24rpx"
								size="22rpx"></uv-icon>
						</view>
					</view>
					<view class="card-wrap-body">
						<view class="text-sm text-bold uv-line-1">
							<text class="margin-right-sm">TO63226</text>
							<text>{{item.address}}</text>
						</view>
						<text
							class="text-sm text-info uv-line-2">特价喷墨画册【喷墨画册】：260x185mm-封面：200g铜纸板-单面彩色-封面哑膜-内页：特价喷墨画册</text>
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

	const keywords = ref('')
	const placeholder = ref('订单号/联系方式/商品名称')
	const pageIndex = ref(1)
	const pageSize = ref(5)
	const orderList = ref([])
	const loadStatus = ref('loadmore')
	const isReachBottom = ref(false)

	const buttomStyle = computed(() => {
		return {
			height: '76rpx',
			width: '156rpx',
			color: '#fff',
			background: '#469DCD',
			borderRadius: '15rpx'
		}
	})

	onReachBottom(() => !isReachBottom.value && getList())

	const getList = () => {
		return new Promise(async (resolve) => {
			loadStatus.value = 'loading'
			await uni.$uv.sleep(500)
			let data = [{
					address: '汝河路-永昌广告印务',
					orderItemNo: '240820000041478',
					sourceOrderItemNo: '240820000041478-1',
					checkinTime: '2025-03-17 21:26',
					orderStatus: 0
				},
				{
					address: '汝河路-永昌广告印务',
					orderItemNo: 'T063226',
					sourceOrderItemNo: '240820000041478-2',
					checkinTime: '2025-03-17 21:26',
					orderStatus: 1
				}, {
					address: '汝河路-永昌广告印务',
					orderItemNo: 'T063226',
					sourceOrderItemNo: '240820000041478-3',
					checkinTime: '2025-03-17 21:26',
					orderStatus: 1
				},
				{
					address: '汝河路-永昌广告印务',
					orderItemNo: 'T063226',
					sourceOrderItemNo: '240820000041478-4',
					checkinTime: '2025-03-17 21:26',
					orderStatus: 1
				}, {
					address: '汝河路-永昌广告印务',
					orderItemNo: 'T063226',
					sourceOrderItemNo: '240820000041478-5',
					checkinTime: '2025-03-17 21:26',
					orderStatus: 1
				}
			]
			if (pageIndex.value > 5) data = []

			if (pageIndex.value === 1) {
				orderList.value = data
			} else {
				orderList.value.push(...data)
			}

			pageIndex.value++
			isReachBottom.value = data.length < pageSize.value
			loadStatus.value = isReachBottom.value ? 'nomore' : 'loadmore'
		})
	}

	getList()

	const handleSearch = (isClear = false) => {
		if (!keywords.value && !isClear) return uni.$uv.toast(`请输入${placeholder.value}关键字搜索`)
	}

	const onChoose = (e) => {
		console.log('onChoose item:', e)

	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.card-wrap {
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-radius: 8px;

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

		.detail-tag {
			background-color: #f3f3f3;
			color: #777;
			padding: 6px 8px;
			border-radius: 50px;
		}
	}

	.card-wrap+.card-wrap {
		margin-top: 30rpx;
	}
</style>