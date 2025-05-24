<template>
	<view class="container-background">
		<view class="container">
			<view class="card">
				<view class='flex-center'>
					<image class="title-image"
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
			</view>
			<view class="card">
				<view class='flex-center'>
					<image class="image" src="/static/images/logistics/infoLocal (已定位).svg" mode=""></image>
					<text
						class="text">{{`${data.linkMan} ${phoneNumber}`}}</text>
				</view>
				<div class="address margin-left-xl">{{data.address}}</div>
			</view>
			<view class="card">
				<view class='flex-center'>
					<image class="image" src="/static/images/logistics/baseInfo.svg" mode=""></image>
					<text class="text">订单信息</text>
				</view>
				<view class="margin-left-xl">
					<view style="display: flex;">
						<image class="order-img" :src='data.productImage'></image>
						<view class="flex-column justify-between">
							<uni-tooltip>
								<view class="uv-line-3 info-productName">{{data.productName}}</view>
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
					<uv-form labelStyle="font-size: 27rpx;color: #808080;line-height: 38rpx;">
						<uv-form-item class="align-right " label="订单编号:" labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.orderNo}}</text>
							</template>
						</uv-form-item>
						<uv-form-item class="align-right " label="生产单号:" labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.orderItemNo}}</text>
							</template>
						</uv-form-item>
						<uv-form-item class="align-right " label="下单时间:" labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.orderTime}}</text>
							</template>
						</uv-form-item>
						<uv-form-item v-if="deliveryMethod == 4" class="align-right " label="邮寄方式:" labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.deliveryType}}</text>
							</template>
						</uv-form-item>
						<uv-form-item v-if="data.status == 2" class="align-right " label="完成时间:" labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.finishTime}}</text>
							</template>
						</uv-form-item>
						<uv-form-item v-if="deliveryMethod == 4 && data.status == 2" class="align-right " label="寄件单号:"
							labelWidth='250rpx'>
							<template v-slot:right>
								<text class="form-text">{{data.express_fee}}</text>
							</template>
						</uv-form-item>
						<uv-form-item v-if="deliveryMethod == 4 && data.status == 2" class="align-right " label="寄件图片:"
							labelWidth='250rpx' labelPosition='top'>
							<uv-image v-for="(item, index) in data.photoList" :key="index" :src="item" width="145.04rpx"
								height="145.04rpx" style="margin: 8rpx;"></uv-image>
						</uv-form-item>
					</uv-form>
				</view>
			</view>
			<view v-if="data.orderRemark?.length > 0" class="card">
				<view class='flex-center'>
					<image class="image" src="/static/images/logistics/edit.svg" mode=""></image>
					<text class="text">下单备注</text>
				</view>
				<div class="remark-text margin-left-xl">{{data.orderRemark}}</div>
			</view>
		</view>
		<view v-if="data.status  != 2" class="bottom-container">
			<button v-if="deliveryMethod == 3" class="button-operation normal-button"
				@click.stop="callPhone(data.contactMobile)">
				<image src="/static/images/logistics/电话.svg" class="button-image" mode=""></image><text
					class="text-operation" style="color: #333333;">电话</text>
			</button>
			<button v-if="deliveryMethod == 3" class="button-operation normal-button" @click.stop="goNavigation">
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
		<uv-loading-page :loading="loading"></uv-loading-page>
		<uv-modal ref="modal" :showConfirmButton='false' :closeOnClickOverlay='false'>
			<UploadVue :uploadType="deliveryMethod" :closeModal="closeModal" :orderItemNo="data.orderItemNo" />
		</uv-modal>
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
				loading: true,
			}
		},
		onLoad(options) {
			this.deliveryMethod = parseInt(options.deliveryMethod);
			this.orderItemNo = options.orderItemNo;
			this.getData()
		},
		onUnload() {
			uni.$Utils.setStorage('backbutton', true)
		},
		computed: {
			phoneNumber() {
				return this.deliveryMethod == 4 ? this.data.contactMobile : this.data.contactMobile?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
			}
		},
		methods: {
			getData() {
				GetDeliveryDetail({
					orderItemNo: this.orderItemNo
				}).then(res => {
					this.data = res.data
				}).finally(() => this.loading = false)
			},
			async confirm(orderItemNo) {
				if (this.data.status == 1) {
					this.$refs.modal.open();
				} else {
					await ConfirmDelivery({
						orderItemNo: orderItemNo
					})
					uni.navigateTo({
						url: `/pages/logistics/list?deliveryMethod=${this.deliveryMethod}`
					});
				}
			},
			closeModal(key) {
				this.$refs.modal.close();
				if (key == 'reFresh') {
					this.getData()
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
			}
		}
	}
</script>

<style lang="scss">
	.container-background {
		background: #F0F0F0;
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


	.info-divider {
		margin: 15rpx 0;
		border: 2rpx solid #F2F3F5;
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

			.text {
				font-weight: 600;
				font-size: 34rpx;
				color: #333333;
				line-height: 53rpx;
			}
		}
	}

	.address {
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
	}

	.order-img {
		max-width: 191rpx;
		max-height: 191rpx;
		margin-right: 15rpx;
	}

	.info-productName {
		width: 418rpx;
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
	}

	.remark-text {
		font-weight: 500;
		font-size: 27rpx;
		color: #333333;
		line-height: 42rpx;
	}

	.form-text {
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
	}

	.bottom-container {
		background: #FFFFFF;
		padding: 30rpx;
		display: flex;
		justify-content: flex-end;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.button-operation {
		height: 95rpx;
		background: #2FB7DF;
		border-radius: 15rpx;
		margin-right: 0;
		margin-left: 5rpx;
		padding: 25rpx 38rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.normal-button {
		background: #F0F0F0;
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

	.orderCount {
		font-weight: 600;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}
</style>