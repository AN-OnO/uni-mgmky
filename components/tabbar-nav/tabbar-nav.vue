<script setup>
	import {
		ref,
		onMounted,
		computed
	} from "vue";
	import { ROUTE_GUARD_ENABLED } from '@/common/intercept'

	const defaultPage = 'home'
	const current = ref(defaultPage)

	onMounted(() => {
		const page = uni.$Utils.getStorage('tabbar')
		current.value = page || defaultPage
	})

	const emits = defineEmits(['change'])

	const props = defineProps({
		list: {
			type: Array,
			default: () => [{
				page: 'home',
				text: '首页',
				iconPath: '/static/images/tabbar/home.svg',
				selectedIconPath: '/static/images/tabbar/home_active.svg'
			}, {
				page: 'user',
				text: '我的',
				iconPath: '/static/images/tabbar/mine.svg',
				selectedIconPath: '/static/images/tabbar/mine_active.svg'
			}]
		},
		navHeight: {
			type: String,
			default: '88px'
		},
		customClass: String
	})

	const jump = (item, index) => {
		if (current.value !== item.page) {
			if (ROUTE_GUARD_ENABLED && index == 1) {
				const isLogin = uni.$Utils.getStorage('token')
				if (!isLogin) {					
					uni.showModal({
						title: '提示',
						content: '此功能需要登录后才能体验',
						success(res) {
							res.confirm && uni.navigateTo({
								url: '/pages/index/login',
								animationType: 'pop-in',
								animationDuration: 300
							})
						},
					})
					
					return
				}
			}
			
			current.value = item.page
			uni.$Utils.setStorage('tabbar', item.page)
			emits('change', index)
			uni.$emit('tabbar-page', item.page)
			const pages = getCurrentPages()
			const route = pages[pages.length - 1]?.route
			if (route && route !== 'pages/tabbar/index') {
				uni.reLaunch({
					url: '/pages/tabbar/index'
				})
			}
		}
	}
</script>

<template>
	<view class="tabbar-nav-root">
		<view :class="['tabbar-nav',customClass]">
			<template v-for="(item,index) in list" :key="index">
				<view class="nav-item flex-column align-center" :class="{ 'is-current': item.page==current }" @click="jump(item,index)">
					<image class="nav-svg" mode="aspectFit" :src="item.page==current?item.selectedIconPath:item.iconPath"></image>
					<text>{{item.text}}</text>
				</view>
			</template>
		</view>
		<view class="nav-placeholder"></view>
	</view>
</template>

<style lang="scss" scoped>
	.tabbar-nav-root {
		position: relative;
		z-index: 9999;
	}

	.tabbar-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		padding: 6px 10px calc(6px + constant(safe-area-inset-bottom));
		padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
		background-color: var(--ticket-face, #FFF8E7);
		border-radius: 0;
		border-top: 2rpx solid rgba(28, 25, 23, 0.18);
		box-shadow: 0 -8rpx 24rpx rgba(92, 64, 32, 0.08);
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: calc(56px + constant(safe-area-inset-bottom));
		height: calc(56px + env(safe-area-inset-bottom));
	}

	.nav-item {
		font-size: 12px;
		letter-spacing: 0.08em;
		color: var(--ink-muted, #6B6258);

		.nav-svg {
			height: 28px;
			width: 28px;
			display: block;
			flex-shrink: 0;
		}

		&.is-current {
			color: var(--stamp-red, #B42318);
			font-weight: 700;
		}
	}

	.nav-placeholder {
		width: 100%;
		height: calc(56px + constant(safe-area-inset-bottom));
		height: calc(56px + env(safe-area-inset-bottom));
	}
</style>