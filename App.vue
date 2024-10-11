<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "@/static/css/common.scss";
	@import "@/uni_modules/uv-ui-tools/index.scss";
	
	page{
		background-color: #F0F1F5;
	}
</style>
