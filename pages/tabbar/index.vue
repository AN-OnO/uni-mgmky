<template>
	<view class="tab-shell">
		<view v-if="current==0" class="tab-page">
			<home></home>
		</view>
		<view v-if="current==1" class="tab-page">
			<user></user>
		</view>
		<tabbar-nav :list="list" @change="handleChange"></tabbar-nav>
	</view>
</template>

<script>
	import home from './home.vue'
	import user from './user.vue'
	export default {
		components: {
			home,
			user
		},
		data() {
			return {
				current: 0,
				list: [{
					"page": "home",
					"text": "首页",
					"iconPath": "/static/images/tabbar/home.svg",
					"selectedIconPath": "/static/images/tabbar/home_active.svg"
				}, {
					"page": "user",
					"text": "我的",
					"iconPath": "/static/images/tabbar/mine.svg",
					"selectedIconPath": "/static/images/tabbar/mine_active.svg"
				}]
			}
		},
		onShow() {
			const page = uni.$Utils.getStorage('tabbar') || 'home'
			this.current = this.list.map(x => x.page).indexOf(page)

		},
		methods: {
			handleChange(index) {
				this.current = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab-shell {
		min-height: 100%;
	}

	.tab-page {
		:deep(.tabbar-nav-root) {
			display: none;
		}
	}
</style>