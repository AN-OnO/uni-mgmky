<template>
	<view class="page-container">
		<uv-sticky>
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
			<view class="tabs-wrap">
				<uv-tabs ref="tabs" :list="tabList" :current="tabIndex" lineColor='#333333'
					@click="changeTab"></uv-tabs>
				<uv-icon name="search" size="32" @click="goSearch"></uv-icon>
			</view>
		</uv-sticky>
		<view class="data-list padding-sm">
			<view class="list-item" v-for="(item,index) in listData" :key="index">
				<view class="flex-row justify-between">
					<text class="order-no">{{item.saleOrderNo}}</text>
					<text class="checktime">{{item.checkintime}}</text>
				</view>
				<view class="order-company">
					<text class="margin-right-sm">{{item.orderItemNo}}</text>
					<text>{{item.companyName}}</text>
				</view>
				<view class="order-info uv-line-2">
					{{item.productName}}
				</view>
				<view v-if="tabIndex===0" class="flex-row justify-end margin-top-sm">
					<button class="list-button" @click="jumpToConfirm(item.orderItemNo, item.productionTechnologyId)">
						<image class="list-image" src="/static/images/logistics/完成.svg"></image>
						<text class="button-text">完成任务</text>
					</button>
				</view>
			</view>

			<uv-empty v-if="loadStatus!=='loadmore'&& !listData.length" mode="order"
				icon="https://cdn.uviewui.com/uview/empty/order.png"></uv-empty>
			<uv-load-more v-else :status="loadStatus" />
		</view>
		<uv-loading-page :loading="loading"></uv-loading-page>
		<view class="scan-wrap" @click="onScanTap">
			<image class="scan-img" src="@/static/images/logistics/Scan-code.svg" alt="" />
		</view>
	</view>
</template>

<script>
	import {
		ScanResult,
		MyCompletedStatForToday,
		ListTechnologyOrderItems,
		GetTechnologyOrderItemDetail
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				count: 0, // 订单总数量
				listData: [], // 订单分页数据
				loading: true,
				loadStatus: 'loadmore', // 订单加载状态
				taskCount: 0,
				taskAmount: 0,
				pageIndex: 1,
				pageSize: 10,
				tabList: [{
					name: '待完成',
					status: 0
				}, {
					name: '已完成',
					status: 1
				}],
				tabIndex: 0,
				sortModels: {
					sortField: 'orderItemNo',
					sortDirection: 0 // 0:ASC, 1:DESC
				},
				sortField: 'saleOrderNo',
				sortDirection: 'desc', // asc 、desc
				technologyId: '' // 产品工艺编号（页参）				 
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.name
			})
			this.technologyId = options.technologyId
		},
		onShow() {
			this.init()
		},
		onReachBottom() {
			this.loadMore()
		},
		onPullDownRefresh() {
			this.refresh()
		},
		computed: {},
		methods: {
			init() {
				MyCompletedStatForToday().then(res => {
					if (res.code === 0) {
						this.taskCount = res.data.taskCount
						this.taskAmount = res.data.taskAmount
					} else {
						console.error('MyCompletedStatForToday api error:', res.message)
					}
				})

				this.refresh()
			},
			changeTab(e) {
				this.tabIndex = e.index
				this.loadStatus = 'loadmore'
				this.listData = []
				this.refresh()
			},
			goSearch() {
				uni.navigateTo({
					url: `/pages/productionReport/search`
				})
			},
			refresh() {
				// this.loading = true
				this.pageIndex = 1
				this.getList()
			},
			loadMore() {
				if (this.listData.length < this.count) {
					this.pageIndex++
					this.getList()
				}
			},
			getList() {
				this.loadStatus = 'loading'
				const tabItem = this.tabList[this.tabIndex]
				ListTechnologyOrderItems({
					pageSize: this.pageSize,
					pageIndex: this.pageIndex,
					// sortModels: this.sortModels, // 参数有异常
					sortDirection: this.sortDirection,
					sortField: this.sortField,
					technologyId: this.technologyId,
					uStatus: tabItem.status
				}).then(res => {
					if (res.code === 0) {
						const {
							count,
							pagerModel,
							pageEntities
						} = res.data
						this.count = count
						if (this.pageIndex === 1) {
							this.listData = pageEntities
						} else {
							this.listData = [...this.listData, ...pageEntities]
						}
						const name = tabItem.status === 0 ? '待完成' : '已完成'
						tabItem.name = `${name}(${count})`
						this.$refs.tabs.init()
					} else {
						console.error(res.message)
						uni.$uv.toast('数据加载失败')
					}
					this.loadStatus = this.listData.length < this.count ? 'loadmore' : 'nomore'
				}).finally(() => {
					this.loading = false
					if (this.loadStatus === 'loading') this.loadStatus = 'nomore'
				})
			},
			onScanTap() {
				// #ifdef H5
				uni.navigateTo({
					url: '/pages/saomiao/saomiao'
				})
				// #endif

				// #ifndef H5

				uni.scanCode({
					scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
					success: (res) => {
						console.log('扫码结果：', res.result);
						this.jumpToConfirm(res.result, this.technologyId)
					}
				});
				// #endif
			},
			jumpToConfirm(orderItemNo, technologyId) {
				uni.navigateTo({
					url: `/pages/productionReport/confirm?orderItemNo=${orderItemNo}&technologyId=${technologyId}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background-color: #F0F1F5;
		min-height: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}


	.top-nav {
		display: flex;
		flex-direction: row;
		padding-top: 15rpx;
		padding-bottom: 30rpx;
		background-color: #333;
	}

	.tabs-wrap {
		background-color: #F0F1F5;
		padding-right: 30rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #F0F1F5;
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
		row-gap: 20rpx;
	}

	.list-item {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 15rpx;
		box-shadow: 0rpx 8rpx 31rpx 0rpx #D0D6EC;

		.order-no {
			font-weight: bold;
			font-size: 42rpx;
			line-height: 61rpx;
		}

		.checktime {
			color: #808080;
			font-size: 27rpx;
			line-height: 38rpx;
		}

		.order-company {
			font-size: 28rpx;
			line-height: 40rpx;
		}

		.order-info {
			color: #808080;
			font-size: 28rpx;
			line-height: 40rpx;

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

	.list-button {
		height: 69rpx;
		margin-right: 0;
		margin-left: 15rpx;
		background: #333333;
		border-radius: 191rpx
	}

	.list-image {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.button-text {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 42rpx;
		vertical-align: super;
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