<template>
	<view class="container">
    <!-- 筛选按钮区域 -->
		<view class="filter-bar">
			<button @click="filterRecords('pending')" class="filter-button">待处理 ({{ pendingCount }})</button>
			<button @click="filterRecords('all')" class="filter-button">所有</button>
			<button @click="filterRecords('processed')" class="filter-button">已处理</button>
			<view class="search" @click="searchRecords">
				<image src="../../../static/images/check/搜索.png" class="search-img" />
			</view>
		</view>

    <!-- 补卡记录列表区域 -->
		<view class="record-list">
			<block v-for="(record, index) in filteredRecords" :key="index">
				<view class="record-item">
					<view class="record-ststus">
						<image v-if="record.status === '已通过'" src="/static/images/check/已通过 .png" class="status-icon"/>
						<image v-else-if="record.status === '未通过'" src="/static/images/check/未通过.png" class="status-icon"/>
						<text v-else class="await">{{ record.status }}</text>
					</view>
					<view class="record-date">
						<image class="time-icon" src="/static/images/check/时间.png" />
						<text>补卡时间 {{ record.date }} {{ record.time }}</text>
					</view>
					<view class="record-reason">
						<image class="reason-icon" src="/static/images/check/理由.png" />
						<text>补卡理由 {{ record.reason }}</text>
					</view>
					<view class="record-pass">
						<text>{{ record.passDate }} {{ record.passTime }}</text>
					</view>
				</view>
			</block>
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
	}

	.filter-bar {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin: 0 10px 10px 0;
	}

	.filter-button {
		height: 40px;
		line-height: 40px;
		font-size: 12px;
		padding: 0px 16px;
		background-color: #fff;
		color: #808080;
		border-radius: 4px;
		border: none;
	}

	.filter-button:hover {
		background-color: #58c3de;
		color: #fff;
	}
	
	.search {
		margin-left: 90px;
		display: flex;
		align-items: center;
	}
	
	.search-img {
		width: 24px;
		height: 24px;
	}

	.record-list {
		margin-top: 14px;
	}

	.record-item {
		display: flex;
		align-items: center;
		margin-bottom: 3px;
		padding: 8px;
		background-color: #fff;
		border-radius: 6px 6px 6px 6px;
		font-size: 14px;
	}
	
	.record-status {
	  display: flex;
	  align-items: center;
	  margin-left: auto; /* 将状态推到右边 */
	}
	
	.await {
		color: #FB762B;
	}
	
	.status-icon,
	.time-icon,
	.reason-icon{
		height: 20px;
		width: 20px;
	}
	
	.record-pass {
	  margin-left: 8px; 
	}
</style>

