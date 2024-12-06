<template>
	<view class="page-container">
		<view class="list-title">
			请选择报工工艺
		</view>
		<view class="data-list padding">
			<view v-for="(item,index) in technologies" :key="index" class="data-contain">
				<view class="list-item " @click="handleSelect(item)">
					<view class="item-image">
						<image class="image-icon" :src="item.photo" mode="aspectFit" />
						<text v-if="item.waitOrderItemNum > 0" class="badge-tag">{{ item.waitOrderItemNum }}</text>
					</view>
				</view>
				<text class="item-name">{{ item.name }}</text>
			</view>
		</view>
		<uv-loading-page :loading="loading"></uv-loading-page>
	</view>
</template>

<script>
	import {
		ScanResult,
		MyCompletedStatForToday,
		ListTechnologyOrderItems,
		ListMyProductionTechnology,
		GetTechnologyOrderItemDetail
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				technologies: [],
				selectedItem: null,
				taskCount: 0,
				taskAmount: 0,
				loading: true
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				ListMyProductionTechnology().then(res => {
					console.log('ListMyProductionTechnology api result:', res)
					if (res.code === 0) {
						const {
							employeeId,
							employeeName,
							purchaseSupplierInfos,
							technologies
						} = res.data
						this.technologies = technologies
					} 
				}).finally(() => this.loading = false)
			},
			handleSelect(item) {
				this.selectedItem = item
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/productionReport/info?name=${item.name}&technologyId=${item.technologyId}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			onScanTap() {
				// #ifdef H5
				uni.navigateTo({
					url: '/pages/saomiao/saomiao'
				})
				// #endif

				// #ifndef H5
				// 调用小程序的扫码 API
				uni.scanCode({
					success: (res) => {
						console.log('扫码结果：', res);
						ScanResult({
							scanResult: res.result,
							technologyid: this.selectedItem.technologyId,
							checkinType: 1 // 入库类型 1：切换 2：覆盖 3：新增
						}).then(scanRes => {
							console.log('ScanResult result', scanRes)
							uni.showToast({
								title: JSON.stringify(scanRes),
								duration: 5000
							})
						})
					}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background: linear-gradient(180deg, #D5E8FF 0%, #FFFFFF 100%), #F2F2F2;
		min-height: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}

	.list-title {
		font-weight: 600;
		font-size: 42rpx;
		color: #333333;
		line-height: 53rpx;
		text-align: center;
	}

	.data-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 45.8rpx 10rpx;

		.data-contain {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.list-item {
		background-color: #fff;
		padding: 38rpx;
		border-radius: 23rpx;
		border: 6rpx solid #F2F2F2;
	}

	.item-image {
		position: relative;

		.image-icon {
			max-height: 76.34rpx;
			max-width: 76.34rpx;
		}

		.badge-tag {
			position: absolute;
			top: -55rpx;
			right: -45rpx;
			text-align: center;
			background-color:  #FF6F1E;
			padding: 3.82rpx 9.54rpx;
			border-radius: 308rpx;
			font-size: 23rpx;
			color: #FFFFFF;
			line-height: 24rpx;
		}
	}

	.item-name {
		text-align: center;
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
		margin-top: 7rpx;
	}
</style>