<template>
	<view class="container" style="background-color: #ffffff;">
		<view class="search-box" style="background-color: #edf5ff;padding: 30rpx;">
			<input
				class="input"
				type="text"
				style="background-color: #ffffff;font-size: 15px;"
				placeholder="搜索日期/未打卡记录"
				confirm-type="search"
				v-model="searchQuery"
				@input="filterRecords"
			/>
		</view>
		<view class="record-list">
			<block v-for="(groupedRecord, index) in groupedAndFilteredRecords" :key="index">
				<view class="record-item">
					<view class="record-date">{{ groupedRecord.date }}</view>
					<view class="record-details">
						<block v-for="(record, subIndex) in groupedRecord.records" :key="subIndex">
							<view class="record-entry">
								<text class="record-type">{{ record.type }} {{ record.time }}</text>
							</view>
						</block>
					</view>
				</view>
			</block>
			<view v-if="groupedAndFilteredRecords.length === 0" class="no-records">
				暂无打卡记录或没有匹配的记录
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return {
			searchQuery: '', // 用于搜索的日期字符串
			records: [], // 所有的打卡记录
			groupedRecords: [], // 按日期分组后的打卡记录
			groupedAndFilteredRecords: [] // 分组并筛选后的打卡记录
		};
	},
	created() {
		this.loadRecords(); // 页面创建时加载打卡记录
	},
	methods: {
		loadRecords() {
			this.records = [
				{ date: '2023-04-01', type: '上班', time: '08:30' },
				{ date: '2023-04-01', type: '下班', time: '17:30' },
				{ date: '2023-04-02', type: '上班', time: '09:00' },
				{ date: '2023-04-02', type: '下班', time: '18:00' },
				{ date: '2023-04-03', type: '上班', time: '08:30' },
				{ date: '2023-04-03', type: '下班', time: '17:30' },
				{ date: '2023-04-04', type: '上班', time: '09:00' },
				{ date: '2023-04-04', type: '下班', time: '18:00' },
				{ date: '2023-04-05', type: '上班', time: '08:30' },
				{ date: '2023-04-05', type: '下班', time: '17:30' },
				{ date: '2023-04-06', type: '上班', time: '09:00' },
				{ date: '2023-04-06', type: '下班', time: '18:00' },
				{ date: '2023-04-07', type: '上班', time: '未打卡' },
				{ date: '2023-04-07', type: '下班', time: '17:30' },
				{ date: '2023-04-08', type: '上班', time: '09:00' },
				{ date: '2023-04-08', type: '下班', time: '18:00' },
				{ date: '2023-04-09', type: '上班', time: '08:30' },
				{ date: '2023-04-09', type: '下班', time: '17:30' },
				{ date: '2023-04-10', type: '上班', time: '09:00' },
				{ date: '2023-04-10', type: '下班', time: '18:00' },
			];
			this.groupRecords(); // 加载完记录后执行分组
		},
		groupRecords() {
		  // 按日期分组打卡记录
			this.groupedRecords = this.records.reduce((groups, record) => {
				const date = record.date;
				if (!groups[date]) {
					groups[date] = [];
				}
				groups[date].push(record);
				return groups;
			}, {});
		  // 将分组后的记录转换为数组格式
			this.groupedAndFilteredRecords = Object.keys(this.groupedRecords).map(date => ({
				date,
				records: this.groupedRecords[date]
			}));
		  // 初始时显示所有分组记录
			this.filterRecords();
		},
		filterRecords() {
			if (this.searchQuery.trim() === '') {
			// 如果搜索框为空，则显示所有分组记录
				this.groupedAndFilteredRecords = Object.keys(this.groupedRecords).map(date => ({
					date,
					records: this.groupedRecords[date]
				}));
			} else {
			// 否则，根据搜索查询过滤分组记录
				const query = this.searchQuery.trim();
				this.groupedAndFilteredRecords = this.groupedAndFilteredRecords.filter(groupedRecord =>
					groupedRecord.date.includes(query)
				);
			}
		}
	}
};
</script>

<style>
	.search-box input {
		width: 100%;
		padding: 20px;
		border-radius: 20px;
		box-sizing: border-box;
		font-size: 16px;
/* 		background-color: #ffffff; */
	}
	
	.record-item {
		flex: 1;
		outline: none;
		background-color: transparent;
		border: none;
		border-bottom: 1px solid #dcdcdc;
		padding-bottom: 8px;
	}
	
	.record-list{
		padding: 20rpx;
	}
	
	.record-date {
		font-size: 14px;
		margin-top: 10px;
		margin-bottom: 5px;
		text-align: right;
	}
	
	.record-details {
		margin-top: 5px;
	}
	
	.record-entry {
		font-size: 14px;
		color: #666;
		margin-bottom: 5px;
	}
	
	.no-records {
		text-align: center;
		font-size: 18px;
		color: #999;
		margin-top: 20px;
	}
</style> 