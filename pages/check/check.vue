<template>
	<view class="container">
		<view class="date-time">
			<text>{{ currentTime }}</text>
		</view>
		<view class="date-date">
			<text>{{ currentDate }} {{ currentWeekday }}</text>
		</view>
		<view class="todayCheck">
			<view class="title-left">
				<image class="calendar-icon" src="/static/images/check/打卡.png" />
				<text class="title">最近打卡</text>
			</view>
			<!-- <view class="log">
				<text @click="goToPunchRecord">所有记录 ></text>
			</view> -->
		</view>
		<view class="clocking-record">
			<view v-if="punchRecords.length > 0" class="last-punch">
				<view class="punch-records">
					<view v-for="(record, index) in punchRecords" :key="index" class="record">
						<image class="record-badge" :src="record.badge"></image>
						<image class="record-img"
							:src="record.status === 1 ? '/static/images/check/unfinish.svg' : '/static/images/check/finish.svg'" />
						<view class="record-time">{{ record.beginTime ? `上班 ${record.beginTime}` : '上班' }}</view>
						<view class="record-time">{{ record.endTime ? `下班 ${record.endTime}` : '下班'}}</view>
					</view>
				</view>
			</view>
			<view v-else class="not-punched">
				<image class="success-icon" src="/static/images/check/not-punched.png" />
				<view class="hint">
					<text>您今日还未打卡</text>
				</view>
			</view>
		</view>
		<uv-textarea :customStyle="customStyle" v-model="attendanceDes" placeholder="备注" ></uv-textarea>
		<button class="button" @click="punch" :disabled="isPunching">{{ punchButtonText }}</button>
		<!-- <view class="addCard">
			<image class="card-icon" src="/static/images/check/Frame 427320768.png" />
			<text class="add-card" @click="makeUpCard">申请补卡 ></text>
		</view> -->
	</view>
</template>

<script>
	import {
		ClockIn,
		GetLatestAttendances,
		GetAttendanceRecords,
		IsWorking
	} from '../../apis/check.js';
	export default {
		data() {
			return {
				currentDate: this.getDate(),
				currentTime: this.getTime(),
				currentWeekday: this.getWeekday(),
				isPunching: true, //正在打卡的状态，防止重复点击
				punchRecords: [], //打卡记录数组
				punchButtonText: '上班',
				timer: null,
				attendanceDes: '',
				customStyle: {
					width: '90%',
					marginTop: '40px',
					marginBottom: '32rpx'
				}
			};
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				Promise.all([this.getTodayCheckInLogs(), this.getStatus()]).then(res => {
					this.isPunching = false
				})
			},
			async getStatus() {
				let res = {}
				try {
					res = await IsWorking()
				} catch (error) {
					throw error
				}

				this.punchButtonText = res.data.isWorking ? '下班' : '上班'
				this.attendanceId = res.data.attendanceId
			},
			async getTodayCheckInLogs() {
				let res = {}
				try {
					res = await GetLatestAttendances()
				} catch (error) {
					throw error
				}

				this.punchRecords = res.data.map(({
					beginTime,
					endTime,
					status,
					checkintime
				}) => ({
					beginTime: beginTime ? uni.$uv.timeFormat(beginTime, 'hh:MM') : null,
					endTime: endTime ? uni.$uv.timeFormat(endTime, 'hh:MM') : null,
					badge: new Date(checkintime).setHours(0, 0, 0, 0) - new Date().setHours(0,
							0, 0, 0) === 0 ? '/static/images/check/today.svg' :
						'/static/images/check/yesterday.svg',
					status
				}))
			},
			getTime() {
				const now = new Date();
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				return `${hours}:${minutes}`;
			},
			getDate() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				return `${month}月${day}日`;
			},
			getWeekday() {
				const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
				const now = new Date();
				const dayIndex = now.getDay();
				return weekdays[dayIndex];
			},
			updateDateTime() {
				this.currentTime = this.getTime();
			},
			punch() {
				this.isPunching = true;
				ClockIn({
					attendanceId: this.punchButtonText === '下班' ? this.attendanceId : null,
					attendanceDes: this.attendanceDes || null
				}).then(res => {
					uni.$uv.toast('打卡成功！')
					this.attendanceDes = ''
					this.init()
				})
			},
			goToPunchRecord() {
				uni.navigateTo({
					url: '/pages/check/attendance',
				});
			},
			makeUpCard() {
				uni.navigateTo({
					url: '/pages/check/apply/index',
				});
			},
		},
		mounted() {
			this.timer = setInterval(this.updateDateTime, 1000);
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(to bottom, #e2efff, #f5f9fd, #f5f9fd, #FFFFFF, #FFFFFF)
	}

	.date-time {
		font-size: 85px;
		margin-top: 35px;
		font-family: 'Bahnschrift Light', sans-serif;
	}

	.date-date {
		font-size: 16px;
		margin-bottom: 32px;
		color: #333333;
	}

	.list {
		display: flex;
		/* 启用Flexbox布局 */
		align-items: stretch;
		/* 使得子元素在垂直方向上对齐 */
		padding: 10px;
	}

	.flex-item {
		flex: none;
		/* 禁用flex的自动调整功能，确保元素大小由width和height决定 */
		width: 160px;
		/* 元素宽度 */
		height: 54px;
		/* 元素高度 */
		opacity: 1;
		/* 不透明度为100% */
		border-radius: 6px 6px 6px 6px;
		/* 圆角设置，四个值分别对应四个角 */
		background-color: #EEF0F7;
		/* 背景颜色 */
		margin: 0 3px 255px 3px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 10px;
	}

	.title {
		font-size: 16px;
		font-weight: bold;
	}

	.button {
		width: 100%;
		height: 56px;
		font-size: 18px;
		border-radius: 8px;
		background-color: #469DCD;
		color: #FFFFFF;
		display: flex;
		/* 如果需要按钮内部的元素也灵活布局 */
		justify-content: center;
		/* 水平居中内部元素，如果需要的话 */
		align-items: center;
	}

	.not-punched {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 30px;

		.hint {
			font-weight: 500;
			font-size: 27rpx;
			color: #808080;
			line-height: 42rpx;
		}
	}

	.calendar-icon {
		width: 30px;
		/* 元素宽度 */
		height: 30px;
	}

	.success-icon {
		width: 219px;
		/* 元素宽度 */
		height: 149px;
		margin-top: 35px;
	}

	.todayCheck {
		display: flex;
		width: 350px;
		margin-top: 30px;
		justify-content: space-between;
		align-items: center;

		.title-left {
			display: flex;
			align-items: center;
		}

		.log {
			display: flex;
			align-items: center;
			font-size: 14px;
			color: #808080;
		}
	}

	.addCard {
		display: flex;
		align-items: center;
		margin-top: 30px;

		.add-card {
			font-size: 16px;
			color: #808080;
		}

		.card-icon {
			width: 25px;
			/* 元素宽度 */
			height: 25px;
		}
	}

	.punch-records {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 25px;
	}

	.record {
		width: 30%;
		height: 191rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		box-shadow: 0rpx 8rpx 76rpx 0rpx #E8EEF4;
		border-radius: 31rpx;
		position: relative;
	}

	.record-badge {
		position: absolute;
		width: 46rpx;
		height: 46rpx;
		top: 0;
		right: 0;
	}

	.record-img {
		width: 53rpx;
		height: 53rpx;
	}

	.record-time {
		width: 145rpx;
		height: 42rpx;
		font-weight: 600;
		font-size: 27rpx;
		color: #469DCD;
		line-height: 42rpx;
	}

	.clocking-record {
		width: 340px;
		height: 180px;
	}
</style>