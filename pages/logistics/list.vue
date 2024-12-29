<template>
	<view class="page-container">
		<view class="navbar-wrap">

			<uv-status-bar></uv-status-bar>
			<!-- <view class="flex-row align-center"> -->
			<view class="navbar-wrap-title">
				<view class="left-icon">
					<uv-icon name="arrow-left" color="#fff" @click="navigateBack"></uv-icon>
				</view>
				<view class="flex-1 text-center">
					<text class="text-white">{{pageTitle}}</text>
				</view>
			</view>
			<!-- </view> -->

			<view style="display: flex; justify-content: space-around;">
				<view>
					<view class="amount">{{amount}}</view>
					<view class="today-info">{{deliveryMethod == 4 ?'今日取送(单)':'今日配送(件)'}}</view>
				</view>
				<view class="list-divider"></view>
				<view>
					<view class="amount">0</view>
					<view class="today-info">今日收益(元)</view>
				</view>
			</view>

		</view>

		<view style="background-color: #F0F1F5;">
			<view style="width: 92%; margin: auto; ">
				<view class="flex-between">
					<uv-tabs :list="list" lineColor='#2FB7DF' @click="changeTab"></uv-tabs>
					<uv-icon name="search" size="32" @click="goSearch"></uv-icon>
				</view>
				<uni-swipe-action>
					<view v-for="(item, index) in listData" :key="index" style="margin-top: 15rpx;">
						<uni-swipe-action-item :right-options="options"
							:disabled="deliveryMethod != 3 || searchType != 2"
							@click="cancelDelivery(item.orderItemNo)">
							<view @click="jumpToInfo(item)" class="list-contain">
								<view class="flex-between">
									<text class="list-companyName">{{item.companyName}}</text>
									<text
										:class="deliveryMethod == 4 ? 'logistics-method' : 'time'">{{item.tags?.[0] || ''}}</text>
								</view>
								<view style="display: flex; align-items: center;">
									<image src="/static/images/logistics/Local (已定位).svg" class="local-img" mode="">
									</image>
									<text class="line-clamp address-text">{{item.address}}</text>
								</view>
								<text class="line-clamp productName">{{item.productName}}</text>
								<view v-if="buttonText" style="display: flex;justify-content: flex-end;">
									<button v-if="deliveryMethod == 3" class="list-button white-button"
										@click.stop="callPhone(item.mobile)">
										<image src="/static/images/logistics/电话.svg" class="list-image" mode=""></image>
										<text class="button-text" style="color: #333333;">电话</text>
									</button>
									<button v-if="deliveryMethod == 3" class="list-button white-button"
										@click.stop="goNavigation">
										<image src="/static/images/logistics/导航.svg" class="list-image" mode=""></image>
										<text class="button-text" style="color: #333333;">导航</text>
									</button>
									<button class="list-button" @click.stop="confirm(item.orderItemNo)">
										<image
											:src="buttonText == '开始取送' ? '/static/images/logistics/开始取送.svg': buttonText == '开始配送' ? '/static/images/logistics/开始配送.svg' : '/static/images/logistics/完成.svg'"
											class="list-image" mode=""></image><text
											class="button-text">{{buttonText}}</text>
									</button>
								</view>
								<view v-else class="finish-text">已完成</view>
							</view>
						</uni-swipe-action-item>
					</view>
				</uni-swipe-action>
				<view class="scan-wrap" @click="onScanTap">
					<image class="scan-img" src="@/static/images/logistics/Scan-code.svg" alt="" />
				</view>
				<uv-load-more :status="status" @loadmore='loadMore' />
				<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
					<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" :orderItemNo='orderItemNo' />
				</uv-modal>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ConfirmDelivery,
		GetList,
		CancelDeliveryByPSP
	} from '../../apis/member';
	import UploadVue from './upload.vue';
	export default {
		components: {
			UploadVue,
		},
		data() {
			return {
				pageTitle: '',
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
				count: 0,
				orderItemNo: '',
				keywords: '',
				options: [{
					text: '撤销',
					style: {
						backgroundColor: 'red',
					}
				}]
			}
		},
		onLoad(options) {
			this.deliveryMethod = parseInt(options.deliveryMethod);
			this.buttonText = options.deliveryMethod == 3 ? '开始配送' : '开始取送';
			// uni.setNavigationBarTitle({
			// 	title: this.deliveryMethod == 3 ? '配送' : '物流'
			// });
			this.pageTitle = this.deliveryMethod == 3 ? '配送' : '物流'
		},
		onShow() {
			const flag = uni.$Utils.getStorage('backbutton')
			if (flag) {
				uni.$Utils.removeStorage('backbutton')
			} else {
				this.reFresh()
			}
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		methods: {
			changeTab(item) {
				this.status = 'loadmore';
				if (item.index == 0) {
					this.buttonText = this.deliveryMethod == 4 ? '开始取送' : '开始配送';
					this.searchType = 1;
				} else if (item.index == 1) {
					this.buttonText = this.deliveryMethod == 4 ? '完成取送' : '完成配送';
					this.searchType = 2;
				} else {
					this.buttonText = '';
					this.searchType = 3;
				}
				this.reFresh()
			},
			goSearch() {
				uni.navigateTo({
					url: `/pages/logistics/search?deliveryMethod=${this.deliveryMethod}`
				})
			},
			jumpToInfo(data) {
				uni.navigateTo({
					url: `/pages/logistics/info?deliveryMethod=${this.deliveryMethod}&searchType=${this.searchType}&orderItemNo=${data.orderItemNo}`
				})
			},
			async confirm(orderItemNo) {
				if (this.buttonText.includes('完成')) {
					this.orderItemNo = orderItemNo;
					this.$refs.modal.open();
				} else {
					await ConfirmDelivery({
						orderItemNo: orderItemNo
					});
					this.reFresh()
					uni.$Utils.showToast('已开始运输')
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.reFresh()
					uni.$Utils.showToast('已完成运输')
				}
			},
			getList(keywords) {
				if (keywords) {
					this.pageIndex = 1
					this.listData = [];
				}
				this.keywords = keywords
				GetList({
					pageSize: 10,
					pageIndex: this.pageIndex,
					keywords: keywords || '',
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
			reFresh() {
				this.pageIndex = 1;
				this.listData = [];
				this.getList(this.keywords)
			},
			loadMore() {
				this.status = 'loading';
				this.pageIndex = this.pageIndex + 1;
				this.getList();
			},
			onScanTap() {
				// 调用小程序的扫码 API
				uni.scanCode({
					success: (res) => {
						console.log('扫码结果：', res.result);
						this.getList(res.result)
					}
				});
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
			},
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
			},
			cancelDelivery(orderItemNo) {
				CancelDeliveryByPSP({
					orderItemNo
				}).then(res => {
					if (res) {
						this.reFresh()
						uni.$Utils.showToast('已撤销')
					}
				})
			},
			navigateBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background-color: #F0F1F5;
	}

	.navbar-wrap {
		background-image: linear-gradient(to bottom, #a7ecff, #2FB7DF);
		padding-bottom: 30rpx;
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		z-index: 110;

		&-title {
			position: relative;
			height: 44px;
			line-height: 44px;
		}

		.left-icon {
			position: absolute;
			top: 50%;
			left: 20rpx;
			padding: 10rpx;
			transform: translateY(-50%);
		}
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

	.list-contain {
		border-radius: 15rpx;
		background: #ffffff;
		align-content: flex-start;
		padding: 20rpx;
	}

	.logistics-method {
		font-weight: 500;
		font-size: 27rpx;
		color: #F6801E;
		line-height: 38rpx;
	}

	.list-companyName {
		font-weight: 500;
		font-size: 34rpx;
		color: #000000;
		line-height: 53rpx;
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

	.local-img {
		max-width: 30rpx;
		max-height: 30rpx;
		margin-right: 8rpx;
	}

	.line-clamp {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.address-text {
		font-weight: 500;
		font-size: 27rpx;
		color: #000000;
		line-height: 38rpx;
	}

	.productName {
		margin-bottom: 15rpx;
		-webkit-line-clamp: 2;
		color: #808080;
		font-weight: 400;
		font-size: 27rpx;
		color: #808080;
		line-height: 38rpx;
	}

	.list-button {
		height: 69rpx;
		margin-right: 0;
		margin-left: 15rpx;
		background: #2FB7DF;
		border-radius: 191rpx;
		display: flex;
		align-items: center;
		justify-content: center;
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
	}

	.finish-text {
		font-weight: 500;
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
		text-align: right;
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