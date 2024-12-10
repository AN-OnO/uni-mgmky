<template>
	<view class="container">
		<!-- 顶部标签栏 -->
		<view class="tab-bar">
			<view class="tag">
				<view class="tab" :class="{ active: filterType === 'all' }" @click="filterRecords('all')">全部</view>
				<view class="tab" :class="{ active: filterType === 'missed' }" @click="filterRecords('missed')">未打卡</view>
				<view class="tab" :class="{ active: filterType === 'supplement' }" @click="filterRecords('supplement')">补卡</view>
			</view>
			<view class="search">
				<image class="search-icon" src="/static/images/check/搜索.png" @click="onSearch"></image>
			</view>
		</view>

		<!-- 日期选择和统计信息 -->
		<view class="stats-bar">
			<view class="picker-container">
				<picker mode="date" :value="selectedDate" @change="onDateChange" fields="month">
					<view class="picker-view">{{ formatMonth(selectedDate) || '选择月份' }}</view>
				</picker>
				<view class="triangle-down"></view>
			</view>
			<view class="count">
				<view class="stat-item">未打卡次数: <text class="num">{{ missedCount }}</text> </view>
				<view class="stat-item">,补卡次数: <text class="num">{{ supplementCount }}</text></view>
			</view>
		</view>

			<!-- 考勤记录列表 -->
		<view class="record-list">
			<view class="record-item" v-for="(record, index) in filteredRecords" :key="index">
				<view class="record-date">
				{{ record.date }}
				<image class="date-icon" src="/static/images/check/时间.png"></image>
			</view>
			<view class="record-times" v-if="record.times.length > 0">
				<view class="record-time" v-for="(time, timeIndex) in record.times" :key="timeIndex">
					<text class="record-color">打卡时间</text> {{ time }}
					<span v-if="record.isSupplement" class="supplement-label">(补卡)</span>
				</view>
			</view>
			<view class="record-no-times" v-else>未打卡</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			const today = new Date();
			const currentMonth = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}`;
			return {
				filterType: 'all', // 当前筛选类型
				records: [
					{ date: '2023-04-01', times: ['08:30', '17:30'], isSupplement: false },
					{ date: '2023-04-02', times: [], isSupplement: false },
					{ date: '2023-04-03', times: ['09:00'], isSupplement: true },
					{ date: '2023-05-04', times: ['08:45', '12:00', '17:30'], isSupplement: false },
					{ date: "2023-05-05", times: ["08:00", "16:00"], isSupplement: false },
					{ date: "2023-05-06", times: ["10:00", "14:00", "18:00"], isSupplement: true },
					{ date: "2023-05-07", times: [], isSupplement: true },
					{ date: "2023-06-08", times: ["07:30", "11:30", "15:30", "19:30"], isSupplement: false },
					{ date: "2023-06-09", times: ["13:00"], isSupplement: false },
					{ date: "2023-06-10", times: ["08:30", "12:30"], isSupplement: true },
				],
				selectedDate: currentMonth, 
			};
		},
		computed: {
			filteredRecords() {
				const selectedMonth = this.selectedDate;
				return this.records.filter(record => {
					const recordMonth = record.date.slice(0, 7);
					if (this.filterType === 'all') {
						return true;
					} else if (this.filterType === 'missed' && record.times.length === 0) {
						return true;
					} else if (this.filterType === 'supplement' && record.isSupplement) {
						return true;
					}
					return false;
				}).filter(record => {
					if (!selectedMonth) {
						return true;
					}
					return record.date.slice(0, 7) === selectedMonth;
				});
			},
			missedCount() {
				if (!this.selectedDate) return 0;
				return this.records
					.filter(record => record.date.startsWith(this.selectedDate)) 
					.filter(record => record.times.length === 0) 
					.length; 
				},
			supplementCount() {
				if (!this.selectedDate) return 0;
				return this.records
					.filter(record => record.date.startsWith(this.selectedDate)) 
					.filter(record => record.isSupplement) 
					.length; 
				}
		  },
		methods: {
			filterRecords(type) {
				this.filterType = type;
			},
			onDateChange(e) {
				this.selectedDate = e.detail.value.slice(0, 7); 
			},
			onSearch() {
			},
			formatMonth(month) {
				if (!month) return '';
				const [year, monthPart] = month.split('-');
				return `${monthPart}月`;
			},
			formatTimes(times) {
				return times.join(', ');
			},
		},
	};
</script>

<style scoped>
	.tab-bar {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		background-color: #eef4fb;
		font-size: 17px;
	}

	.tag {
		display: flex;
		justify-content: space-between;
	}

	.tab {
		position: relative;
		padding: 8px 10px;
		cursor: pointer;
		color: gray; 
		text-decoration: none; 
	}

	.tab.active {
		color: black; 
	}

	.tab.active::after {
		content: '';
		position: absolute;
		left: 50%; 
		transform: translateX(-50%);
		bottom: 1px; 
		width: 40%; 
		height: 4px; 
		background-color: black; 
		border-radius: 6px;
	}

	.search-icon {
		margin: 9px 9px 0 0;
		width: 24px;
		height: 24px;
		cursor: pointer;
	}

	.stats-bar {
		display: flex;
		justify-content: space-between;
		margin:-5px 10px 16px -30px;
		align-items: center;
	}

	.picker-container {
		position: relative; 
		display: flex;
		align-items: center;
	}

	.picker-view {
		min-width: 120px;
		text-align: center;
	}

	.triangle-down {
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid #545454; 
		margin-top: 2px;
		margin-left: -36px; 
		border-radius: 6px;
	}

	.count{
		display: flex;
		justify-content: space-between;
	}

	.num {
		color: #6fd1e1;
	}

	.record-list {
		margin: 6px;
	}

	.record-item {
		padding: 8px;
		border-bottom: 1px solid #eee;
	}

	.record-date {
		text-align: right;
	}

	.date-icon {
		height: 15px;
		width: 15px;
	}

	.record-color {
		color: #808080;
	}

	.record-time {
		margin-bottom: 5px; 
	}

	.record-no-times {
		color: #6fd1e1;
	}

	.supplement-label{
		color: #FB762B;
	}
</style>
