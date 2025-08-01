<template>
	<view class="container-background">
		<view class="container">
			<view class="card">
				<view class='flex-center'>
					<image class="title-image" src="/static/images/logistics/待配送.svg" mode=""></image>
					<text class="order-status">{{data.group.delivryStatusDesc}}</text>
				</view>
			</view>
			<view class="card">
				<view class='flex-center'>
					<image class="image" src="/static/images/logistics/newList-local.svg" mode=""></image>
					<text class="text">{{data.group.companyName}}</text>
				</view>
				<div class="address margin-left-xl">{{data.group.address}}</div>
			</view>
			<view class="card">
				<view class='flex-center'>
					<text class="text prefix">{{data.group.orderNo}}</text>
				</view>
				<view v-for="(detail, index) in data.details" :key="index"
					class="flex-row align-start margin-left-xs margin-bottom-xs">
					<image class="order-img" :src='detail.productImage'></image>
					<view class="flex-column justify-between">
						<view class="text">
							{{detail.orderItemNo}}
						</view>
						<view
							:class="['info-productName',`${detail.orderItemNo}`, spreadArr.includes(detail.orderItemNo) && !spreadArr.includes(`${index}-${detail.orderItemNo}`)?'uv-line-2':'']">
							{{detail.productName}}
						</view>
						<view v-if="spreadArr.includes(detail.orderItemNo)" class="tag-wrap"
							@click.stop="spread(`${index}-${detail.orderItemNo}`)">
							<uv-icon
								:name="spreadArr.includes(`${index}-${detail.orderItemNo}`)?'arrow-up':'arrow-down'"
								:label="spreadArr.includes(`${index}-${detail.orderItemNo}`)?'收起':'更多'"
								label-size="24rpx" size="32rpx" label-pos="left" color="#808080"
								label-color="#808080"></uv-icon>
						</view>
					</view>
				</view>
				<view class="flex-row align-center address margin-tb-sm">
					<text class="margin-left-xs flex-1">订单编号:</text>
					<text class="margin-right-xs">{{data.group.orderNo}}</text>
					<text class="copy" @click="copy(data.group.orderNo)">复制</text>
				</view>
				<view class="flex-row address margin-tb-sm highlight">
					<text class="margin-lr-xs">下单备注:</text>
					<text class="text-right flex-1">{{data.group.orderRemark}}</text>
				</view>
				<template v-if="showMore">
					<view class="flex-row address margin-tb-sm">
						<text class="margin-lr-xs">下单时间:</text>
						<text class="text-right flex-1">{{data.group.orderTime}}</text>
					</view>
					<view v-if="data.group.saleOrderDeliverInfo?.finishTime" class="flex-row address margin-tb-sm">
						<text class="margin-lr-xs">签收时间:</text>
						<text class="text-right flex-1">{{data.group.saleOrderDeliverInfo?.finishTime}}</text>
					</view>
					<view v-if="data.group.saleOrderDeliverInfo?.express_no" class="flex-row address margin-tb-sm">
						<text class="margin-lr-xs">寄件单号:</text>
						<text class="text-right flex-1">{{data.group.saleOrderDeliverInfo?.express_no}}</text>
					</view>
					<view v-if="data.group.saleOrderDeliverInfo?.photoList" class="flex-row address margin-tb-sm">
						<text class="margin-lr-xs">签收信息:</text>
						<uv-image v-for="(item, index) in data.group.saleOrderDeliverInfo?.photoList" :key="index"
							:src="item" width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
					</view>
					<view v-if="data.group.saleOrderDeliverInfo?.remark" class="remark text-right">
						{{data.group.saleOrderDeliverInfo?.remark}}</view>
				</template>
				<uv-icon @click="this.showMore = !this.showMore" :name="showMore ? 'arrow-up' : 'arrow-down'"
					:label="showMore ? '收起' : '更多详情'" labelPos="left" color="#469DCD" labelColor="#469DCD"
					labelSize="12"></uv-icon>
			</view>
		</view>
		<view v-if="[1, 2].includes(data.group.delivryStatus)" class="bottom-container">
			<button v-if="deliveryMethod == 3" class="button-operation"
				@click.stop="callPhone(data.details[0].contactMobile)">
				<image src="/static/images/logistics/电话.svg" class="button-image" mode=""></image><text
					class="text-operation" style="color: #333333;">电话</text>
			</button>
			<button v-if="deliveryMethod == 3" class="button-operation" @click.stop="goNavigation">
				<image src="/static/images/logistics/导航.svg" class="button-image" mode=""></image><text
					class="text-operation" style="color: #333333;">导航</text>
			</button>
			<button class="button-operation confirm" @click.stop="confirm(data.group.orderNo)">
				<image class="button-image"
					:src="data.group.delivryStatus === 1 ? '/static/images/logistics/开始配送.svg' : '/static/images/logistics/完成.svg'"
					mode="">
				</image>
				<text class="text-operation">{{getButtonText(data.group.delivryStatus)}}</text>
			</button>
		</view>
		<uv-loading-page :loading="loading"></uv-loading-page>
		<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
			<new-upload :uploadType="deliveryMethod" :closeModal="closeModal" :orderNos='orderNos' />
		</uv-modal>
	</view>
</template>

