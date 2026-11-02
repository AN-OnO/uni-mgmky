<template>
	<view>
		<view class="page-container">
		<view class="ticket masthead">
			<text class="app-brand">印业小助手</text>
			<text class="app-description">轻松掌握每一步</text>
		</view>
		<view v-if="menu.filter(item => item.display).length" class="ticket menu-ticket">
			<view class="menu-row">
				<template v-for="item in menu" :key="item.name">
					<view v-if="item.display" class="menu-item" @tap="handleToolEvent(item)">
						<image class="image-icon" :src="item.icon"></image>
						<text>{{item.name}}</text>
						<image v-if="item.topIcon" class="top-img" :src="item.topIcon" mode="heightFix"></image>
					</view>
				</template>
			</view>
		</view>
		<view v-if="tools.length" class="ticket ticket--tools tool-box">
			<text class="section-title">常用工具</text>
			<view class="tool-list">
				<view
					v-for="item in tools"
					:key="item.name"
					class="tool-row"
					@tap="handleToolEvent(item)"
				>
					<image class="tool-image-icon" :src="item.icon"></image>
					<text class="tool-name">{{item.name}}</text>
					<image class="tool-chevron" src="/static/images/ticket/chevron.svg"></image>
				</view>
			</view>
		</view>
		</view>
		<tabbar-nav />
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
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
			icon: '/static/images/ticket/stats.svg',
			topIcon: '/static/images/ticket/ai.svg',
			name: '统计报表',
			event: '/pages/statisticalForm/index'
		}, {
			key: 3,
			type: 'tools',
			icon: '/static/images/ticket/check.svg',
			name: '考勤打卡',
			event: '/pages/check/check'
		}, {
			key: 4,
			type: 'tools',
			icon: '/static/images/ticket/stats.svg',
			name: '统计报表',
			event: '/pages/statisticalForm/index'
		}, {
			key: 5,
			type: 'tools',
			icon: '/static/images/ticket/report.svg',
			name: '报工',
			event: '/pages/productionReport/index'
		}, {
			key: 6,
			type: 'tools',
			icon: '/static/images/ticket/delivery.svg',
			name: '配送',
			event: '/pages/logistics/list?deliveryMethod=3'
		}, {
			key: 7,
			type: 'tools',
			icon: '/static/images/ticket/logistics.svg',
			name: '物流',
			event: '/pages/logistics/list?deliveryMethod=4'
		}, {
			key: 8,
			type: 'tools',
			icon: '/static/images/tabbar/返单.svg',
			name: '返单',
			event: '/pages/returnOrder/index'
		}, {
			key: 9,
			type: 'tools',
			icon: '/static/images/tabbar/dailyReport.svg',
			name: '生产日报表',
			event: '/pages/dailyReport/dailyReport'
		}, {
			key: 10,
			type: 'tools',
			icon: '/static/images/ticket/delivery.svg',
			name: '新版配送',
			event: '/pages/logistics/newList?deliveryMethod=3'
		}, {
			key: 11,
			type: 'tools',
			icon: '/static/images/ticket/logistics.svg',
			name: '新版物流',
			event: '/pages/logistics/newList?deliveryMethod=4'
		},
		{
			key: 5,// 临时
			type: 'tools',
			icon: '/static/images/ticket/search.svg',
			name: '查看订单',
			event: '/pages/orderLookup/index'
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
		if (!e.event) return
		// if (e.event === 'startScan') {
		// 	uni.navigateTo({
		// 		url: '/pages/orderLookup/index'
		// 	})
		// 	return
		// }
		uni.navigateTo({
			url: e.event
		})
	}
</script>

<style lang="scss" scoped>
	.page-container {
		position: relative;
		min-height: 100%;
		padding-top: calc(var(--status-bar-height) + 44px + 16px);
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 24rpx;
		background: var(--ticket-paper);
		box-sizing: border-box;
	}

	.masthead {
		margin-bottom: 28rpx;
	}

	.menu-ticket {
		margin-bottom: 28rpx;
	}

	.app-brand {
		display: block;
		font-size: 52rpx;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-black);
		line-height: 1.2;
	}

	.app-description {
		display: block;
		color: var(--ink-muted);
		font-size: 28rpx;
		line-height: 44rpx;
		margin-top: 8rpx;
	}

	.menu-row {
		display: flex;
		flex-direction: row;
		gap: 16rpx;
	}

	.menu-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 16rpx 8rpx;
		min-height: 88rpx;
	}

	.image-icon {
		height: 88rpx;
		width: 88rpx;
	}

	.tool-box {
		margin-bottom: 24rpx;
	}

	.tool-list {
		display: flex;
		flex-direction: column;
	}

	.tool-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		min-height: 96rpx;
		padding: 4rpx 0;
		border-bottom: 2rpx dashed var(--perf-line);
	}

	.tool-row:last-child {
		border-bottom: none;
	}

	.tool-image-icon {
		height: 48rpx;
		width: 48rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.tool-name {
		flex: 1;
		font-size: 30rpx;
		line-height: 1.3;
		letter-spacing: 0.04em;
		color: var(--ink-black);
	}

	.tool-chevron {
		width: 28rpx;
		height: 28rpx;
		flex-shrink: 0;
		opacity: 0.55;
	}

	.top-img {
		position: absolute;
		z-index: 0;
		top: -12rpx;
		right: 8rpx;
		height: 48rpx;
		width: auto;
	}

	.section-title {
		display: block;
		font-weight: 700;
		letter-spacing: 0.08em;
		margin-bottom: 16rpx;
		color: var(--ink-black);
	}

</style>