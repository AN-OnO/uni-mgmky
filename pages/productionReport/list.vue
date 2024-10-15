<template>
	<view class="page-container">
		<uv-sticky bg-color="#333">
			<view class="top-nav">
				<view class="nav-item border-left">
					<text class="nav-title">1103</text>
					<text class="nav-label">今日完成(件)</text>
				</view>
				<view class="nav-item">
					<text class="nav-title">2164.43</text>
					<text class="nav-label">今日收益(元)</text>
				</view>
			</view>
		</uv-sticky>
		<view class="data-list padding">
			<template v-for="(item,index) in list" :key="index">
				<view :class="'list-item ' + (index == selectedIndex ? 'active' : '')"
					@click="handleSelect(item,index)">
					<view class="item-image">
						<image class="image-icon" :src="item.photo" mode="aspectFit" />
						<text v-if="item.orderNum > 0" class="badge-tag">{{ item.orderNum }}</text>
					</view>
					<text class="item-name">{{ item.name }}</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '开单',
					orderNum: 98,
					photo: '/static/images/productionReport/开单.png'
				}, {
					name: '快递',
					orderNum: 10,
					photo: '/static/images/productionReport/快递.png'
				}, {
					name: '制作',
					orderNum: 0,
					photo: '/static/images/productionReport/制作.png'
				}, {
					name: '审核',
					orderNum: 0,
					photo: '/static/images/productionReport/审核.png'
				}, {
					name: '拼版',
					orderNum: 0,
					photo: '/static/images/productionReport/拼版.png'
				}, {
					name: '印刷',
					orderNum: 984,
					photo: '/static/images/productionReport/印刷.png'
				}, {
					name: '质检',
					orderNum: 0,
					photo: '/static/images/productionReport/质检.png'
				}, {
					name: '分货架',
					orderNum: 0,
					photo: '/static/images/productionReport/分货架.png'
				}, {
					name: '出库',
					orderNum: 11,
					photo: '/static/images/productionReport/出库.png'
				}, {
					name: '排产',
					orderNum: 0,
					photo: '/static/images/productionReport/排产.png'
				}, {
					name: '入库',
					orderNum: 0,
					photo: '/static/images/productionReport/入库.png'
				}, {
					name: '骑马钉',
					orderNum: 0,
					photo: '/static/images/productionReport/骑马钉.png'
				}],
				selectedIndex: null
			}
		},
		methods: {
			handleSelect(item, index) {
				this.selectedIndex = index
			}
		}
	}
</script>

<style>
	page {
		background-color: #F0F1F5;
	}
</style>
<style lang="scss" scoped>
	.top-nav {
		display: flex;
		flex-direction: row;
		padding-top: 15rpx;
		padding-bottom: 30rpx;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;

		.nav-title {
			font-size: 46rpx;
			line-height: 69rpx;
			color: #fff;
		}

		.nav-label {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.6);
		}
	}

	.nav-item.border-left {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			height: 76rpx;
			width: 1px;
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.data-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 168rpx;
		gap: 20rpx;
	}

	.list-item {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 15rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&.active {
			background-color: #333;
			color: #fff;
		}
	}

	.item-image {
		position: relative;

		.image-icon {
			height: 122rpx;
			width: 122rpx;
		}

		.badge-tag {
			position: absolute;
			top: -12rpx;
			right: -20rpx;
			min-width: 40rpx;
			height: 32rpx;
			text-align: center;
			background-color: #F07936;
			color: #FFFFFF;
			padding: 0 12rpx;
			border-radius: 100rpx;
			border: 4rpx solid #F8F8F8;
			font-size: 24rpx;
		}
	}

	.item-name {
		flex: 1;
		text-align: center;
		font-size: 34rpx;
	}
</style>