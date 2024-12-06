<template>
	<view class="container-background" style="height: 100%;overflow: scroll;">
		<view class="container">
			<view>
				<view style="background: #333333;border-radius: 15rpx;">
					<view class='flex-center'>
						<image class="image"
							:src="data.status == 1? '/static/images/logistics/配送中.svg': '/static/images/logistics/待配送.svg'"
							mode=""></image>
						<text class="order-status">{{
							({
								3: {
									0: '待配送',
									1: '配送中',
									2: '已完成'
								},
								4: {
									0: '待取送',
									1: '取送中',
									2: '已完成'
								}
							})[deliveryMethod][data.status]
							}}</text>
					</view>
					<view class='flex-center'>
						<image class="image" src="/static/images/logistics/infoLocal (已定位).svg" mode=""></image>
						<text class="local-text">{{`${data.linkMan } ${data.contactMobile }`}}</text>
					</view>
					<div class="address">{{data.address}}</div>
				</view>
				<view class="container-content">
					<view style="display: flex;">
						<uv-image :src='data.productImage' width="152.67rpx" height="152.67rpx"></uv-image>
						<view style="padding-left: 30rpx;">
							<uni-tooltip>
								<view class="line-clamp-3 info-productName">{{data.productName}}</view>
								<template v-slot:content>
									<view>
										{{data.productName}}
									</view>
								</template>
							</uni-tooltip>
							<text class="orderCount">X{{data.orderCount}}</text>
						</view>
					</view>
					<view class="info-divider"></view>
					<view>
						<text class="order-info">订单信息</text>
						<uv-form class="font-style">
							<uv-form-item class="align-right " label="订单编号:" labelWidth='250rpx'>
								<template v-slot:right>
									<view style="display: flex;">
										<text style="margin-right: 15rpx;">{{data.orderItemNo}}</text>
										<button class="button-copy" @click="copyText(data.orderItemNo)"><text
												class="text-copy">复制</text></button>
									</view>
								</template>
							</uv-form-item>
							<uv-form-item label="订购内容:" labelWidth='250rpx' customStyle='align-items: flex-start'>
								<template v-slot:right>
									<view style="max-width: 380rpx">
										{{data.productName}}
									</view>
								</template>
							</uv-form-item>
							<uv-form-item class="align-right " label="订购数量:" labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.orderCount}}</text>
								</template>
							</uv-form-item>
							<uv-form-item class="align-right " label="下单时间:" labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.orderTime}}</text>
								</template>
							</uv-form-item>
							<uv-form-item v-if="deliveryMethod == 4" class="align-right " label="邮寄方式:"
								labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.deliveryType}}</text>
								</template>
							</uv-form-item>
							<uv-form-item class="align-right " label="下单备注:" labelWidth='250rpx'
								customStyle='align-items: flex-start'>
								<template v-slot:right>
									<view style="max-width: 380rpx;">
										{{data.orderRemark}}
									</view>
								</template>
							</uv-form-item>
							<uv-form-item v-if="data.status == 2" class="align-right " label="完成时间:"
								labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.finishTime}}</text>
								</template>
							</uv-form-item>
							<uv-form-item v-if="deliveryMethod == 4 && data.status == 2" class="align-right "
								label="寄件单号:" labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.express_fee}}</text>
								</template>
							</uv-form-item>
							<uv-form-item v-if="deliveryMethod == 4 && data.status == 2" class="align-right "
								label="寄件图片:" labelWidth='250rpx' labelPosition='top'>
								<uv-image v-for="(item, index) in data.photoList" :key="index" :src="item"
									width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
							</uv-form-item>
						</uv-form>
					</view>
				</view>
			</view>
			<view v-if="data.status  != 2" class="bottom-container">
				<button v-if="deliveryMethod == 3" class="button-operation white-button"
					@click.stop="callPhone(data.contactMobile)">
					<image src="/static/images/logistics/电话.svg" class="button-image" mode=""></image><text
						class="text-operation" style="color: #333333;">电话</text>
				</button>
				<button v-if="deliveryMethod == 3" class="button-operation white-button" @click.stop="goNavigation">
					<image src="/static/images/logistics/导航.svg" class="button-image" mode=""></image><text
						class="text-operation" style="color: #333333;">导航</text>
				</button>
				<button class="button-operation" @click.stop="confirm(data.orderItemNo)">
					<image
						:src="data.status  == 0 && deliveryMethod == 3 ? '/static/images/logistics/开始配送.svg': data.status  == 0  ? '/static/images/logistics/开始取送.svg':'/static/images/logistics/完成.svg'"
						style="max-width: 45.8rpx;max-height: 45.8rpx; " mode=""></image>
					<text class="text-operation">{{({
								3: {
									0: '开始配送',
									1: '完成配送',
								},
								4: {
									0: '开始取送',
									1: '完成取送',
								}
							})[deliveryMethod][data.status]
							}}</text>
				</button>
			</view>
			<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
				<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" :orderItemNo="data.orderItemNo" />
			</uv-modal>
		</view>
	</view>
