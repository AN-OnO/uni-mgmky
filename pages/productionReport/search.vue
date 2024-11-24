<template>
	<view>
		<uv-status-bar></uv-status-bar>
		<view style="display: flex; margin: 30rpx;">
			<uv-icon name="arrow-left" size="20" @click="goback"></uv-icon>
			<uv-search v-model="keywords" :showAction='false' @search='search'></uv-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keywords: ''
			}
		},
		onLoad(options) {

		},
		onShow() {

		},
		methods: {
			goback() {
				uni.$Utils.navigateBack()
			},
			search() {
				uni.$uv.toast(this.keywords)
			}
		}
	}
</script>

<style>

</style>