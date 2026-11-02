<template>
	<view class="container">
		<view class="ticket clock-mast">
			<view class="date-time">
				<text>{{ currentTime }}</text>
			</view>
			<view class="date-date">
				<text>{{ currentDate }} {{ currentWeekday }}</text>
			</view>
		</view>
		<view class="ticket records-ticket">
			<view class="todayCheck">
				<view class="title-left">
					<image class="calendar-icon" src="/static/images/ticket/check.svg" />
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
					<image class="success-icon" src="/static/images/ticket/empty.svg" />
					<view class="hint">
						<text>您今日还未打卡</text>
					</view>
				</view>
			</view>
		</view>
		<view class="remark-field">
			<uv-textarea :customStyle="customStyle" v-model="attendanceDes" placeholder="备注" ></uv-textarea>
		</view>
		<view class="punch-bar-space"></view>
		<view class="punch-bar">
			<button class="punch-btn" @click="punch" :disabled="isPunching">{{ punchButtonText }}</button>
		</view>
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
					width: '100%',
					marginTop: '0',
					marginBottom: '0',
					background: '#FFF8E7',
					border: '2rpx solid rgba(28, 25, 23, 0.38)',
					borderRadius: '0',
					padding: '20rpx 24rpx',
					boxSizing: 'border-box'
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
		padding: 24rpx 32rpx 0;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-height: 100%;
		box-sizing: border-box;
		background: var(--ticket-paper);
	}

	.clock-mast {
		margin-bottom: 28rpx;
		text-align: center;
	}

	.records-ticket {
		margin-bottom: 28rpx;
	}

	.remark-field {
		width: 100%;
		margin-bottom: 24rpx;
		box-sizing: border-box;
	}

	.remark-field :deep(.uv-textarea) {
		width: 100% !important;
		background: var(--ticket-face) !important;
	}

	.remark-field :deep(.uv-textarea__field) {
		width: 100%;
		background: var(--ticket-face);
		color: var(--ink-black);
	}

	.date-time {
		font-size: 96rpx;
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-variant-numeric: tabular-nums;
		color: var(--ink-black);
		letter-spacing: 0.04em;
	}

	.date-date {
		font-size: 26rpx;
		margin-bottom: 8rpx;
		color: var(--ink-muted);
		letter-spacing: 0.08em;
	}

	.list {
		display: flex;
		/* 启用Flexbox布局 */
		align-items: stretch;
		/* 使得子元素在垂直方向上对齐 */
		padding: 20rpx;
	}

	.flex-item {
		flex: none;
		/* 禁用flex的自动调整功能，确保元素大小由width和height决定 */
		width: 320rpx;
		/* 元素宽度 */
		height: 108rpx;
		/* 元素高度 */
		opacity: 1;
		/* 不透明度为100% */
		border-radius: 0;
		/* 圆角设置，四个值分别对应四个角 */
		background-color: var(--ticket-paper);
		/* 背景颜色 */
		margin: 0 6rpx 510rpx 6rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 20rpx;
	}

	.title {
		font-size: 30rpx;
		font-weight: 700;
		color: var(--ink-black);
		letter-spacing: 0.12em;
	}

	.punch-bar-space {
		height: calc(128rpx + constant(safe-area-inset-bottom));
		height: calc(128rpx + env(safe-area-inset-bottom));
		flex-shrink: 0;
	}

	.punch-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		box-sizing: border-box;
		padding: 16rpx 32rpx;
		padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
		background: var(--ticket-paper);
		border-top: 2rpx dashed var(--perf-line);
	}

	.punch-btn {
		width: 100%;
		height: 96rpx;
		padding: 0;
		margin: 0;
		line-height: 96rpx;
		text-align: center;
		font-size: 34rpx;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: #FFF8E7;
		background-color: #B42318;
		border: none;
		border-radius: 0;
		box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.18);
	}

	.punch-btn::after {
		border: none;
	}

	.punch-btn[disabled],
	.punch-btn[disabled][type='default'] {
		color: #FFF8E7 !important;
		background-color: #B42318 !important;
		opacity: 1 !important;
	}

	.not-punched {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 60rpx;

		.hint {
			font-weight: 500;
			font-size: 27rpx;
			color: var(--ink-muted);
			line-height: 42rpx;
		}
	}

	.calendar-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.success-icon {
		width: 120rpx;
		height: 120rpx;
		margin-top: 24rpx;
	}

	.todayCheck {
		display: flex;
		width: 100%;
		margin-top: 8rpx;
		justify-content: space-between;
		align-items: center;

		.title-left {
			display: flex;
			align-items: center;
		}

		.log {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: var(--ink-muted);
		}
	}

	.addCard {
		display: flex;
		align-items: center;
		margin-top: 60rpx;

		.add-card {
			font-size: 32rpx;
			color: var(--ink-muted);
		}

		.card-icon {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.punch-records {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 50rpx;
	}

	.record {
		width: 30%;
		height: 191rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--ticket-paper);
		border: 2rpx solid var(--ticket-edge);
		border-radius: 0;
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
		font-size: 24rpx;
		color: var(--stamp-red);
		line-height: 42rpx;
		font-family: ui-monospace, Menlo, Consolas, monospace;
	}

	.clocking-record {
		width: 100%;
		min-height: 360rpx;
	}
</style>