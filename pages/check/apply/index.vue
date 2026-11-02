<template>
	<view class="container" :style="{ backgroundColor: getBackgroundColor() }">
		<view class="tab-bar">
			<view class="tab-item" :class="{ active: currentTab === 0 }" @click="switchTab(0)">申请补卡</view>
			<view class="tab-item" :class="{ active: currentTab === 1 }" @click="switchTab(1)">补卡记录</view>
		</view>
    
		<view class="page-content">
			<apply v-if="currentTab === 0" />
			<records v-else />
		</view>
	</view>
</template>

<script>
import Apply from './apply.vue';
import Records from './records.vue';

export default {
	components: {
		Apply,
		Records
	},
	data() {
		return {
			currentTab: 0 // 默认显示申请补卡页面
		};
	},
	methods: {
		switchTab(index) {
			this.currentTab = index;
		},
		getBackgroundColor() {
			return '#F3E6C8';
		}
	}
};
</script>

<style>
.container {
	padding-top: 0; 
	background-color: var(--ticket-paper) !important; 
}

.tab-bar {
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: var(--ticket-face); 
	padding: 20rpx 0;
	border-bottom: 2rpx solid var(--ticket-edge);
}

.tab-item {
	flex: 1;
	text-align: center;
	font-size: 34rpx;
	min-height: 88rpx;
	line-height: 88rpx;
	color: var(--ink-black);
	cursor: pointer;
	position: relative; /* 为伪元素定位 */
}

.tab-item.active::after {
	content: '';
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 8rpx;
	width: 8%;
	height: 6rpx;
	background-color: #B42318; 
	border-radius: 0;
}

.page-content {
	padding: 24rpx 32rpx 40rpx; 
}
</style>

