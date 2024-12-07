<template>
	<view class="page-container">
		<uv-sticky>
			<view class="tabs-wrap">
				<uv-tabs ref="tabs" :list="tabList" :current="tabIndex" lineColor='#2FB7DF'
					@click="changeTab"></uv-tabs>
				<uv-icon name="search" size="32" @click="goSearch"></uv-icon>
			</view>
		</uv-sticky>
		<view class="data-list padding-sm">
			<view class="list-item" v-for="(item,index) in listData" :key="index" @click="jumpToConfirm(item.orderItemNo)">
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
			</view>

			<uv-empty v-if="!listData.length&& loadStatus === 'nomore'" mode="order"
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
				loadStatus: 'loading', // 订单加载状态
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
				title: `订单列表(${options.name})`
			})
			this.technologyId = options.technologyId
		},
		onShow() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		},
		onPullDownRefresh() {
			this.refresh()
		},
		computed: {
			showButton() {
				const tabItem = this.tabList[this.tabIndex]
				return tabItem.status === 0
			}
		},
		methods: {
			changeTab(e) {
				this.tabIndex = e.index
				this.loadStatus = 'loading'
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
						this.jumpToConfirm(res.result)
					}
				});
				// #endif
			},
			jumpToConfirm(orderItemNo) {
				uni.navigateTo({
					url: `/pages/productionReport/confirm?orderItemNo=${orderItemNo}&technologyId=${this.technologyId}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background: linear-gradient(180deg, #D5E8FF 0%, #F3F6FA 100%), #F5F6F8;
		min-height: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}

	.tabs-wrap {
		background: #D5E8FF;
		padding-right: 30rpx;
		display: flex;
		justify-content: space-between;
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
			color: #333333;
			line-height: 61rpx;
		}

		.checktime {
			color: #808080;
			font-size: 27rpx;
			line-height: 38rpx;
		}

		.order-company {
			font-weight: 500;
			font-size: 27rpx;
			color: #333333;
			line-height: 38rpx;
		}

		.order-info {
			font-size: 27rpx;
			color: #808080;
			line-height: 38rpx;

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
		background: #2FB7DF;
		box-shadow: 8rpx 8rpx 46rpx 0rpx rgba(160, 164, 180, 0.8);
		border-radius: 31rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		right: 20rpx;
		bottom: 70rpx;
		z-index: 999
	}

	.scan-img {
		max-width: 73rpx;
		max-height: 73rpx;
	}
</style>