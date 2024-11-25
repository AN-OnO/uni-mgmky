<template>
  <view class="records-container">
    <!-- 如果有补卡记录，则遍历展示 -->
    <block v-if="records.length > 0">
      <view class="record-item" v-for="(record, index) in records" :key="index">
        <view class="record-date">补卡时间: {{ record.date }}</view>
        <view class="record-reason">理由: {{ record.reason }}</view>
      </view>
    </block>
    <!-- 如果没有补卡记录，则显示提示信息 -->
    <view v-else class="no-records">暂无补卡记录</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      records: [] // 补卡记录数组，初始为空
    };
  },
  methods: {
    // 获取补卡记录的方法（应从API接口获取数据）
    async fetchRecords() {
      try {
        // 这里应该调用API接口获取补卡记录
        // 示例：const response = await uni.request({...});
        // 然后将响应数据赋值给this.records
        // 假设响应数据格式为：{ data: [{ date: '...', reason: '...' }, ...] }
        // this.records = response.data.data;

        // 为了演示，这里我们使用一些模拟数据
        this.records = [
          { date: '2023-04-01', reason: '忘记打卡' },
          { date: '2023-04-05', reason: '迟到' }
        ];
      } catch (error) {
        // 处理请求错误
        console.error('获取补卡记录失败:', error);
        uni.showToast({ title: '获取记录失败', icon: 'none' });
      }
    }
  },
  // 生命周期钩子，页面加载时获取补卡记录
  onLoad() {
    this.fetchRecords();
  }
};
</script>

<style scoped>
.records-container {
  padding: 16px;
}
.record-item {
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.record-date,
.record-reason {
  margin-bottom: 8px;
  font-size: 16px;
}
.record-date {
  font-weight: bold;
}
.no-records {
  text-align: center;
  font-size: 16px;
  color: #999;
}
</style>
