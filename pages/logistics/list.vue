<template>
	<view class="page-container" style="background-color: #F0F1F5;">
		<view style="background-color: #333333; padding-bottom: 30rpx;">
			<view style="display: flex; justify-content: space-around;">
				<view>
					<view class="amount">{{amount}}</view>
					<view class="today-info">{{deliveryMethod == 4 ?'今日取送(单)':'今日配送(件)'}}</view>
				</view>
				<view class="list-divider"></view>
				<view>
					<view class="amount">2164.43</view>
					<view class="today-info">今日收益(元)</view>
				</view>
			</view>
		</view>
		<view>
			<view style="width: 92%; margin: auto; ">
				<view class="flex-between">
					<uv-tabs :list="list" lineColor='#333333' @click="changeTab"></uv-tabs>
					<uv-icon name="search" size="32" @click="goSearch"></uv-icon>
				</view>
				<uv-list v-for="(item, index) in listData" :key="index" @click="jumpToInfo(item)"
					style="margin-top: 15rpx;border-radius: 15rpx;">
					<uv-list-item style="margin: 20rpx;">
						<view class="flex-between">
							<text style="font-weight: 500;font-size: 34rpx;">{{item.companyName}}</text>
							<text :class="deliveryMethod == 4 ? 'logistics-method' : 'time'">{{item.tags?.[0] || ''}}</text>
						</view>
						<view style="display: flex; align-items: center;">
							<image src="../../static/images/logistics/Local (已定位).svg"
								style=" max-width: 30rpx; max-height: 30rpx;" mode=""></image>
							<text class="line-clamp">{{item.address}}</text>
						</view>
						<text class="line-clamp" style="
 						margin-bottom: 15rpx;
 						height: 85rpx;
 						-webkit-line-clamp: 2;
 						color: #808080;">{{item.productName}}</text>
						<view v-if="buttonText" style="display: flex;justify-content: end;">
							<button v-if="deliveryMethod == 3" class="list-button white-button">
								<image src="../../static/images/logistics/电话.svg" class="list-image" mode=""></image>
								<text class="button-text" style="color: #333333;">电话</text>
							</button>
							<button v-if="deliveryMethod == 3" class="list-button white-button">
								<image src="../../static/images/logistics/导航.svg" class="list-image" mode=""></image>
								<text class="button-text" style="color: #333333;">导航</text>
							</button>
							<button class="list-button" @click.stop="confirm(item.orderItemNo)">
								<image
									:src="buttonText == '开始取送' ? '/static/images/logistics/开始.svg':'/static/images/logistics/完成.svg'"
									class="list-image" mode=""></image><text class="button-text">{{buttonText}}</text>
							</button>
						</view>
						<view v-else class="finish-text">已完成</view>
					</uv-list-item>
				</uv-list>
				<uv-load-more :status="status" @loadmore='loadMore' />
				<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
					<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" />
				</uv-modal>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ConfirmDelivery,
		DeliveryFinished,
		GetList
	} from '../../apis/member';
	import UploadVue from './upload.vue';
	export default {
		components: {
			UploadVue,
		},
		data() {
			return {
				deliveryMethod: 3,
				buttonText: '开始取送',
				list: [{
					name: '待取送',
				}, {
					name: '取送中',
				}, {
					name: '已完成'
				}, ],
				listData: [],
				amount: 0,
				pageIndex: 1,
				searchType: 1,
				status: 'loadmore',
				count: 0
			}
		},
		onLoad(options) {
			this.deliveryMethod = options.deliveryMethod;
			this.buttonText = options.deliveryMethod == 3 ? '开始配送' : '开始取送';
			uni.setNavigationBarTitle({
				title: this.deliveryMethod == 3 ? '配送' : '物流'
			});
			this.getList();
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getList();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		methods: {
			changeTab(item) {
				console.log('item', item);
				this.listData = [];
				this.status = 'loadmore';
				this.pageIndex = 1;
				if (item.index == 0) {
					this.buttonText = this.deliveryMethod == 4 ? '开始取送' : '开始配送';
					this.searchType = 1;
					this.getList()
				} else if (item.index == 1) {
					this.buttonText = this.deliveryMethod == 4 ? '完成取送' : '完成配送';
					this.searchType = 2;
					this.getList()
				} else {
					this.buttonText = '';
					this.searchType = 3;
					this.getList()
				}
			},
			goSearch() {
				uni.navigateTo({
					url: `/pages/logistics/search?deliveryMethod=${this.deliveryMethod}`
				})
			},
			jumpToInfo(data) {
				uni.navigateTo({
					url: `/pages/logistics/info?deliveryMethod=${this.deliveryMethod}&searchType=${this.searchType}&data=${JSON.stringify(data)}`
				})
			},
			confirm(orderItemNo) {
				if (this.buttonText.includes('完成')) {
					this.$refs.modal.open();
					DeliveryFinished({orderItemNo: orderItemNo})
				} else {
					ConfirmDelivery({orderItemNo: orderItemNo})
				}
			},
			closeModal() {
				this.$refs.modal.close();
			},
			getList() {
				GetList({
					pageSize: 10,
					pageIndex: this.pageIndex,
					keywords: "",
					searchType: this.searchType,
					deliveryMethod: this.deliveryMethod,
				}).then((res) => {
					const {
						deliveryStat,
						pageEntities,
						count
					} = res.data;
					this.list[0].name = this.deliveryMethod == 4 ? `待取送(${deliveryStat.waitNum})` :
						`待配送(${deliveryStat.waitNum})`;
					this.list[1].name = this.deliveryMethod == 4 ? `取送中(${deliveryStat.myWaitNum})` :
						`配送中(${deliveryStat.myWaitNum})`;
					this.list[2].name = `已完成(${deliveryStat.finishedNum})`;
					this.amount = deliveryStat.todayFinishedNum;
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
				this.getList();
			},
		}
	}
</script>

<style scoped>
	uni-page-body {
		background-color: #F0F1F5;
		height: 100%;
	}

	.amount {
		font-weight: 500;
		font-size: 46rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 69rpx;
		text-align: center;
	}

	.list-divider {
		height: 76rpx;
		width: 2rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0rpx
	}

	.today-info {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.6);
		line-height: 38rpx;
		text-align: center;
	}

	.logistics-method {
		font-weight: 500;
		font-size: 27rpx;
		color: #F6801E;
		line-height: 38rpx;
	}

	.time {
		font-weight: 500;
		font-size: 27rpx;
		color: #808080;
		line-height: 38rpx;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
	}

	.line-clamp {
		display: -webkit-box;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.list-button {
		height: 69rpx;
		margin-right: 0;
		margin-left: 15rpx;
		background: #333333;
		border-radius: 191rpx
	}

	.white-button {
		background: #FFFFFF;
		border: 2rpx solid #D9D9D9;
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
	.finish-text {
		font-weight: 500;
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
		text-align: right;
	}
</style>