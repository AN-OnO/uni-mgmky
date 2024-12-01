<template>
	<view class="page-container">
		<uv-empty v-if="isEmpty" mode="data" icon="https://cdn.uviewui.com/uview/empty/data.png"></uv-empty>
		<view v-else-if="!loading" class="order-card padding">
			<view class="order-card-head">
				<view class="order-status">
					<image class="icon-status margin-right-xs" src="/static/images/productionReport/待完成.svg"></image>
					<text class="text-status">{{orderDetail.uStatusDesc}}</text>
				</view>
				<text class="sale-order-no">{{orderDetail.saleOrderNo}}</text>
				<text class="order-company">{{orderDetail.orderItemNo}} {{orderDetail.companyName}}</text>
			</view>
			<view class="order-card-content">
				<view class="product-wrap">
					<image class="product-photo" :src="orderDetail.photo"></image>
					<view class="product-info">
						<text class="product-name uv-line-3">{{orderDetail.productName}}</text>
						<text class="product-count">x{{orderDetail.orderCount}}</text>
					</view>
				</view>
				<!--  -->
				<uv-line margin="30rpx 0"></uv-line>
				<text class="order-intro-title">订单信息</text>
				<view class="label-item">
					<text class="order-label">订单编号：</text>
					<text class="order-label-info">{{orderDetail.saleOrderNo}}</text>
					<view class="copy-tag">
						<text class="copy-text" @click="onCopy(orderDetail.saleOrderNo)">复制</text>
					</view>
				</view>
				<view class="label-item">
					<text class="order-label">下单时间：</text>
					<text class="order-label-info">{{orderDetail.checkintime}}</text>
				</view>
				<view class="label-item">
					<text class="order-label">客户名称：</text>
					<text class="order-label-info">{{orderDetail.companyName}}</text>
				</view>
				<view class="label-item">
					<text class="order-label">订购内容：</text>
					<text class="order-label-info">{{orderDetail.productName}}</text>
				</view>
				<view class="label-item">
					<text class="order-label">订购数量：</text>
					<text class="order-label-info">{{orderDetail.orderCount}}</text>
				</view>
				<view class="label-item">
					<text class="order-label">下单备注：</text>
					<text class="order-label-info">{{orderDetail.remark}}</text>
				</view>
			</view>

			<view v-if="!isFinished" class="order-num-wrap margin-top">
				<text class="un-complete-count">待完成数量({{orderDetail.unCompleteCount}})</text>
				<uv-line margin="30rpx 0"></uv-line>
				<view class="number-box">
					<text class="number-box-title">本次完成数量</text>
					<view class="number-counter">
						<uv-button @click="decrement" :disabled="orderDetail.unCompleteCount === 0"><uv-icon
								name="minus"></uv-icon></uv-button>
						<uv-input type="number" v-model="orderDetail.unCompleteCount"></uv-input>
						<uv-button @click="increment"><uv-icon name="plus"></uv-icon></uv-button>
					</view>
				</view>
			</view>
		</view>
		<template v-if="!isFinished&&!isEmpty">
			<view class="footer-height"></view>
			<view class="page-footer">
				<view class="flex-row justify-end padding-sm">
					<button class="list-button" @click="onConfirm()">
						<image class="list-image" src="/static/images/logistics/完成.svg"></image>
						<text class="button-text">完成任务</text>
					</button>
				</view>
			</view>
		</template>

		<uv-loading-page :loading="loading"></uv-loading-page>
	</view>
</template>