<script>
	import {
		BatchConfirmDeliveryByPSP,
		ConfirmDelivery,
		GetDeliveryDetail,
		GetDeliveryDetailBySaleOrder,
	} from '../../apis/member';
	import NewUpload from './newUpload.vue';

	export default {
		components: {
			NewUpload,
		},
		data() {
			return {
				data: {
					details: [],
					group: {}
				},
				orderNo: '',
				loading: true,
				spreadArr: [],
				deliveryMethod: 3,
				orderNos: '',
				showMore: false,
				keywords: '',
				name: ''
			}
		},
		onLoad(options) {
			this.orderNo = options.orderNo;
			this.deliveryMethod = parseInt(options.deliveryMethod);
			this.keywords = options.keywords
			this.name = options.name
			this.getData()
		},
		onUnload() {
			uni.$Utils.setStorage('backbutton', true)
		},
		watch: {
			async data() {
				await uni.$uv.sleep(30)
				this.data.details.forEach((detail) => {
					uni.createSelectorQuery().select(`.${detail.orderItemNo}`).boundingClientRect(
						data => {
							if (data.height > 50) {
								this.spreadArr.push(detail.orderItemNo)
							}
						}).exec()
				})
			}
		},
		methods: {
			getButtonText(delivryStatus) {
				if (this.deliveryMethod == 3) {
					return delivryStatus === 1 ? '开始配送' : '完成配送'
				}
				return delivryStatus === 1 ? '开始取送' : '完成取送'
			},
			getData() {
				GetDeliveryDetailBySaleOrder({
					orderNo: this.orderNo
				}).then(res => {
					this.data = res.data
				}).finally(() => this.loading = false)
			},
			async confirm(orderNo) {
				if (this.data.group.delivryStatus === 1) {
					await BatchConfirmDeliveryByPSP({
						saleOrders: [{
							orderNo,
							orderItemNos: []
						}]
					})

					if (this.name) {
						uni.navigateTo({
							url: `/pages/logistics/newSearch?name=${this.name}&deliveryMethod=${this.deliveryMethod}&keywords=${this.keywords}`
						});
					} else {
						uni.navigateTo({
							url: `/pages/logistics/newList?deliveryMethod=${this.deliveryMethod}`
						});
					}
				} else {
					this.orderNos = [orderNo]
					this.$refs.modal.open();
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					if (this.name) {
						uni.navigateTo({
							url: `/pages/logistics/newSearch?name=${this.name}&deliveryMethod=${this.deliveryMethod}&keywords=${this.keywords}`
						});
					} else {
						uni.navigateTo({
							url: `/pages/logistics/newList?deliveryMethod=${this.deliveryMethod}`
						});
					}
				}
			},
			spread(key) {
				if (this.spreadArr.includes(key)) {
					this.spreadArr = this.spreadArr.filter(item => item != key)
				} else {
					this.spreadArr.push(key)
				}
			},
			copy(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.$uv.toast('复制成功')
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
			}
		}
	}
</script>

<style lang="scss">
	.container-background {
		background: #F2F3F5;
		height: 100%;
		overflow: scroll;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.container {
		width: 92%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card {
		background: #FFFFFF;
		border-radius: 15rpx;
		margin-bottom: 15.27rpx;
		padding: 30rpx 15rpx;

		.flex-center {
			display: flex;
			align-items: center;

			.title-image {
				max-width: 61.07rpx;
				max-height: 61.07rpx;
				margin-right: 7.63rpx;
			}

			.order-status {
				font-weight: 600;
				font-size: 46rpx;
				color: #333333;
				line-height: 69rpx;
			}

			.image {
				max-width: 45.8rpx;
				max-height: 45.8rpx;
			}

			.prefix {
				position: relative;
				padding-left: 15rpx;
				margin-left: 15rpx;
			}

			.prefix::before {
				content: '';
				position: absolute;
				left: 0;
				height: 1em;
				width: 0.25em;
				border-radius: 10px;
				background-color: #469DCD;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.tag-wrap {
			width: 120rpx;
			height: 50rpx;
			background: #F5F6F8;
			border-radius: 191rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: auto;
		}

		.remark {
			font-size: 27rpx;
			color: #1D2129;
			line-height: 38rpx;
			margin-bottom: 25rpx;
		}
	}

	.copy {
		font-size: 27rpx;
		color: #86909C;
		line-height: 46rpx;
		padding-left: 15rpx;
		border-left: 2rpx solid #F2F3F5;
	}

	.text {
		font-weight: 600;
		font-size: 31rpx;
		color: #333333;
		line-height: 46rpx;
	}

	.address {
		font-size: 27rpx;
		color: #4E5969;
		line-height: 42rpx;
	}

	.order-img {
		max-width: 191rpx;
		max-height: 191rpx;
		margin-right: 15rpx;
	}

	.info-productName {
		width: 418rpx;
		font-size: 27rpx;
		color: #4E5969;
		line-height: 42rpx;
	}

	.highlight {
		color: #FF5722;
	}

	.bottom-container {
		background: #FFFFFF;
		padding: 30rpx;
		display: flex;
		justify-content: flex-end;
		padding-bottom: env(safe-area-inset-bottom);

		.button-operation {
			color: #333333;
			background: #F2F3F5;
			border-radius: 15rpx;
			margin-left: 0;
			margin-right: 8rpx;
			padding: 29rpx 38rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.confirm {
			color: #FFFFFF;
			background: #469DCD;
			margin-right: 0;
		}

		.button-image {
			max-width: 45.8rpx;
			max-height: 45.8rpx;
			margin-right: 3.82rpx;
		}

		.text-operation {
			font-weight: 500;
			font-size: 34rpx;
			color: #FFFFFF;
			line-height: 42rpx;
		}
	}
</style>