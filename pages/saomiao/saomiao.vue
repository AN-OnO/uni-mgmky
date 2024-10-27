<template>
	<view>
		<mumu-get-qrcode @success='qrcodeSucess' @error="qrcodeError"></mumu-get-qrcode>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			qrcodeSuccess(data) {
				uni.showModal({
					title: '成功',
					content: data,
					success: () => {
			
					}
				})
			},
			qrcodeError(err) {
				console.log('qrcode error', err)
				uni.showModal({
					title:'摄像头授权失败',
					content:'摄像头授权失败，请检测当前浏览器是否有摄像头权限。',
					success: () => {
						
					}
				})
			}
		}
	}
</script>

<style>

</style>
