<template>
	<view class="daily-container">
		<uv-sticky bgColor='#F3E6C8'>
			<view class="flex-row align-center justify-between padding-lr margin-top-sm">
				<view @click="openDate" class="title">
					{{modeTitle}}
					<image src="/static/images/ticket/chevron.svg" class="arrow-img"></image>
				</view>
				<uv-datetime-picker ref="datetimePicker" v-model="value" mode="year-month"
					@confirm="confirm"></uv-datetime-picker>
				<view class="title" style="color: var(--ink-black);" @click="openWorker">
					{{employeeName}}
					<image v-if="isAdmin" src="/static/images/ticket/chevron.svg" class="arrow-img" ></image>
				</view>
				<uv-picker ref="picker" :columns="workerList" keyName="name" @confirm="confirmWorker"></uv-picker>
			</view>
			<view class="summary">
				<view class="flex-row justify-between">
					<view>
						月度汇总
					</view>
					<view class="detail" @click="toggle">
						<text class="margin-right-xs">详情</text>
						<uv-icon :name="isSpread ? 'arrow-up'  : 'arrow-down'" color="#B42318" size="32rpx"></uv-icon>
					</view>
				</view>
				<view v-if="isSpread" class="margin-top summary-table">
					<uni-table>
						<!-- 表头行 -->
						<uni-tr>
							<uni-th width="100rpx"></uni-th>
							<uni-th width="140rpx"></uni-th>
							<uni-th width="170rpx" align="center">小计</uni-th>
							<uni-th width="100rpx" align="center">天数</uni-th>
							<uni-th width="170rpx" align="center">平均数</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<template v-for="(statDetail, index) in reportData.statInfo?.statDetails" :key="index">
							<uni-tr>
								<uni-td></uni-td>
								<uni-td align="center">数量</uni-td>
								<uni-td align="center">{{statDetail.totalOrderNum}}</uni-td>
								<uni-td align="center">{{statDetail.dayCount}}</uni-td>
								<uni-td align="center">{{statDetail.averageOrderNum}}</uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td>{{statDetail.stage}}</uni-td>
								<uni-td align="center">款数</uni-td>
								<uni-td align="center">{{statDetail.totalOrderQty}}</uni-td>
								<uni-td align="center">{{statDetail.dayCount}}</uni-td>
								<uni-td align="center">{{statDetail.averageOrderQty}}</uni-td>
							</uni-tr>
							<uni-tr>
								<uni-td></uni-td>
								<uni-td align="center">工时(h)</uni-td>
								<uni-td align="center">{{statDetail.totalWorkSpan}}</uni-td>
								<uni-td align="center">{{statDetail.dayCount}}</uni-td>
								<uni-td align="center">{{statDetail.averageWorkSpan}}</uni-td>
							</uni-tr>
						</template>
					</uni-table>
				</view>
			</view>
		</uv-sticky>
		<view v-for="(dailyProduction, key) in reportData.dailyProductions" :key="key" class="card">
			<view class="title justify-end">
				{{dailyProduction.checkinDate}}
			</view>
			<view v-for="(detail, index) in dailyProduction.details" :key="index" class="content">
				<view class="technology-tag">
					{{detail.stage}}
				</view>
				<view class="flex-row justify-between margin-bottom-sm">
					<view class="sub-content">
						数量：{{detail.orderNum}}
					</view>
					<view class="sub-content">
						款数：{{detail.orderQty}}
					</view>
					<view class="sub-content">
						工时(h)：{{detail.workSpan}}
					</view>
				</view>
				<view v-if="detail.workRemark.trim()" class="workRemark">
						{{detail.workRemark}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import {
		GetDailyProductionData,
		GetWorderList
	} from '../../apis/production';
	import {
		useUserStore
	} from '../../store/user';

	export default {
		data() {
			const date = dayjs();

			return {
				value: Number(new Date()),
				modeTitle: date.format('YYYY年MM月'),
				isSpread: false,
				workerList: [],
				employeeId: null,
				employeeName: useUserStore().userData.name,
				reportData: {},
				spreadArr: [],
				beginDate: date.startOf('month').format('YYYY-MM-DD'),
				endDate: date.endOf('month').format(
					'YYYY-MM-DD')
			}
		},
		created() {
		    this.isAdmin = useUserStore().userData.isAdmin; 
		},
		mounted() {
			if (this.isAdmin) {
				GetWorderList({
					keyWords: ''
				}).then(res => {
					this.workerList = [res.data] || []
				})
			}
			
			this.getData()
		},
		methods: {
			openDate() {
				this.$refs.datetimePicker.open();
			},
			openWorker() {
				if (this.isAdmin) {
					this.$refs.picker.open();
				}
			},
			confirm(e) {
				this.modeTitle = dayjs(e.value).format('YYYY年MM月')
				this.beginDate = dayjs(e.value).startOf('month').format('YYYY-MM-DD')
				this.endDate = dayjs(e.value).endOf('month').format('YYYY-MM-DD')
				
				this.getData()
			},
			confirmWorker(e) {
				this.employeeId = e.value[0].employeeId
				this.employeeName = e.value[0].name
				this.getData()
			},
			toggle() {
				this.isSpread = !this.isSpread
			},
			getData() {
				GetDailyProductionData({
					beginDate: this.beginDate,
					endDate: this.endDate,
					employeeId: this.employeeId
				}).then(res => {
					this.reportData = res.data || {}
				})
			}
		}
	}
</script>

<style lang="scss">
	.daily-container {
		background: var(--ticket-paper);
		min-height: 100%;

		.title {
			display: flex;
			font-weight: 500;
			font-size: 31rpx;
			color: var(--ink-black);
			line-height: 46rpx;
		}

		.arrow-img {
			width: 31rpx;
			height: 31rpx;
			margin: auto;
		}

		.summary {
			display: flex;
			flex-direction: column;
			font-weight: 500;
			font-size: 31rpx;
			color: var(--ink-black);
			line-height: 46rpx;
			margin: 19rpx;
			padding: 31rpx;
			background: var(--ticket-face);
			border: 2rpx solid rgba(28, 25, 23, 0.38);
			box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08);
			border-radius: 0;

			.detail {
				display: flex;
				font-weight: 500;
				font-size: 27rpx;
				color: #B42318;
				line-height: 42rpx;
				background: var(--ticket-face);
				border-radius: 0;
				border: 2rpx solid var(--ticket-edge);
				padding: 2rpx 15rpx;
			}

			.summary-table ::v-deep .uni-table-tr:first-child {
				background: var(--ticket-paper);
			}

			.summary-table ::v-deep .uni-table-td:first-child {
				border-right: 2rpx #EBEEF5 solid;
			}

			.summary-table ::v-deep .uni-table-tr:not(:nth-child(3n + 1)) .uni-table-td:first-child {
				border-bottom: none;
			}
		}

		.card {
			margin: 15rpx;
			padding: 31rpx;
			background: var(--ticket-face);
			border: 2rpx solid var(--ticket-edge);
			border-radius: 0;

			.content {
				padding: 0 30rpx 15rpx;
				margin-bottom: 15rpx;

				&:not(:last-child) {
					border-bottom: 2rpx dashed var(--perf-line);
				}

				.technology-tag {
					width: 99rpx;
					height: 46rpx;
					text-align: center;
					font-weight: 500;
					font-size: 27rpx;
					color: rgba(255, 255, 255, 0.9);
					line-height: 46rpx;
					background: #B42318;
					border-radius: 6rpx;
					margin-bottom: 15rpx;
				}

				.sub-content {
					font-size: 27rpx;
					color: var(--ink-black);
					line-height: 38rpx;
				}
				
				.workRemark {
					font-size: 27rpx;
					color: var(--ink-black);
					line-height: 42rpx;
					background: var(--ticket-paper);
					border-radius: 0;
					border: 2rpx solid var(--perf-line);
					padding: 23rpx;
				}
			}
		}
	}
</style>