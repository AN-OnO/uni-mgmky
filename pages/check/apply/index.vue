<template>
	<view class="container">
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
		}
	}
};
</script>

<style>
.container {
	padding-top: 0; 
}

.tab-bar {
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #fff; 
	padding: 10px 0; 
}

.tab-item {
	flex: 1;
	text-align: center;
	font-size: 18px;
	color: #333;
	cursor: pointer;
	position: relative; /* 为伪元素定位 */
}

.tab-item.active::after {
	content: '';
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: -6px; /* 根据需要调整下划线与文字的距离 */
	width: 8%; /* 调整这个宽度来缩短下划线 */
	height: 3px; /* 下划线的高度 */
	background-color: #000000; 
	border-radius: 6px;
}

.page-content {
	padding: 16px; 
}
</style>

