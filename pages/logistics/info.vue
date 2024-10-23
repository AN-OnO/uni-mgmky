<template>
	<view class="container-background" style="height: 100%;overflow: scroll;">
		<view class="container">
			<view>
				<view style="background: #333333;border-radius: 15rpx;">
					<view class='flex-center'>
						<image class="image"
							:src="searchType == 2? '../../static/images/logistics/配送中.svg': '../../static/images/logistics/待配送.svg'"
							mode=""></image>
						<text class="order-status">{{
							({
								3: {
									1: '待配送',
									2: '配送中',
									3: '已完成'
								},
								4: {
									1: '待取送',
									2: '取送中',
									3: '已完成'
								}
							})[deliveryMethod][searchType]
							}}</text>
					</view>
					<view class='flex-center'>
						<image class="image" src="../../static/images/logistics/infoLocal (已定位).svg" mode=""></image>
						<text class="local-text">{{`${data.linkMan } ${data.contactMobile }`}}</text>
					</view>
					<div class="address">{{data.address}}</div>
				</view>
				<view class="container-content">
					<view style="display: flex;">
						<uv-image :src='data.productImage' width="152.67rpx" height="152.67rpx"></uv-image>
						<view style="padding-left: 30rpx;">
							<view class="line-clamp-3">{{data.productName}}</view>
							<text>{{data.orderCount}}</text>
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
									<view style="max-width: 380rpx;">{{data.productName}}</view>
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
									<view style="max-width: 380rpx;">{{data.orderRemark}}</view>
								</template>
							</uv-form-item>
							<uv-form-item v-if="searchType == 3" class="align-right " label="完成时间:" labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.finishTime}}</text>
								</template>
							</uv-form-item>
							<uv-form-item v-if="deliveryMethod == 4 && searchType == 3" class="align-right "
								label="寄件单号:" labelWidth='250rpx'>
								<template v-slot:right>
									<text>{{data.express_fee}}</text>
								</template>
							</uv-form-item>
							<uv-form-item v-if="deliveryMethod == 4 && searchType == 3" class="align-right "
								label="寄件图片:" labelWidth='250rpx' labelPosition='top'>
								<uv-image v-for="(item, index) in data.photoList" :key="index" :src="item" width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
							</uv-form-item>
						</uv-form>
					</view>
				</view>
			</view>
			<view v-if="searchType != 3" class="bottom-container">
				<button v-if="deliveryMethod == 3" class="button-operation white-button">
					<image src="../../static/images/logistics/电话.svg" class="button-image" mode=""></image><text
						class="text-operation" style="color: #333333;">电话</text>
				</button>
				<button v-if="deliveryMethod == 3" class="button-operation white-button">
					<image src="../../static/images/logistics/导航.svg" class="button-image" mode=""></image><text
						class="text-operation" style="color: #333333;">导航</text>
				</button>
				<button class="button-operation" @click.stop="confirm(data.orderItemNo)">
					<image :src="searchType == 1 ? '/static/images/logistics/开始.svg':'/static/images/logistics/完成.svg'"
						style="max-width: 45.8rpx;max-height: 45.8rpx; " mode=""></image>
					<text class="text-operation">{{({
								3: {
									1: '开始配送',
									2: '完成配送',
								},
								4: {
									1: '开始取送',
									2: '完成取送',
								}
							})[deliveryMethod][searchType]
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
				searchType: 1,
				orderItemNo: '',
			}
		},
		onLoad(options) {
			this.deliveryMethod = options.deliveryMethod;
			this.searchType = options.searchType;
			this.orderItemNo = options.orderItemNo;
			uni.setNavigationBarColor({
				backgroundColor: 'rgba(89,87,230,0.6)'
			});
			GetDeliveryDetail({
				orderItemNo: this.orderItemNo
			}).then(res => {
				this.data = res.data
			})
		},
		methods: {
			confirm(orderItemNo) {
				if (this.searchType == 2) {
					this.$refs.modal.open();
				} else {
					ConfirmDelivery({
						orderItemNo: orderItemNo
					})
					uni.navigateBack({
						delta: 1
					});
				}
			},
			closeModal() {
				this.$refs.modal.close();
				uni.navigateBack({
					delta: 1
				});
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
			}
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
	}

	.container-background {
		background: linear-gradient(180deg, rgba(89, 87, 230, 0.6) 0%, rgba(89, 87, 230, 0) 100%), #F0F1F5;
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
		padding: 30rpx;
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
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
		display: -webkit-box;
		height: 110rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
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
		height: 167rpx;
		padding: 15rpx;
		display: flex;
		justify-content: end;
	}

	.button-operation {
		height: 69rpx;
		background: #333333;
		border-radius: 191rpx;
		margin-right: 0;
		margin-left: 15rpx;
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
		vertical-align: super;
	}
</style>