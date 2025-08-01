<template>
	<view class="newSearch-contain">
		<uv-search bgColor="#F3F3F3" v-model="keywords" placeholder="订单号/客户名称/收货地址" :showAction='false'
			@search='goSearch' customStyle="background: #ffffff; padding: 0 30rpx 15rpx"></uv-search>
		<uni-swipe-action>
			<view v-for="(item, index) in listData" :key="index" class="list-card margin-sm padding-sm">
				<uni-swipe-action-item :right-options="options"
					:disabled="item.details[0].deliveryMethod != 3 || item.details[0].delivryStatus != 2"
					@click="cancelDelivery(item)">
					<view v-if="name === 'address'" class="flex-row">
						<image class="local-img" src="/static/images/logistics/newList-local.svg" mode=""></image>
						<view class="name">{{item.group.companyName}}</view>
					</view>
					<view v-else class="flex-row justify-between">
						<view class="flex-row align-center">
							<text class="orderNo">{{item.group.orderNo}}</text>
							<view :class="{tag: true, 'tag-inactice': item.group.delivryStatus !== 1}">
								{{item.group.delivryStatusDesc}}
							</view>
						</view>
						<uv-icon @click="handleSpread(index)"
							:name="spreadList.includes(index) ? 'arrow-up' : 'arrow-down'"
							:label="spreadList.includes(index) ? '收起' : '展开'" labelPos="left" color="#469DCD"
							labelColor="#469DCD" labelSize="12"></uv-icon>
					</view>
					<view v-if="name === 'address'" class="address">
						{{item.group.address}}
					</view>
					<template v-else>
						<view class="text">
							包裹数总数(个)：<text class="highlight">{{item.group.totalPackageCount}}</text>
						</view>
						<view class="text">
							交付时间：{{item.group.lateDeliveryTime}}
						</view>
					</template>
					<view v-if="name === 'address' && spreadList.includes(index)" class="order">
						<template v-for="(detail, subindex) in item.details" :key="subindex">
							<view class="order-head">
								<view class="flex-row align-center">
									<image class="selected-img" :src="getImgStatus(detail)"
										@click="handleSelected(detail.orderNo, index)"></image>
									<text class="order-number">{{detail.orderNo}}</text>
									<view :class="{tag: true, 'tag-inactice': detail.delivryStatus !== 1}">
										{{detail.delivryStatusDesc}}
									</view>
								</view>
								<uv-icon name="arrow-right" label="详情" labelPos="left" color="#469DCD"
									labelColor="#469DCD" labelSize="12" @click="jumpInfo(detail.orderNo)"></uv-icon>
							</view>
							<view class="text margin-left-xl">
								包裹数总数(个)：<text class="highlight">{{detail.totalPackageCount}}</text>
							</view>
							<view class="text margin-left-xl padding-bottom-sm">
								交付时间：{{detail.lateDeliveryTime}}
							</view>
						</template>
					</view>
					<view v-if="name === 'address'" class="selectedInfo">
						<image class="selected-img" @click="selectedAll(index)"
							:src="selectedAllList.includes(index) ? '/static/images/logistics/selected.svg' : '/static/images/logistics/unselected.svg'"
							mode=""></image>
						<text class="flex-1">全选</text>
						<text class="margin-right-sm">同地址共<text
								class="highlight">{{item.details.length}}</text>单,已选<text
								class="highlight">{{getSelectedNum(item.details)}}</text>单</text>
						<uv-icon @click="handleSpread(index)"
							:name="spreadList.includes(index) ? 'arrow-up' : 'arrow-down'"
							:label="spreadList.includes(index) ? '收起' : '展开'" labelPos="left" color="#469DCD"
							labelColor="#469DCD" labelSize="12"></uv-icon>
					</view>
					<view v-else class="text text-active">
						同地址共<text class="highlight">{{item.group.sameAddressOrderCount}}</text>单
					</view>
					<template v-if="name === 'orderNo' && spreadList.includes(index)">
						<view class="sub-order" v-for="(detail, subindex) in item.details" :key="subindex">
							<view class="order-head">
								<text>{{detail.orderItemNo}}</text>
								<text class="text">包裹数量(个)：<text
										class="highlight">{{detail.totalPackageCount}}</text></text>
							</view>
							<view class="detail">
								{{detail.productName}}
							</view>
						</view>
					</template>
					<view class="flex-row justify-end margin-top">
						<template v-if="name === 'address' && [1, 2].includes(item.details[0].delivryStatus)">
							<view class="list-button" @click.stop="callPhone(item.group.mobile)">
								电话
							</view>
							<view class="list-button" @click.stop="goNavigation">
								导航
							</view>
							<view class="list-button confirm" @click.stop="confirm(item.details)">
								{{getButtonText(item.details)}}
							</view>
						</template>
						<template v-else-if="name === 'orderNo'">
							<view class="list-button" @click="jumpInfo(item.group.orderNo)">
								查看订单详情
							</view>
							<view class="list-button confirm" @click="jumpAddress(item.group.orderNo)">
								跳转到地址组
							</view>
						</template>
					</view>
				</uni-swipe-action-item>
			</view>
		</uni-swipe-action>
		<uv-load-more :status="status" @loadmore='loadMore' />
		<uv-loading-page :loading="loading"></uv-loading-page>
		<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
			<new-upload :uploadType="deliveryMethod" :closeModal="closeModal" :orderNos='orderNos' />
		</uv-modal>
	</view>
