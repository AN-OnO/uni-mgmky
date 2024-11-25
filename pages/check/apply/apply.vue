<template>
	<view class="apply-container">
		<view class="input-group">
			<view class="apply-time">
				<image class="time-icon" src="/static/images/check/时间.png" />
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
		<view class="input-group">
			<view class="apply-reason">
				<image class="reason-icon" src="/static/images/check/理由.png" />
				<label>补卡理由(选填)</label>
			</view>
			<textarea
				v-model="reason"
				placeholder="请输入"
				maxlength="140"
				show-count
				class="textarea"
			/>
			<view class="char-limit">{{ reason.length }}/140</view>
		</view>
		<button type="primary" @click="submitApplication">提交</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			makeUpDate: this.getFormattedDate(new Date()), // 默认当前日期
			makeUpTime: '12:00',
			reason: '' // 补卡理由
		};
	},
	methods: {
		// 格式化日期
		getFormattedDate(date) {
			const d = new Date(date);
			return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
		},
    // 日期选择器变化处理
		onDateChange(e) {
			this.makeUpDate = e.target.value;
		},
		onTimeChange(e) {
			this.makeUpTime = e.target.value;
		},
    // 提交补卡申请
		submitApplication() {
      // 验证补卡时间
			if (!this.makeUpDate) {
				uni.showToast({ title: '请选择补卡时间和日期', icon: 'none' });
			return;
		}
      const fullDateTime = `${this.makeUpDate} ${this.makeUpTime}`;
      // 这里应该调用API接口提交补卡申请
      // 示例：uni.request({...})
      
      // 提交成功后提示
      uni.showToast({ title: '提交成功', icon: 'success' });
      
      // 清空输入内容（可选）
      this.makeUpDate = this.getFormattedDate(new Date());
	  makeUpTime: '12:00',
      this.reason = '';
    }
  }
};
</script>

<style scoped>
.apply-container {
  padding: 20px;
  background-color: #fff;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.apply-time,.apply-reason {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.time-icon,.reason-icon{
	width: 15px;
	height: 15px;
}

.label {
  font-size: 16px;
}

.datetime-picker {
  display: flex;
  align-items: center;
  width: 100%;
}

.picker-item {
  flex: 1;
  margin-right: 10px;
}

.picker-item:last-child {
  margin-right: 0;
}

.picker-view {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

/* 为了让日期和时间在同一个框中显示，并且看起来像一个整体的输入框，
   我们可以给.datetime-picker添加一个额外的样式来模拟输入框的边框 */
.datetime-picker {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden; /* 确保子元素不会溢出 */
}

.date-picker, .time-picker {
  border: none; /* 移除picker组件的内部边框 */
  width: 50%; /* 或者根据需要调整宽度 */
}

.date-picker .picker-view, .time-picker .picker-view {
  border-bottom: none; /* 移除picker视图的下边框，因为我们已经有了外部边框 */
}

/* 为了让日期和时间在同一个框中显示时中间没有分隔线，
   我们可以给第一个picker添加一个右边框，给第二个picker移除左边框（如果有的话） */
.date-picker .picker-view {
  border-right: 1px solid #ccc; /* 添加右边框 */
}

/* 如果.time-picker有默认的左边框，需要移除它 */
.time-picker .picker-view {
  /* 根据实际情况，可能需要添加一些特定的样式来移除或覆盖默认的左边框 */
}

.textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 5px;
}

.char-limit {
}

button {
	margin-top: 150px;
	height: 48px;
	background-color: #58c3de;
	color: #fff;
	border: none;
	border-radius: 5px;
	font-size:16px;
}
</style>
 
 
 
 