<template>
	<view class="page-container">
		<template v-if="orderInfo">
			<view class="data-list padding">
				<view v-for="(item,index) in orderInfo.orderItemTrackings" :key="index" class="data-contain">
					<view :class="['list-item',{'active':hasSelection(item.productTechnologyId)}]"
						@click="handleSelect(item)">
						<text :class="[iconClass(item.productTechnologyName),{'active': item.uStatus === 1}]"></text>
					</view>
					<text class="item-name">{{ item.productTechnologyName }}</text>
				</view>
			</view>

			<view class="order-modal">
				<text class="order-no">{{orderInfo.saleOrderNo}}</text>
				<view class="order-company">
					<text class="margin-right-sm">{{orderInfo.orderItemNo}}</text>
					<text>{{orderInfo.companyName}}</text>
				</view>
				<view class="order-info">
					<text id="productName" ref="productName"
						:class="[{'uv-line-2':showMoreIcon&&!readMore}]">{{orderInfo.productName}}</text>
					<view class="flex-row justify-end padding-top-xs" v-if="showMoreIcon">
						<view class="tag-wrap">
							<uv-icon @click="readMore = !readMore" :name="readMore?'arrow-up':'arrow-down'"
								:label="readMore?'收起':'更多'" label-size="23rpx" size="28rpx" label-pos="left"
								color="#808080" label-color="#808080"></uv-icon>
						</view>
					</view>
				</view>
				<view class="padding-top-lg">
					<button type="default" class="list-button" @click="onConfirm">
						<text class="button-text text-white">确认</text>
					</button>
				</view>
				<uv-safe-bottom></uv-safe-bottom>
			</view>
		</template>
		<template v-else>
			<uv-empty mode="order" icon="https://cdn.uviewui.com/uview/empty/order.png"></uv-empty>
		</template>

		<uv-popup ref="popup" mode="bottom" round="31rpx" closeable>
			<view>
				<view class="popup-title text-center"><text class="text-xl text-bold">您将完成以下工艺</text></view>
				<view class="data-list padding">
					<view v-for="(item,index) in selection" :key="index" class="data-contain">
						<view class="list-item small">
							<text :class="[iconClass(item.productTechnologyName),'active']"></text>
						</view>
						<text class="item-name">{{ item.productTechnologyName }}</text>
					</view>
				</view>
				<view class="flex-row padding-lr">
					<button type="default" class="list-button default margin-right-sm" @click="onCancel">
						<text class="button-text text-dark">取消</text>
					</button>
					<button type="default" class="list-button" @click="onFinish">
						<text class="button-text text-white">确认</text>
					</button>
				</view>
			</view>
		</uv-popup>

		<uv-loading-page :loading="loading"></uv-loading-page>
	</view>
</template>

<script>
	import iconMapping from '@/common/icon-alias';
	import {
		BatchScanResult,
		GetOrderItemAndTrackings
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				scanResult: '',
				technologies: [],
				orderInfo: null,
				readMore: false,
				showMoreIcon: false,
				loading: true,
				selection: []
			}
		},
		onLoad(option) {
			this.scanResult = option.orderItemNo
			if (this.scanResult) {
				this.init()
			}
		},
		computed: {
			hasSelection() {
				return (id) => {
					return this.selection.map(x => x.productTechnologyId).includes(id)
				}
			}
		},
		methods: {
			iconClass(iconName) {
				return `iconfont ${iconMapping[iconName]}`;
			},
			init() {
				this.loading = true

				GetOrderItemAndTrackings({
					orderItemNo: this.scanResult
				}).then(res => {

					if (res.code === 0) {
						this.orderInfo = res.data

						this.getContentHeight().then(height => {
							console.log('getContentHeight height', height)
							this.showMoreIcon = height > 50
						})
					}
				}).finally(() => this.loading = false)
			},
			uvGetRect(selector) {
				return new Promise((resolve) => {
					uni.createSelectorQuery()
						.in(this).select(selector)
						.boundingClientRect((rect) => {
							console.log(selector, rect)
							if (rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			},
			// 获取内容的高度
			async getContentHeight() {
				// 延时一定时间再获取节点
				await uni.$uv.sleep(30)
				return new Promise(resolve => {
					// #ifndef APP-NVUE

					this.uvGetRect('#productName').then(res => {
						console.log('uvGetRect res', res)
						resolve(res.height)
					})
					// #endif

					// #ifdef APP-NVUE
					const ref = this.$refs.productName
					dom.getComponentRect(ref, (res) => {
						resolve(res.size.height)
					})
					// #endif
				})
			},
			handleSelect(item) {
				if (item.uStatus !== 1) {
					return uni.$uv.toast('未完成工艺无法选择')
				}
				const existItem = this.hasSelection(item.productTechnologyId)
				if (existItem) {
					this.selection = this.selection.filter(x => x.productTechnologyId !== item.productTechnologyId)
				} else {
					this.selection.push(item)
				}
			},
			onConfirm() {
				if (this.selection.length === 0) {
					return uni.$uv.toast('请选择报工工艺')
				}
				this.$refs.popup.open();
			},
			onCancel() {
				this.$refs.popup.close();
			},
			onFinish() {
				BatchScanResult({
					scanResult: this.scanResult,
					technologyids: technologyids
				}).then(res => {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/font/iconfont.css";

	.page-container {
		background: linear-gradient(180deg, #D5E8FF 0%, #FFFFFF 100%), #F2F2F2;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.data-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 40rpx 10rpx;
		overflow-y: auto;

		.data-contain {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-bottom: 10rpx;
		}
	}

	.list-item {
		background-color: #fff;
		padding: 38rpx;
		border-radius: 23rpx;
		border: 6rpx solid #F2F2F2;

		&.small {
			padding: 28rpx;
		}

		&.active {
			border-color: #FF6F1E;
		}
	}

	.item-image {
		max-height: 76.34rpx;
		max-width: 76.34rpx;
	}

	.item-name {
		text-align: center;
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
		margin-top: 7rpx;
	}

	.order-modal {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 31rpx 31rpx 0 0;
		box-shadow: 0rpx -6rpx 12rpx 0rpx #e6e6e6;

		.order-no {
			font-weight: bold;
			font-size: 42rpx;
			color: #333333;
			line-height: 61rpx;
		}

		.checktime {
			color: #808080;
			font-size: 27rpx;
			line-height: 38rpx;
		}

		.order-company {
			font-weight: 500;
			font-size: 27rpx;
			color: #333333;
			line-height: 38rpx;
		}

		.order-info {
			font-size: 27rpx;
			color: #808080;
			line-height: 38rpx;

			.tag-wrap {
				width: 111rpx;
				height: 46rpx;
				background: #F5F6F8;
				border-radius: 191rpx 191rpx 191rpx 191rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.popup-title {
		padding-top: 100rpx;
		padding-bottom: 50rpx;
	}

	.list-button {
		flex: 1;
		height: 90rpx;
		background-color: #2FB7DF;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		&.default {
			background-color: #F0F0F0;
		}
	}

	.button-text {
		font-weight: 500;
		font-size: 34rpx;
		line-height: 42rpx;
		vertical-align: super;
	}

	.iconfont {
		font-size: 76.34rpx;
		color: #808080;

		&.active {
			color: #2FB7DF;
		}
	}
</style>