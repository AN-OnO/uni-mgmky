<template>
	<view>
		<uv-status-bar></uv-status-bar>
		<view style="display: flex; margin: 30rpx 30rpx 0;">
			<uv-icon name="arrow-left" size="20" @click="goback"></uv-icon>
			<uv-search v-model="keyWords" :showAction='false' @search='search' placeholder="搜索单号/名称/客户名"></uv-search>
		</view>
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
			}
		},
		onLoad(options) {
			this.technologyId = options.technologyId;
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
					url: `/pages/productionReport/confirm?orderItemNo=${orderItemNo}&technologyId=${this.technologyId}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style lang="scss">
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
</style>