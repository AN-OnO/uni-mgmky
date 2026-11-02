<template>
	<view class="container">
    <!-- 筛选按钮区域 -->
		<view class="filter-bar">
			<button @click="filterRecords('pending')" class="filter-button">待处理 ({{ pendingCount }})</button>
			<button @click="filterRecords('all')" class="filter-button">所有</button>
			<button @click="filterRecords('processed')" class="filter-button">已处理</button>
			<view class="search" @click="searchRecords">
				<image src="/static/images/ticket/search.svg" class="search-img" />
			</view>
		</view>

    <!-- 补卡记录列表区域 -->
		<view v-for="record in filteredRecords" :key="record.id" class="ticket record-item">
			<view class="record-status">
				<image v-if="record.status === '已通过'" src="/static/images/check/已通过 .png" class="status-icon" />
				<image v-else-if="record.status === '未通过'" src="/static/images/check/未通过.png" class="status-icon" />
				<text v-else class="await">{{ record.status }}</text>
			</view>
			<view class="record-date">
				<image class="time-icon" src="/static/images/ticket/clock.svg" />
				<text>补卡时间：{{ record.date }} {{ record.time }}</text>
			</view>
			<view class="record-reason">
				<image class="reason-icon" src="/static/images/ticket/reason.svg" />
				<text>补卡理由：{{ record.reason }}</text>
			</view>
			<view class="record-pass">
				<text>{{ record.passDate }} {{ record.passTime }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return { 
			records: [
				{ id: 1, 
				status: '待处理', 
				date: '2023-10-01', 
				time: '09:20', 
				reason: '忘记打卡', 
				passDate: '2023-10-02', 
				passTime: '09:00'},
				{ id: 2, status: '已通过', date: '2023-10-02' },
				{ id: 3, status: '待处理', date: '2023-10-03' },
				{ id: 4, status: '未通过', date: '2023-10-04' },
			],
			currentFilter: 'all',
			pendingCount: 0
		};
	},
	computed: {
		filteredRecords() {
			if (this.currentFilter === 'all') {
				return this.records;
			} else if (this.currentFilter === 'pending') {
				return this.records.filter(record => record.status === '待处理');
			} else if (this.currentFilter === 'processed') {
				return this.records.filter(record => record.status === '已通过' || record.status === '未通过');
			}
			return [];
		}
	},
	methods: {
		filterRecords(filter) {
			this.currentFilter = filter;
			this.updatePendingCount();
		},
		searchRecords() {
			console.log('搜索补卡记录')
		},
		updatePendingCount() {
			this.pendingCount = this.records.filter(record => record.status === '待处理').length;
		}
	},
	mounted() {
		this.updatePendingCount();
	}
};
</script>

<style scoped>
	.container {
		padding: 24rpx 32rpx 40rpx;
		box-sizing: border-box;
		min-height: 100%;
		background: var(--ticket-paper);
	}

	.filter-bar {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin: 0 0 20rpx 0;
	}

	.filter-button {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		padding: 0 32rpx;
		margin: 0;
		background-color: var(--ticket-face);
		border: 2rpx solid var(--ticket-edge);
		color: var(--ink-muted);
		border-radius: 0;
	}

	.filter-button:hover {
		background-color: #B42318;
		color: #FFF8E7;
	}
	
	.search {
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 88rpx;
		min-height: 88rpx;
	}
	
	.search-img {
		width: 48rpx;
		height: 48rpx;
	}

	.record-item {
		margin-top: 24rpx;
		margin-bottom: 24rpx;
		padding: 16rpx 24rpx;
		font-size: 28rpx;
	}
	
	.record-status {
		text-align: right;
	}
	
	.record-pass {
		text-align: right;
		color: var(--ink-muted);
	}
	
	.await {
		color: #FB762B;
	}
	
	.status-icon {
		height: 40rpx;
		width: 40rpx;
	}
	
	.time-icon,
	.reason-icon{
		height: 30rpx;
		width: 30rpx;
		margin-right: 4rpx;
	}
	
	.record-date,
	.record-reason {
		display: flex;
		align-items: center;
		text-align: left;
		margin-left: 16rpx; 
	}
</style>

