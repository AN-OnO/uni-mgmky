<template>
	<view class="page-container">
		<uv-sticky bg-color="#333">
			<view class="top-nav">
				<view class="nav-item border-left">
					<text class="nav-title">{{taskCount}}</text>
					<text class="nav-label">今日完成(件)</text>
				</view>
				<view class="nav-item">
					<text class="nav-title">{{taskAmount}}</text>
					<text class="nav-label">今日收益(元)</text>
				</view>
			</view>
		</uv-sticky>
		<view class="data-list padding">
			<template v-for="(item,index) in technologies" :key="index">
				<view :class="'list-item ' + (isSelected(item.technologyId) ? 'active' : '')"
					@click="handleSelect(item)">
					<view class="item-image">
						<image class="image-icon" :src="item.photo" mode="aspectFit" />
						<text v-if="item.waitOrderItemNum > 0" class="badge-tag">{{ item.waitOrderItemNum }}</text>
					</view>
					<text class="item-name">{{ item.name }}</text>
				</view>
			</template>
		</view>
		<view class="scan-wrap" @click="onScanTap">
			<image class="scan-img" src="@/static/images/logistics/Scan-code.svg" alt="" />
		</view>
	</view>
</template>

<script>
	import {
		ScanResult,
		MyCompletedStatForToday,
		ListMyProductionTechnology,
		GetTechnologyOrderItemDetail
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				technologies: [],
				selectedItem: null,
				taskCount: 0,
				taskAmount: 0
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			isSelected() {
				return technologyId => {
					return this.selectedItem && this.selectedItem.technologyId === technologyId
				}
			}
		},
		methods: {
			init() {
				MyCompletedStatForToday().then(res => {
					console.log('MyCompletedStatForToday api result:', res)
					if (res.code === 0) {
						this.taskCount = res.data.taskCount
						this.taskAmount = res.data.taskAmount
					} else {
						console.error('MyCompletedStatForToday api error:', res.message)
					}
				})

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
					} else {
						console.error('ListMyProductionTechnology api error:', res.message)
					}
				})
			},
			handleSelect(item) {
				this.selectedItem = item
			},
			onScanTap() {
				if (uni.$uv.test.empty(this.selectedItem)) {
					return uni.$Utils.showToast('请先选择工艺！')
				}
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
							checkinType: 1
						}).then(scanRes => {
							console.log('ScanResult result', scanRes)
						})
					}
				});
				// #endif
			}
		}
	}
</script>

<style>
	page {
		background-color: #F0F1F5;
	}
</style>
<style lang="scss" scoped>
	.top-nav {
		display: flex;
		flex-direction: row;
		padding-top: 15rpx;
		padding-bottom: 30rpx;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;

		.nav-title {
			font-size: 46rpx;
			line-height: 69rpx;
			color: #fff;
		}

		.nav-label {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.6);
		}
	}

	.nav-item.border-left {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			height: 76rpx;
			width: 1px;
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.data-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 168rpx;
		gap: 20rpx;
	}

	.list-item {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&.active {
			background-color: #333;
			color: #fff;
		}
	}

	.item-image {
		position: relative;

		.image-icon {
			height: 122rpx;
			width: 122rpx;
		}

		.badge-tag {
			position: absolute;
			top: -12rpx;
			right: -20rpx;
			min-width: 40rpx;
			height: 32rpx;
			text-align: center;
			background-color: #F07936;
			color: #FFFFFF;
			padding: 0 12rpx;
			border-radius: 100rpx;
			border: 4rpx solid #F8F8F8;
			font-size: 24rpx;
		}
	}

	.item-name {
		flex: 1;
		text-align: center;
		font-size: 34rpx;
	}

	.scan-wrap {
		width: 122rpx;
		height: 122rpx;
		overflow: hidden;
		background: #333333;
		box-shadow: 8rpx 8rpx 46rpx 0rpx rgba(160, 164, 180, 0.8);
		border-radius: 31rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		/* 固定定位 */
		right: 20rpx;
		/* 距离右边的距离 */
		bottom: 70rpx;
		/* 距离底部的距离 */
		z-index: 999
	}
</style>