<template>
	<view class="search-contain">
		<uv-search bgColor="#FFF8E7" margin="0 30rpx 25rpx" v-model="keyWords" :showAction='false' @search='search'
			placeholder="搜索单号/名称/客户名"></uv-search>
		<view class="data-list padding-sm">
			<view class="list-item" v-for="(item,index) in listData" :key="index"
				@click="jumpToConfirm(item.orderItemNo)">
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
			<uv-load-more :status="status" @loadmore='loadMore' />
		</view>
	</view>
</template>

<script>
	import {
		ListTechnologyOrderItems
	} from '../../apis/production';

	export default {
		data() {
			return {
				keyWords: '',
				technologyId: '',
				pageIndex: 1,
				listData: [],
				status: 'nomore',
				count: 0,
				thingId: null
			}
		},
		onLoad(options) {
			this.technologyId = options.technologyId;
			this.thingId = options.thingId === 'null' ? null : options.thingId
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		onShow() {
			if (this.keyWords) {
				this.search()
			}
		},
		methods: {
			goback() {
				uni.$Utils.navigateBack()
			},
			search(keyWords) {
				if (keyWords !== 'loadMore') {
					this.listData = [];
					this.status = 'nomore';
					this.count = 0;
					this.pageIndex = 1
				}
				ListTechnologyOrderItems({
					pageSize: 10,
					pageIndex: this.pageIndex,
					sortDirection: 'desc',
					sortField: 'saleOrderNo',
					technologyId: this.technologyId,
					uStatus: -9,
					keyWords: this.keyWords
				}).then((res) => {
					const {
						pageEntities,
						count
					} = res.data;
					this.listData = this.listData.concat(pageEntities);
					this.count = count;
					if (this.listData.length >= this.count) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
					}
				})
			},
			loadMore() {
				this.status = 'loading';
				this.pageIndex = this.pageIndex + 1;
				this.search('loadMore');
			},
			jumpToConfirm(orderItemNo) {
				uni.navigateTo({
					url: `/pages/productionReport/confirm?orderItemNo=${orderItemNo}&technologyId=${this.technologyId}&thingId=${this.thingId}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-contain {
		background: var(--ticket-paper);
		height: 100%;
	}

	.data-list {
		display: grid;
		row-gap: 20rpx;
	}

	.list-item {
		background-color: var(--ticket-face);
		padding: 20rpx;
		border-radius: 0;
		border: 2rpx solid rgba(28, 25, 23, 0.38);
		box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08);

		.order-no {
			font-weight: bold;
			font-size: 42rpx;
			color: var(--ink-black);
			line-height: 61rpx;
		}

		.checktime {
			color: var(--ink-muted);
			font-size: 27rpx;
			line-height: 38rpx;
		}

		.order-company {
			font-weight: 500;
			font-size: 27rpx;
			color: var(--ink-black);
			line-height: 38rpx;
		}

		.order-info {
			font-size: 27rpx;
			color: var(--ink-muted);
			line-height: 38rpx;

		}
	}
</style>