<script>
	import {
		ScanResult,
		GetTechnologyOrderItemDetail
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				orderDetail: null,
				isEmpty: false,
				loading: true,
				isFinished: false
			}
		},
		onLoad(options) {
			if (Object.keys(options).length === 0) {
				this.loading = false
				this.isEmpty = true
				return uni.$uv.toast('页参异常')
			}

			console.log('options', options)
			this.getDetail(options)
		},
		methods: {
			getDetail(params) {
				GetTechnologyOrderItemDetail({
					orderItemNo: params.orderItemNo,
					productionTechnologyId: params.technologyId
				}).then(res => {
					if (res.code === 0) {
						this.orderDetail = res.data
						this.isFinished = this.orderDetail.uStatus === 1
						uni.setNavigationBarTitle({
							title: `订单详情(${this.orderDetail.productionTechnologyName})`
						})
					} else {
						uni.$uv.toast('订单详情加载失败')
					}
				}).finally(() => {
					this.loading = false
					this.isEmpty = this.orderDetail === null
				})
			},
			increment() {
				this.orderDetail.unCompleteCount++;
			},
			decrement() {
				this.orderDetail.unCompleteCount--;
			},
			onConfirm() {
				uni.showModal({
					title: '提示',
					content: '您是否确认完成任务？',
					success: ({
						confirm
					}) => confirm && this.completeTask()
				})
			},
			completeTask(order) {
				const navigateBack = (success = false) => {
					success && uni.$Utils.navigateBack()
				}
				
				ScanResult({
					scanResult: this.orderDetail.orderItemNo,
					// technologyid: order.productionTechnologyId,
					checkinType: 0, // 1：切换 2：覆盖 3：新增
					// employeeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
					// makeQuantity: 0 // 完成件数
				}).then(res => {
					console.log('ScanResult respone', res)
					const success = res.code === 0
					let message = success ? '任务已完成！' : (res.message || '任务完成失败！')

					uni.showModal({
						title: '提示',
						content: message,
						showCancel: false,
						success: ({
							confirm
						}) => confirm && navigateBack(success)
					})
				})

			},
			onCopy(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.$uv.toast('复制成功')
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$footerHeight: 120rpx;
	$radius: 15rpx;
	$shadow: 0rpx 8rpx 46rpx 0rpx #EBEDF5;

	.page-container {
		background-color: #F0F1F5;
		min-height: 100%;
		box-sizing: border-box;
	}

	.footer-height {
		height: $footerHeight;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}

	.page-footer {
		position: fixed;
		z-index: 990;
		bottom: 0;
		left: 0;
		right: 0;
		height: $footerHeight;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}

	.order-card {
		box-shadow: $shadow;

		&-head {
			background-color: #333;
			border-radius: $radius $radius 0 0;
			padding: 30rpx;
			display: flex;
			flex-direction: column;

			.order-status {
				display: flex;
				align-items: center;
				line-height: 69rpx;
			}

			.icon-status {
				width: 46rpx;
				height: 46rpx;
			}

			.text-status {
				font-size: 46rpx;
				color: rgba(255, 255, 255, 0.9);
			}

			.sale-order-no {
				font-size: 31rpx;
				color: rgba(255, 255, 255, 0.9);
				line-height: 46rpx;
			}

			.order-company {
				font-size: 27rpx;
				color: rgba(255, 255, 255, 0.6);
				line-height: 38rpx;
			}
		}

		&-content {
			background-color: #fff;
			border-radius: 0 0 $radius $radius ;
			padding: 30rpx;

			.product-wrap {
				display: flex;
			}

			.product-photo {
				width: 153rpx;
				height: 153rpx;
			}

			.product-info {
				flex: 1;
				margin-left: 15rpx;
			}

			.product-name {
				font-size: 27rpx;
				color: #333333;
				line-height: 38rpx;
			}

			.product-count {
				font-size: 27rpx;
				color: #333333;
				line-height: 42rpx;
			}
		}
	}

	.order-intro-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		line-height: 53rpx;
	}

	.label-item {
		display: flex;
		align-items: flex-start;
		margin: 20rpx 0;
		line-height: 46rpx;
	}

	.order-label {
		font-size: 27rpx;
		color: #333333;
		margin-right: 20rpx;
	}

	.order-label-info {
		flex: 1;
		font-size: 27rpx;
		color: #808080;
		text-align: right;
	}

	.copy-tag {
		background: #F5F6F8;
		border-radius: 100px;
		width: 92rpx;
		height: 46rpx;
		display: flex;
		justify-content: center;
		text-align: center;
		margin-left: 10rpx;

		.copy-text {
			font-size: 27rpx;
			color: #808080;
		}
	}

	.order-num-wrap {
		background-color: #fff;
		box-shadow: $shadow;
		border-radius: $radius;
		padding: 30rpx;

		.un-complete-count {
			font-size: 34rpx;
			color: #333333;
			line-height: 42rpx;
		}

		.number-box {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: center;

			&-title {
				font-size: 27rpx;
				color: #333333;
				line-height: 42rpx;
			}

			.number-counter {
				display: grid;
				grid-template-columns: 1fr 2fr 1fr;
				column-gap: 10rpx;
			}
		}

	}

	/* 此按钮样式可作为公共样式 */
	.list-button {
		height: 69rpx;
		margin-right: 0;
		margin-left: 15rpx;
		background: #333333;
		border-radius: 191rpx;
		display: flex;
		align-items: center;
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
</style>