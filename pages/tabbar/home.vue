<template>
	<view class="page-container flex-column">
		<view class="flex-column margin-left">
			<image class="app-title-cover" :src="$IMG_URL +'/app/印业小助手.svg'" mode="widthFix"></image>
			<text class="app-description margin-top-sm">轻松掌握每一步</text>
		</view>
		<view class="flex-row margin-top-lg margin-bottom-sm">
			<view class="flex-row flex-1 align-center card margin-right-sm" @click="handleToolEvent(tools[0])">
				<image class="image-icon" :src="$IMG_URL +'/app/考勤打卡1.png'"></image>
				<text>考勤打卡</text>
			</view>
			<view class="flex-row flex-1 align-center card relative" @click="handleToolEvent(tools[1])">
				<image class="image-icon" :src="$IMG_URL +'/app/统计报表1.png'"></image>
				<text>统计报表</text>
				<image class="top-img" :src="$IMG_URL +'/app/AI智能.svg'" mode="heightFix"></image>
			</view>
		</view>
		<view class="card tool-box margin-bottom">
			<view class="padding-tb-sm">
				<text class="section-title">常用工具</text>
			</view>
			<view class="grid-row-3 margin-top">
				<template v-for="(item,index) in tools" :key="index">
					<view class="flex-column align-center justify-around radius" @click="handleToolEvent(item)">
						<image class="tool-image-icon" :src="$IMG_URL+item.icon"></image>
						<text class="text-xs">{{item.name}}</text>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	const tools = ref([{
		icon:  '/app/考勤打卡.svg',
		name: '考勤打卡',
		event: '/pages/check/check'
	}, {
		icon: '/app/统计报表.svg',
		name: '统计报表',
		event: '/pages/statisticalForm/index'
	}, {
		icon: '/app/报工.svg',
		name: '报工',
		event: '/pages/productionReport/list'
	}, {
		icon: '/app/配送.svg',
		name: '配送',
		event: '/pages/logistics/list?deliveryMethod=3'
	}, {
		icon: '/app/物流.svg',
		name: '物流',
		event: '/pages/logistics/list?deliveryMethod=4'
	}])

	const handleToolEvent = (e) => {
		if (e.event) {
			uni.navigateTo({
				url: e.event
			})
		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		position: relative;
		z-index: 1;
		padding-top: calc(var(--window-top) + var(--status-bar-height) + 44px);
		padding-left: 30rpx;
		padding-right: 30rpx;

		&::before {
			content: "";
			position: fixed;
			z-index: -1;
			top: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
			background-image: url($IMG_URL+'/app/home_background.png')
		}
	}

	.app-title {
		font-size: 53rpx;
		font-weight: bold;
		letter-spacing: 1px;
		line-height: 80rpx;
	}

	.app-title-cover {
		width: 300rpx;
		height: auto;
	}

	.app-description {
		color: #808487;
		font-size: 31rpx;
		line-height: 46rpx;
	}

	.card {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 15rpx;
	}

	.image-icon {
		height: 106rpx;
		width: 106rpx;
	}

	.tool-box {
		min-height: 668rpx;
	}

	.tool-image-icon {
		height: 92rpx;
		width: 92rpx;
	}

	.relative {
		position: relative;
	}

	.top-img {
		position: absolute;
		z-index: -1;
		top: -220rpx;
		height: 290rpx;
		width: auto;
	}

	.section-title {
		position: relative;
		left: 16rpx;
		padding-left: 0.7em;

		&::before {
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
	}

	.grid-row-3 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 160rpx;
		gap: 20rpx;
	}
</style>