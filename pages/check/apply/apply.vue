<template>
	<view class="apply-container">
		<view class="ticket apply-ticket">
		<view class="input-group">
			<view class="apply-time">
				<image class="time-icon" src="/static/images/ticket/clock.svg" />
				<label>补卡时间</label>
			</view>
			<view class="datetime-picker">
				<picker mode="date" :value="makeUpDate" @change="onDateChange">
					<view class="picker-view">{{ makeUpDate }}</view>
				</picker>
				<picker mode="time" :value="makeUpTime" @change="onTimeChange">
					<view class="picker-view">{{ makeUpTime }}</view>
				</picker>
			</view>
		</view>
		<view class="input-reason">
			<view class="apply-reason">
				<image class="reason-icon" src="/static/images/ticket/reason.svg" />
				<label>补卡理由(选填)</label>
			</view>
			<textarea v-model="reason" placeholder="请输入" maxlength="140" show-count class="textarea" />
			<view class="char-limit">{{ reason.length }}/140</view>
		</view>
		</view>
		<button type="primary" @click="submitApplication">提交</button>
	</view>
</template>

<script>
	import {
		Mend
	} from '../../../apis/check.js';
	export default {
		data() {
			return {
				makeUpDate: this.getFormattedDate(new Date()), // 默认当前日期
				makeUpTime: this.getFormattedTime(new Date()),
				reason: '', // 补卡理由
			};
		},
		methods: {
			// 格式化日期
			getFormattedDate(date) {
				const d = new Date(date);
				return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
			},
			getFormattedTime(date) {
				const d = new Date(date);
				return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
			},
			onDateChange(e) {
				this.makeUpDate = e.detail.value
			},
			onTimeChange(e) {
				this.makeUpTime = e.detail.value
			},
			// 提交补卡申请
			async submitApplication() {
				// 验证补卡时间
				if (!this.makeUpDate || !this.makeUpTime) {
					uni.showToast({
						title: '请选择补卡时间和日期',
						icon: 'none',
					});
					return;
				}
				const fullDateTime = `${this.makeUpDate} ${this.makeUpTime}`;

				try {
					// 调用API接口提交补卡申请
					await Mend({
						mendTime:fullDateTime,
						reason:this.reason,
					});
					// 提交成功后提示
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});

					// 清空输入内容（可选）
					this.makeUpDate = this.getFormattedDate(new Date());
					this.makeUpTime = this.getFormattedTime(new Date());
					this.reason = '';
				} catch (error) {
					uni.showToast({
						title: '提交失败，请重试',
						icon: 'none'
					});
					console.error('提交补卡申请失败：', error);
				}
			}
		}
	};
</script>

<style scoped>
	.apply-container {
		min-height: 100%;
		background-color: var(--ticket-paper);
		padding: 24rpx 32rpx 40rpx;
		box-sizing: border-box;
	}

	.apply-ticket {
		margin-bottom: 28rpx;
	}

	.input-group {
		margin-bottom: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border-bottom: 2rpx dashed var(--perf-line);
	}

	.apply-time,
	.apply-reason {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.time-icon,
	.reason-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.label {
		font-size: 32rpx;
	}

	.datetime-picker {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.picker-item {
		flex: 1;
		margin-right: 20rpx;
	}

	.picker-item:last-child {
		margin-right: 0;
	}

	.picker-view {
		padding: 20rpx;
		text-align: center;
	}

	.datetime-picker {
		border-radius: 0;
		overflow: hidden;
		/* 确保子元素不会溢出 */
	}

		.textarea {
		width: 100%;
		height: 400rpx;
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 10rpx;
		background: var(--ticket-face);
		border: 2rpx solid var(--ticket-edge);
		color: var(--ink-black);
	}
	
	.char-limit {
		text-align: right;
		font-size: 28rpx;
		color: var(--ink-muted);
	}

	button {
		margin-top: 160rpx;
		height: 96rpx;
		background-color: #B42318;
		color: #FFF8E7;
		border: 2rpx solid var(--ticket-edge);
		border-radius: 0;
		box-shadow: 4rpx 4rpx 0 rgba(28, 25, 23, 0.1), 0 10rpx 24rpx rgba(92, 64, 32, 0.08);
		font-size: 32rpx;
	}
</style>