</template>

<script>
	import {
		ConfirmDelivery,
		GetDeliveryDetail,
	} from '../../apis/member';
	import UploadVue from './upload.vue';
	export default {
		components: {
			UploadVue,
		},
		data() {
			return {
				deliveryMethod: 3,
				data: {},
				orderItemNo: '',
			}
		},
		onLoad(options) {
			this.deliveryMethod = parseInt(options.deliveryMethod);
			this.orderItemNo = options.orderItemNo;
			this.getData()
		},
		methods: {
			getData() {
				GetDeliveryDetail({
					orderItemNo: this.orderItemNo
				}).then(res => {
					this.data = res.data
				})
			},
			async confirm(orderItemNo) {
				if (this.data.status == 1) {
					this.$refs.modal.open();
				} else {
					await ConfirmDelivery({
						orderItemNo: orderItemNo
					})
					uni.navigateBack({
						delta: 1
					});
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.getData()
				}
			},
			copyText(text) {
				// 调用小程序 API 复制文字到剪贴板
				wx.setClipboardData({
					data: text,
					success: function() {
						// 复制成功的回调
						wx.showToast({
							title: '复制成功',
							icon: 'success',
							duration: 2000
						});
					},
				})
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

<style>
	uni-page-body {
		height: 100%;
	}

	.container-background {
		background: #F2F2F2;
	}

	.container {
		width: 92%;
		height: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.container-content {
		background: #FFFFFF;
		margin-top: 15rpx;
		padding: 30rpx 30rpx 0;
	}

	.image {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
		margin: 20rpx;
	}

	.info-divider {
		margin: 30rpx 0;
		border: 2rpx solid #D9D9D9;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.order-status {
		font-weight: 500;
		font-size: 46rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 69rpx;
	}

	.local-text {
		font-weight: 500;
		font-size: 31rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 46rpx;
	}

	.address {
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.6);
		line-height: 38rpx;
		margin-left: 85.8rpx;
		padding-bottom: 30rpx;
	}

	.order-info {
		font-weight: bold;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}

	.line-clamp-3 {
		height: 110rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.info-productName {
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
	}

	.button-copy {
		height: 46rpx;
		background: #F5F6F8;
		border-radius: 191rpx
	}

	.text-copy {
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
		vertical-align: top;
	}

	.uv-form.font-style .uv-form-item {
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
	}

	.bottom-container {
		background: #FFFFFF;
		padding: 15rpx;
		display: flex;
		justify-content: flex-end;
	}

	.button-operation {
		height: 69rpx;
		background: #333333;
		border-radius: 191rpx;
		margin-right: 0;
		margin-left: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.white-button {
		background: #FFFFFF;
		border: 2rpx solid #D9D9D9;
	}

	.button-image {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.text-operation {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 42rpx;
	}

	.orderCount {
		font-weight: 500;
		font-size: 27rpx;
		color: #333333;
		line-height: 42rpx;
	}
</style>