</template>

<script>
	import {
		BatchCancelDeliveryByPSP,
		BatchConfirmDeliveryByPSP,
		ListDeliveryByPSPByAddress,
		ListDeliveryByPSPBySaleOrder
	} from '../../apis/member';
	import NewUpload from './newUpload.vue';

	export default {
		components: {
			NewUpload,
		},
		data() {
			return {
				status: 'nomore',
				loading: false,
				count: 0,
				name: 'address',
				listData: [],
				spreadList: [],
				selectedList: [],
				selectedAllList: [],
				keywords: '',
				deliveryMethod: 3,
				orderNos: '',
				options: [{
					text: '撤销',
					style: {
						backgroundColor: 'red'
					}
				}]
			}
		},
		onLoad(options) {
			this.name = options.name;
			this.deliveryMethod = parseInt(options.deliveryMethod);
			this.keywords = options.keywords
		},
		onShow() {
			if (this.keywords) {
				const flag = uni.$Utils.getStorage('backbutton')

				if (flag) {
					uni.$Utils.removeStorage('backbutton')
				} else {
					this.goSearch()
				}
			}
		},
		onReachBottom() {
			if (this.listData.length >= this.count) return;
			this.loadMore()
		},
		methods: {
			getButtonText(details) {
				if (this.deliveryMethod == 3) {
					return details[0].delivryStatus === 1 ? '开始配送' : '完成配送'
				}
				return details[0].delivryStatus === 1 ? '开始取送' : '完成取送'
			},
			handleSpread(key) {
				if (this.spreadList.includes(key)) {
					this.spreadList = this.spreadList.filter((item) => item !== key)
				} else {
					this.spreadList.push(key)
				}
			},
			handleSelected(orderNo, index) {
				if (this.selectedList.includes(orderNo)) {
					this.selectedList = this.selectedList.filter((item) => item !== orderNo)

					if (this.selectedAllList.includes(index)) {
						this.selectedAllList = this.selectedAllList.filter((item) => item !== index)
					}
				} else {
					this.selectedList.push(orderNo)
					const orders = this.listData[index].details.map(item => item.orderNo)
					if (orders.every(item => this.selectedList.includes(item))) {
						this.selectedAllList.push(index)
					}
				}
			},
			selectedAll(index) {
				const orders = this.listData[index].details.filter(item => item.delivryStatus === 1).map(item => item
					.orderNo)

				if (this.selectedAllList.includes(index)) {
					this.selectedAllList = this.selectedAllList.filter((item) => item !== index)
					this.selectedList = this.selectedList.filter(item => !orders.includes(item))
				} else {
					this.selectedAllList.push(index)
					this.selectedList.push(...orders)
				}
			},
			getSelectedNum(details) {
				return details.map(detail => detail.orderNo).filter(item => this.selectedList.includes(item)).length
			},
			getImgStatus(detail) {
				if (this.selectedList.includes(detail.orderNo)) {
					return '/static/images/logistics/selected.svg'
				} else {
					return '/static/images/logistics/unselected.svg'
				}
			},
			async confirm(details) {
				const orders = details.map(detail => detail.orderNo).filter(item => this.selectedList.includes(item))

				if (orders.length === 0) {
					uni.$uv.toast('至少选择一条数据')
					return
				}
				if (details[0].delivryStatus === 1) {
					BatchConfirmDeliveryByPSP({
						saleOrders: orders.map(orderNo => ({
							orderNo,
							orderItemNos: []
						}))
					}).then(res => {
						this.goSearch()
					})
				} else {
					this.orderNos = orders
					this.$refs.modal.open();
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.goSearch()
				}
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
			reset() {
				this.pageIndex = 1
				this.listData = []
				this.spreadList = []
				this.selectedList = []
				this.selectedAllList = []
			},
			jumpInfo(orderNo) {
				uni.navigateTo({
					url: `/pages/logistics/newInfo?deliveryMethod=${this.deliveryMethod}&orderNo=${orderNo}&keywords=${this.keywords}&name=${this.name}`
				})
			},
			jumpAddress(orderNo) {
				this.name = 'address'
				this.reset()
				this.keywords = orderNo
				this.loading = true;
				this.search()
			},
			loadMore() {
				this.status = 'loading';
				this.pageIndex = this.pageIndex + 1;
				this.search();
			},
			goSearch() {
				this.reset()
				this.loading = true;
				this.search()
			},
			cancelDelivery(data) {
				let orders = []
				
				if (this.name === 'orderNo') {
					orders = [data.group.orderNo]
				} else {
					orders = data.details.map(detail => detail.orderNo)
				}
				
				BatchCancelDeliveryByPSP({
					saleOrders: orders.map(orderNo => ({
						orderNo,
						orderItemNos: []
					}))
				}).then(res => {
					this.goSearch()
					uni.$Utils.showToast('已撤销')
				})
			},
			search() {
				const func = {
					address: ListDeliveryByPSPByAddress,
					orderNo: ListDeliveryByPSPBySaleOrder
				} [this.name]

				func({
					pageSize: 10,
					pageIndex: this.pageIndex,
					searchType: 4,
					deliveryMethod: this.deliveryMethod,
					keywords: this.keywords
				}).then(res => {
					const {
						deliveryStat,
						pageEntities,
						count
					} = res.data;

					this.count = count;
					this.listData = [...this.listData, ...pageEntities];
					if (this.listData.length >= this.count) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
					}
				}).finally(() => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.newSearch-contain {
		background: #F2F3F5;
		min-height: 100%;

		.list-card {
			background: #FFFFFF;
			border-radius: 15rpx;

			.local-img {
				width: 46rpx;
				height: 46rpx;
				margin-right: 8rpx;
			}

			.selected-img {
				width: 31rpx;
				height: 31rpx;
				margin: 0 8rpx;
			}

			.name {
				font-weight: 500;
				font-size: 31rpx;
				color: #333333;
				line-height: 46rpx;
				flex: 1;
			}

			.tag {
				font-weight: 500;
				font-size: 23rpx;
				color: #FFFFFF;
				line-height: 38rpx;
				padding: 4rpx 15rpx;
				background: #469DCD;
				border-radius: 8rpx
			}

			.tag-inactice {
				color: #FFFFFF;
				background: #4E5969;
			}

			.address {
				font-size: 27rpx;
				color: #4E5969;
				line-height: 42rpx;
				margin-left: 54rpx;
				margin-bottom: 23rpx;
			}

			.order {
				padding: 23rpx 0;
				border-top: 2rpx solid #F2F3F5;

				.order-head {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.order-number {
						font-weight: 500;
						font-size: 34rpx;
						color: #333333;
						line-height: 53rpx;
						margin-right: 8rpx;
					}
				}
			}

			.text {
				font-weight: 500;
				font-size: 27rpx;
				color: #4E5969;
				line-height: 42rpx;
			}

			.text-active {
				color: #469DCD;
			}

			.sub-order {
				padding: 15rpx;
				background: #F7F8FA;
				margin-bottom: 15rpx;

				.order-head {
					display: flex;
					justify-content: space-between;
					font-weight: bold;
					font-size: 34rpx;
					color: #333333;
					line-height: 53rpx;
				}

				.detail {
					font-size: 27rpx;
					color: #4E5969;
					line-height: 42rpx;
				}
			}

			.selectedInfo {
				font-weight: 500;
				font-size: 27rpx;
				color: #4E5969;
				line-height: 42rpx;
				display: flex;
				align-items: center;
			}

			.highlight {
				color: #FF5A39;
			}

			.list-button {
				font-weight: 500;
				font-size: 27rpx;
				color: #1D2129;
				line-height: 42rpx;
				padding: 13rpx 31rpx;
				background: #F7F8FA;
				border-radius: 15rpx;
				border: 2rpx solid #E5E6EB;
				margin-right: 15rpx;

				&:last-child {
					margin-right: 0;
				}
			}

			.confirm {
				color: #469DCD;
				background: #E8F3FF;
				border: 2rpx solid #469DCD
			}

			.orderNo {
				font-weight: bold;
				font-size: 42rpx;
				color: #333333;
				line-height: 57rpx;
				margin-right: 8rpx;
			}
		}
	}
</style>