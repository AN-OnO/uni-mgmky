<template>
	<view class="page-container">
		<view class="data-list padding">
			<view v-for="(item,index) in technologies" :key="index" class="data-contain">
				<view :class="['list-item',{'active':hasSelection(item.code)}]" @click="handleSelect(item)">
					<image class="item-image" :src="item.photo" mode="aspectFit" />
				</view>
				<text class="item-name">{{ item.name }}</text>
			</view>
		</view>

		<view class="order-modal">
			<text class="order-no">240820000041478</text>
			<view class="order-company">
				<text class="margin-right-sm">TO63226</text>
				<text>汝河路-永昌广告印务</text>
			</view>
			<view class="order-info">
				<text
					:class="[{'uv-line-2':!showMore}]">特价喷墨画册【喷墨画册】：260x185mm-封面：200g铜版纸-单面彩色-封面哑膜-内页,200g铜版纸-单面彩色-封面哑膜-内页</text>
				<view class="flex-row justify-end padding-top-xs">
					<view class="tag-wrap">
						<uv-icon @click="showMore = !showMore" :name="showMore?'arrow-up':'arrow-down'"
							:label="showMore?'收起':'展开'" label-size="23rpx" size="28rpx" label-pos="left" color="#808080"
							label-color="#808080"></uv-icon>
					</view>
				</view>
			</view>
			<view class="padding-top-lg">
				<button type="default" class="list-button">
					<text class="button-text">确认</text>
				</button>
			</view>
			<uv-safe-bottom></uv-safe-bottom>
		</view>

		<uv-popup ref="popup" mode="bottom" round="31rpx" closeable>
			<view style="width: 600rpx;">


				<view>
					<button type="default" class="list-button">
						<text class="button-text">取消</text>
					</button>
					<button type="default" class="list-button">
						<text class="button-text">确认</text>
					</button>
				</view>
			</view>
		</uv-popup>

		<uv-loading-page :loading="loading"></uv-loading-page>
	</view>
</template>

<script>
	import {
		ListMyProductionTechnology
	} from '@/apis/production.js'
	export default {
		data() {
			return {
				technologies: [],
				showMore: false,
				loading: true,
				selection: []
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			hasSelection() {
				return (code) => {
					return this.selection.map(x => x.code).includes(code)
				}
			}
		},
		methods: {
			init() {
				this.loading = true
				ListMyProductionTechnology().then(res => {
					console.log('ListMyProductionTechnology api result:', res)
					if (res.code === 0) {
						const {
							employeeId,
							employeeName,
							purchaseSupplierInfos,
							technologies
						} = res.data
						this.technologies = technologies
					}
				}).finally(() => this.loading = false)
			},
			handleSelect(item) {
				const existCode = this.hasSelection(item.code)
				if (existCode) {
					this.selection = this.selection.filter(x => x.code !== item.code)
				} else {
					this.selection.push(item)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		background: linear-gradient(180deg, #D5E8FF 0%, #FFFFFF 100%), #F2F2F2;
		height: 100vh;
		display: flex;
		flex-direction: column;
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

	.list-button {
		height: 90rpx;
		background: #2FB7DF;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button-text {
		font-weight: 500;
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 42rpx;
		vertical-align: super;
	}
</style>