<template>
	<view>
		<view style="display: flex; justify-content: space-between;align-items: center;">
			<uv-drop-down ref="dropDown" sign="dropDown_1" :defaultValue="[0,'new','now']" class="drop-down">
				<uv-drop-down-item name="time" type="2" label="今日" value="now">
				</uv-drop-down-item>
			</uv-drop-down>
			<uv-drop-down-popup sign="dropDown_1" :currentDropItem="currentDropItem">
				<view style="width: 750rpx;height: 300rpx;background-color: #fff;"></view>
			</uv-drop-down-popup>
			<uv-subsection :list="list" :current="current" @change="change"
				style="width: 374rpx;border-radius: 15rpx; margin-right: 28rpx;"></uv-subsection>
		</view>
		<view style="padding: 30rpx;">
			<text class="section-title">订单数量统计(单)</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: ['日', '周', '月', '年'],
				current: 0,
				currentDropItem: {
					label: '今日',
					value: 'now',
					child: [{
						label: '今日',
						value: 'now'
					}, {
						label: '昨日',
						value: 'new'
					}, {
						label: '前日',
						value: 'money'
					}]
				},
			}
		},
		onPageScroll() {
			// 滚动后及时更新位置
			this.$refs.dropDown.init();
		},
		methods: {
			change(index) {
				this.current = index;
			}

		}
	}
</script>

<style>
	.drop-down .uv-sticky__content .uv-drop-down {
		border: 0;
	}
	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}
	.section-title::before {
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
</style>