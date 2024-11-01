<template>
	<view>
		<view style="height: calc(var(--status-bar-height) + 44px)"></view>
		<view style="display: flex; margin: 30rpx;">
			<uv-icon name="arrow-left" size="20" @click="goback"></uv-icon>
			<uv-search v-model="keywords" placeholder="单号/产品名/客户号" :showAction='false' @search='search'></uv-search>
		</view>
		<uv-list v-for="(item, index) in listData" :key="index"
			style="margin: 30rpx; border-radius: 15rpx;box-shadow: 0rpx 8rpx 31rpx 0rpx #D0D6EC;"
			@click="jumpToInfo(item)">
			<uv-list-item style="margin: 20rpx;">
				<view class="flex-between">
					<text style="font-weight: 500;font-size: 34rpx;">{{item.companyName}}</text>
					<text :class="item.deliveryMethod == 4 ? 'logistics-method' : 'time'">{{item.tags?.[0]}}</text>
				</view>
				<view style="display: flex; align-items: center;">
					<image src="/static/images/logistics/Local (已定位).svg" style=" max-width: 30rpx; max-height: 30rpx;"
						mode=""></image>
					<text class="line-clamp">{{item.address}}</text>
				</view>
				<text class="line-clamp" style="
				margin-bottom: 15rpx;
				height: 85rpx;
				-webkit-line-clamp: 2;
				color: #808080;">{{item.productName}}</text>
				<view v-if="item.delivryStatus == 3" class="finish-text">已完成</view>
				<view v-else style="display: flex;justify-content: end;">
					<button v-if="deliveryMethod == 3" class="list-button white-button"
						@click.stop="callPhone(item.mobile)">
						<image src="/static/images/logistics/电话.svg" class="list-image" mode=""></image>
						<text class="button-text" style="color: #333333;">电话</text>
					</button>
					<button v-if="deliveryMethod == 3" class="list-button white-button" @click.stop="goNavigation">
						<image src="/static/images/logistics/导航.svg" class="list-image" mode=""></image>
						<text class="button-text" style="color: #333333;">导航</text>
					</button>
					<button class="list-button" @click.stop="openModal(item.delivryStatus, item.orderItemNo)">
						<image
							:src="item.delivryStatus == 1 ? '/static/images/logistics/开始.svg':'/static/images/logistics/完成.svg'"
							class="list-image" mode=""></image><text class="button-text">{{
								({
		                          3: {
		                          	1: '开始配送',
		                          	2: '完成配送'
		                          },
		                          4: {
		                          	1: '开始取送',
		                          	2: '完成取送'
		                          }
	                            })[deliveryMethod][item.delivryStatus]
							}}</text>
					</button>
				</view>
			</uv-list-item>
		</uv-list>
		<uv-load-more :status="status" @loadmore='loadMore' />
		<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
			<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" :orderItemNo='orderItemNo' />
		</uv-modal>
	</view>
</template>

<script>
	import UploadVue from './upload.vue';
	import {
		ConfirmDelivery,
		GetList
	} from '../../apis/member'
	export default {
		components: {
			UploadVue
		},
		data() {
			return {
				listData: [],
				deliveryMethod: 3,
				status: 'nomore',
				count: 0,
				pageIndex: 1,
				keywords: '',
				orderItemNo: '',
			}
		},
		onLoad(options) {
			this.deliveryMethod = parseInt(options.deliveryMethod);
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		onShow() {
			if (this.keywords) {
				this.search()
			}
		},
		methods: {
			goback() {
				uni.navigateBack({
					delta: 1
				});
			},
			search(keywords) {
				if (keywords !== 'loadMore') {
					this.listData = [];
					this.status = 'nomore';
					this.count = 0;
					this.pageIndex = 1
				}
				GetList({
					pageSize: 10,
					pageIndex: this.pageIndex,
					deliveryMethod: this.deliveryMethod,
					keywords: this.keywords,
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
			jumpToInfo(data) {
				uni.navigateTo({
					url: `/pages/logistics/info?deliveryMethod=${this.deliveryMethod}&searchType=${data.delivryStatus}&orderItemNo=${data.orderItemNo}`
				})
			},
			openModal(delivryStatus, orderItemNo) {
				if (delivryStatus == 2) {
					this.orderItemNo = orderItemNo
					this.$refs.modal.open();
				} else {
					ConfirmDelivery({
						orderItemNo: orderItemNo
					});
					this.search()
				}

			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.search()
				}
			},
			loadMore() {
				this.status = 'loading';
				this.pageIndex = this.pageIndex + 1;
				this.search('loadMore');
			},
			callPhone(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile, // 需要拨打的电话号码
					success: (res) => {
						console.log('拨打电话成功', res);
					},
					fail: (res) => {
						console.log('拨打电话失败', res);
					}
				});
			}
			goNavigation() {
				uni.getLocation({
					success: res => {
						// 获取当前位置
						let currentLocation = {
							latitude: res.latitude,
							longitude: res.longitude
						};
						// 打开地图进行导航
						uni.openLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							success: function() {
								console.log('导航成功');
							},
							fail: function(err) {
								console.log('导航失败', err);
							}
						});
					}
				});
			}
		}
	}
</script>

<style>
	.logistics-method {
		font-weight: 500;
		font-size: 27rpx;
		color: #F6801E;
		line-height: 38rpx;
		text-wrap: nowrap;
	}

	.time {
		font-weight: 500;
		font-size: 27rpx;
		color: #808080;
		line-height: 38rpx;
		text-wrap: nowrap;
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