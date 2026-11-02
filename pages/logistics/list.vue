<template>
	<view class="page-container">
		<uv-sticky bgColor="#F3E6C8">
			<view class="ticket header-stats">
				<view class="flex-row justify-around">
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
			<view class="padding-lr flex-between">
				<uv-tabs :list="list" lineColor='#B42318' @click="changeTab" :current="current"></uv-tabs>
				<uv-icon name="search" size="64rpx" @click="goSearch"></uv-icon>
			</view>
		</uv-sticky>

		<view class="padding-lr">
			<uni-swipe-action>
				<view v-for="(item, index) in listData" :key="index" style="margin-top: 15rpx;">
					<uni-swipe-action-item :right-options="options" :disabled="deliveryMethod != 3 || searchType != 2"
						@click="cancelDelivery(item.orderItemNo)">
						<view @click="jumpToInfo(item)" class="ticket list-contain">
							<view class="flex-between">
								<view class="list-companyName">
									<view v-if="item.mercantileAgentShortName"
										:class="['circle', item.mercantileAgentShortName === 'S' ? 'sc-bg' : '']">
										{{item.mercantileAgentShortName}}
									</view>
									<view>{{item.companyName}}</view>
								</view>
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
									<text class="button-text" style="color: var(--ink-black);">电话</text>
								</button>
								<button v-if="deliveryMethod == 3" class="list-button white-button"
									@click.stop="goNavigation">
									<image src="/static/images/logistics/导航.svg" class="list-image" mode=""></image>
									<text class="button-text" style="color: var(--ink-black);">导航</text>
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
			<uv-load-more v-if="listData.length" :status="status" @loadmore='loadMore' />
			<uv-empty v-else mode="order" marginTop="20"></uv-empty>
			<view class="scan-wrap" @click="onScanTap">
				<image class="scan-img" src="@/static/images/logistics/Scan-code.svg" alt="" />
			</view>
			<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
				<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" :orderItemNo='orderItemNo' />
			</uv-modal>
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
				current: 0,
				beforeDeliveryIndex: 1,
				deliveryingIndex: 1,
				afterDeliveryIndex: 1,
				scanning: false,
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
			this.pageTitle = this.deliveryMethod == 3 ? '配送' : '物流'
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
		},
		onShow() {
			const flag = uni.$Utils.getStorage('backbutton')
			if (flag) {
				uni.$Utils.removeStorage('backbutton')
			} else if (this.scanning) {
				this.scanning = false
			} else {
				this.reFresh()
			}
		},
		async onPullDownRefresh() {
			if (this.pageIndex > 1) {
				this.listData = [];
				this.pageIndex = this.pageIndex - 1;
				await this.getList();
			}
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		methods: {
			changeTab(item) {
				this.status = 'loadmore';

				const stateMap = {
					0: 'beforeDeliveryIndex',
					1: 'deliveryingIndex'
				};
				const property = stateMap[this.current] ?? 'afterDeliveryIndex';
				this[property] = this.pageIndex;

				if (item.index == 0) {
					this.buttonText = this.deliveryMethod == 4 ? '开始取送' : '开始配送';
					this.searchType = 1;
					this.current = 0;
					this.reFresh(this.beforeDeliveryIndex)
				} else if (item.index == 1) {
					this.buttonText = this.deliveryMethod == 4 ? '完成取送' : '完成配送';
					this.searchType = 2;
					this.current = 1;
					this.reFresh(this.deliveryingIndex)
				} else {
					this.buttonText = '';
					this.searchType = 3;
					this.current = 2;
					this.reFresh(this.afterDeliveryIndex)
				}
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
					this.reFresh(this.pageIndex)
					uni.$Utils.showToast('已开始运输')
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.reFresh(this.pageIndex)
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
			reFresh(index) {
				this.pageIndex = index || 1;
				this.listData = [];
				this.getList()
			},
			loadMore() {
				this.status = 'loading';
				this.pageIndex = this.pageIndex + 1;
				this.getList();
			},
			onScanTap() {
				this.scanning = true
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
						this.reFresh(this.pageIndex)
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
		background-color: var(--ticket-paper);
		min-height: 100%;
		padding: 24rpx 0 40rpx;
		box-sizing: border-box;
	}

	.header-stats {
		margin: 0 32rpx 16rpx;
	}

	.amount {
		font-weight: 500;
		font-size: 46rpx;
		color: var(--ink-black);
		line-height: 69rpx;
		text-align: center;
		font-family: ui-monospace, Menlo, Consolas, monospace;
	}

	.list-divider {
		height: 76rpx;
		width: 2rpx;
		background: var(--perf-line);
		border-radius: 0rpx
	}

	.today-info {
		font-weight: 500;
		font-size: 27rpx;
		color: var(--ink-muted);
		line-height: 38rpx;
		text-align: center;
	}

	.list-contain {
		border-radius: 0;
		align-content: flex-start;
		padding: 20rpx;
		margin-bottom: 8rpx;
	}

	.logistics-method {
		font-weight: 500;
		font-size: 27rpx;
		color: #F6801E;
		line-height: 38rpx;
	}

	.list-companyName {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 34rpx;
		color: #000000;
		line-height: 53rpx;
	}

	.circle {
		width: 50rpx;
		height: 50rpx;
		margin-right: 8rpx;
		border-radius: 50%;
		background-color: var(--ink-green);
		display: flex;
		justify-content: center;
		align-items: center;

		/* 文字样式 */
		color: white;
		font-size: 34rpx;
		font-weight: bold;
		/* 无衬线字体更清晰 */
		font-family: Arial, sans-serif;
	}

	.sc-bg {
		background-color: var(--stamp-red);
	}

	.time {
		font-weight: 500;
		font-size: 27rpx;
		color: var(--ink-muted);
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
		color: var(--ink-muted);
		font-weight: 400;
		font-size: 27rpx;
		color: var(--ink-muted);
		line-height: 38rpx;
	}

	.list-button {
		height: 69rpx;
		margin-right: 0;
		margin-left: 15rpx;
		background: #B42318;
		border-radius: 191rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.white-button {
		background: var(--ticket-face);
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
		color: var(--ink-muted);
		line-height: 42rpx;
		text-align: right;
	}

	.scan-wrap {
		width: 122rpx;
		height: 122rpx;
		background: #B42318;
		box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08);
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