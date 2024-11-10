<template>
	<view>
		<view style="padding: 30rpx;">
			<text class="section-title">{{title}}</text>
		</view>
		<view style="padding: 0rpx 30rpx; margin-bottom: 61rpx;">
			<uni-table>
				<!-- 表头行 -->
				<uni-tr style="background: #FAFAFA;">
					<uni-th width="50" align="left">排名</uni-th>
					<uni-th width="100" align="left">{{name}}</uni-th>
					<uni-th width="70" align="right"><text class="quantity">数量</text></uni-th>
					<uni-th align="right"><text class="amount">金额</text></uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item, index) in orderRank" :key="index">
					<uni-td align="center">
						<image v-if="index < 3"
							:src="$IMG_URL+ (index == 0 ? '/statisticalForm/gold.svg' : index == 1 ? '/statisticalForm/silver.svg': '/statisticalForm/bronze.svg')"
							class='medal-img'></image>
						<text class="index-text" v-else>{{index + 1}}</text>
					</uni-td>
					<uni-td><uni-tooltip placement="right">
							<text
								class="line-clamp-name">{{item.productCategoryName || item.customerName || item.employeeName}}</text>
							<template v-slot:content>
								<view style="width: 200rpx;">
									{{item.productCategoryName || item.customerName || item.employeeName}}
								</view>
							</template>
						</uni-tooltip></uni-td>
					<uni-td align="right">{{item.orderCountStat}}</uni-td>
					<uni-td align="right">{{item.orderAmountStat}}</uni-td>
				</uni-tr>
				<uni-tr style="background: #FAFAFA;">
					<uni-td><text class="total-text">合计</text></uni-td>
					<uni-td></uni-td>
					<uni-td align="right"><text class="total-text">{{orderRankCount}}</text></uni-td>
					<uni-td align="right"><text class="total-text">{{orderRankAmount}}</text></uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="bottom-line"></view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			},
			orderRank: {
				type: Array,
				default: []
			},
			orderRankCount: {
				type: String,
				default: ''
			},
			orderRankAmount: {
				type: String,
				default: ''
			},
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		height: 1em;
		width: 0.25em;
		border-radius: 10px;
		background-color: #7BC7FC;
		top: 50%;
		transform: translateY(-50%);
	}

	.quantity {
		font-weight: bold;
		font-size: 27rpx;
		color: #6FD195;
		line-height: 34rpx;
	}

	.amount {
		font-weight: bold;
		font-size: 27rpx;
		color: #FF928A;
		line-height: 34rpx
	}

	.medal-img {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.total-text {
		font-weight: bold;
		font-size: 27rpx;
		color: #333333;
		line-height: 34rpx;
	}

	.index-text {
		font-weight: bold;
		font-size: 23rpx;
		color: #808080;
		line-height: 34rpx;
	}

	.line-clamp-name {
		height: 36rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.bottom-line {
		width: 100%;
		background: #F0F0F0;
		height: 15rpx;
	}
</style>