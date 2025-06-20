<template>
	<view class="page-container flex-column">
		<view class="flex-column margin-left">
			<image class="app-title-cover" :src="$IMG_URL +'/app/印业小助手.svg'" mode="widthFix"></image>
			<text class="app-description margin-top-sm">轻松掌握每一步</text>
		</view>
		<view class="flex-row margin-top-lg margin-bottom-sm relative">
			<template v-for="item in menu" :key="item.key">
				<view v-if="item.display" class="menu-item card " @tap="handleToolEvent(item)">
					<image class="image-icon" :src="item.icon"></image>
					<text>{{item.name}}</text>
					<image v-if="item.topIcon" class="top-img" :src="item.topIcon" mode="heightFix"></image>
				</view>
				<!-- <view v-else class="flex-1"></view> -->
			</template>
		</view>
		<view v-if="tools.length" class="card tool-box margin-bottom">
			<view class="padding-tb-sm">
				<text class="section-title">常用工具</text>
			</view>
			<view class="grid-row-3 margin-top">
				<template v-for="item in tools" :key="item.key">
					<view class="flex-column align-center justify-around radius" @tap="handleToolEvent(item)">
						<image class="tool-image-icon" :src="item.icon"></image>
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
	import {
		imageURL
	} from '@/common/config';
	import {
		useUserStore
	} from '@/store/user';
	const userStore = useUserStore();
	// 首页应用菜单
	const appMenus = ref([{
			key: 1,
			type: 'menu',
			icon: '/static/images/tabbar/gain.svg',
			name: '绩效收益',
			event: '/pages/performanceGain/index'
		},
		{
			key: 2,
			type: 'menu',
			icon: `${imageURL}/app/统计报表1.png`,
			topIcon: `${imageURL}/app/AI智能.svg`,
			name: '统计报表',
			event: '/pages/statisticalForm/index'
		}, {
			key: 3,
			type: 'tools',
			icon: `${imageURL}/app/考勤打卡.svg`,
			name: '考勤打卡',
			event: '/pages/check/check'
		}, {
			key: 4,
			type: 'tools',
			icon: `${imageURL}/app/统计报表.svg`,
			name: '统计报表',
			event: '/pages/statisticalForm/index'
		}, {
			key: 5,
			type: 'tools',
			icon: `${imageURL}/app/报工.svg`,
			name: '报工',
			event: '/pages/productionReport/index'
		}, {
			key: 6,
			type: 'tools',
			icon: `${imageURL}/app/配送.svg`,
			name: '配送',
			event: '/pages/logistics/list?deliveryMethod=3'
		}, {
			key: 7,
			type: 'tools',
			icon: `${imageURL}/app/物流.svg`,
			name: '物流',
			event: '/pages/logistics/list?deliveryMethod=4'
		}, {
			key: 8,
			type: 'tools',
			icon: '/static/images/tabbar/返单.svg',
			name: '返单',
			event: '/pages/returnOrder/index'
		},{
			key: 9,
			type: 'tools',
			icon: '/static/images/tabbar/dailyReport.svg',
			name: '生产日报表',
			event: '/pages/dailyReport/dailyReport'
		}
	]);
	// 用户菜单
	const userAppMenu = computed(() => userStore.userData.weChatAppMenu || '3,4,5');
	// 导航菜单
	const menu = computed(() => appMenus.value
		.filter(x => x.type === 'menu')
		.map(item => {
			return {
				...item,
				display: userAppMenu.value.includes(item.key)
			}
		})
	);
	// 工具菜单
	const tools = computed(() => appMenus.value
		.filter(x => x.type === 'tools' && userAppMenu.value.includes(x.key))
	);

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

	.menu-item {
		@include flex;
		align-items: center;
		flex: 1;
	}

	.menu-item+.menu-item {
		margin-left: 20rpx;
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
		right: 100rpx;
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