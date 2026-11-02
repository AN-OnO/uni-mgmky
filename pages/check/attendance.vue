<template>
	<view class="container">
		<!-- 顶部标签栏 -->
		<view class="ticket tab-bar">
			<view class="tag">
				<view class="tab" :class="{ active: filterType === 'all' }" @click="filterRecords('all')">全部</view>
				<view class="tab" :class="{ active: filterType === 'missed' }" @click="filterRecords('missed')">未打卡</view>
				<view class="tab" :class="{ active: filterType === 'supplement' }" @click="filterRecords('supplement')">补卡</view>
			</view>
			<view class="search">
				<image class="search-icon" src="/static/images/ticket/search.svg" @click="onSearch"></image>
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
				<image class="date-icon" src="/static/images/ticket/clock.svg"></image>
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
	.container {
		min-height: 100%;
		background: var(--ticket-paper);
		padding: 24rpx 32rpx 40rpx;
		box-sizing: border-box;
	}

	.tab-bar {
		display: flex;
		justify-content: space-between;
		margin-bottom: 32rpx;
		align-items: center;
		font-size: 34rpx;
	}

	.tag {
		display: flex;
		justify-content: space-between;
	}

	.tab {
		position: relative;
		padding: 16rpx 20rpx;
		color: var(--ink-muted);
		text-decoration: none;
	}

	.tab.active {
		color: var(--ink-black);
		font-weight: 700;
	}

	.tab.active::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 2rpx;
		width: 40%;
		height: 8rpx;
		background-color: var(--stamp-red);
		border-radius: 0;
	}

	.search-icon {
		margin: 18rpx 18rpx 0 0;
		width: 48rpx;
		height: 48rpx;
		cursor: pointer;
	}

	.stats-bar {
		display: flex;
		justify-content: space-between;
		margin: 0 0 28rpx;
		align-items: center;
	}

	.picker-container {
		position: relative; 
		display: flex;
		align-items: center;
	}

	.picker-view {
		min-width: 240rpx;
		text-align: center;
	}

	.triangle-down {
		width: 0;
		height: 0;
		border-left: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
		border-top: 16rpx solid #545454; 
		margin-top: 4rpx;
		margin-left: -72rpx; 
		border-radius: 0;
	}

	.count{
		display: flex;
		justify-content: space-between;
	}

	.num {
		color: #B42318;
		font-family: ui-monospace, Menlo, Consolas, monospace;
	}

	.record-list {
		margin: 12rpx;
	}

	.record-item {
		padding: 16rpx 8rpx;
		border-bottom: 2rpx dashed #C4B8A1;
		background: #FFF8E7;
	}

	.record-date {
		text-align: right;
	}

	.date-icon {
		height: 30rpx;
		width: 30rpx;
	}

	.record-color {
		color: var(--ink-muted);
	}

	.record-time {
		margin-bottom: 10rpx; 
	}

	.record-no-times {
		color: #B42318;
	}

	.supplement-label{
		color: #FB762B;
	}
</style>
