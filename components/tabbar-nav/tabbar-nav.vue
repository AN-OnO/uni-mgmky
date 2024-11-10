<script setup>
	import {
		ref,
		onMounted,
		computed
	} from "vue";

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
			default: () => []
		},
		navHeight: {
			type: String,
			default: '88px'
		},
		customClass: String
	})

	const jump = (item, index) => {
		if (current.value !== item.page) {
			current.value = item.page
			uni.$Utils.setStorage('tabbar', item.page)
			emits('change', index)
		}
	}
</script>

<template>
	<view>
		<view :class="['tabbar-nav',customClass]">
			<template v-for="(item,index) in list" :key="index">
				<view class="nav-item flex-column align-center" @click="jump(item,index)">
					<image class="nav-svg" :src="item.page==current?item.selectedIconPath:item.iconPath"></image>
					<text>{{item.text}}</text>
				</view>
			</template>
		</view>
		<view class="nav-placeholder"></view>
	</view>
</template>

<style lang="scss" scoped>
	.nav-height {
		height: v-bind(navHeight);
		// height: calc(v-bind(navHeight) + constant(safe-area-inset-bottom));
		// height: calc(v-bind(navHeight) + env(safe-area-inset-bottom));
	}

	.tabbar-nav {
		position: fixed;
		bottom: 0;
		left: var(--window-left);
		right: var(--window-right);
		z-index: 900;
		padding: 10px;
		// padding-bottom: calc(10px + constant(safe-area-inset-bottom));
		// padding-bottom: calc(10px + env(safe-area-inset-bottom));
		background-color: #fff;
		border-radius: 16px 16px 0 0;
		box-shadow: 2px 0px 10px 2px #eee;
		overflow: hidden;
		box-sizing: border-box;
		transition-property: all;
		display: flex;
		justify-content: space-around;
		@extend .nav-height;
	}

	.nav-item {
		font-size: 14px;

		.nav-svg {
			height: 38px;
			width: 38px;
		}
	}

	.nav-placeholder {
		width: 100%;
		@extend .nav-height;
	}
</style>