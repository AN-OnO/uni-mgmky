<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <button @click="filterRecords('all')" :class="{ active: currentFilter === 'all' }">全部记录</button>
      <button @click="filterRecords('pending')" :class="{ active: currentFilter === 'pending' }">待处理</button>
      <button @click="filterRecords('processed')" :class="{ active: currentFilter === 'processed' }">已处理</button>
      <view class="search-container">
        <input v-model="searchQuery" placeholder="搜索补卡记录" @input="onSearchInput" />
        <view class="search-icon" @click="searchRecords">🔍</view>
      </view>
    </view>

    <!-- 补卡记录列表 -->
    <view class="records-list">
      <view class="record-item" v-for="(record, index) in filteredRecords" :key="index">
        <view class="record-info">
          <text>日期: {{ record.date }}</text>
          <text>理由: {{ record.reason }}</text>
          <text>状态: {{ record.status === 'pending' ? '待处理' : '已处理' }}</text>
        </view>
      </view>
      <view v-if="filteredRecords.length === 0" class="no-records">暂无符合条件的补卡记录</view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      records: [], // 所有补卡记录
      filteredRecords: [], // 过滤后的补卡记录
      currentFilter: 'all', // 当前选中的过滤条件
      searchQuery: '' // 搜索查询字符串
    };
  },
  methods: {
    // 获取补卡记录（模拟数据）
    fetchRecords() {
      // 在实际应用中，您应该从服务器获取数据
      // 这里我们使用模拟数据
      this.records = [
        { date: '2023-04-01', reason: '忘记打卡', status: 'pending' },
        { date: '2023-04-02', reason: '迟到', status: 'processed' },
        { date: '2023-04-03', reason: '外出办事', status: 'pending' },
        // ... 更多记录
      ];
      // 默认显示所有记录
      this.filterRecords('all');
    },
    // 根据过滤条件筛选记录
    filterRecords(status) {
      this.currentFilter = status;
      if (status === 'all') {
        this.filteredRecords = this.records;
      } else if (status === 'pending') {
        this.filteredRecords = this.records.filter(record => record.status === 'pending');
      } else if (status === 'processed') {
        this.filteredRecords = this.records.filter(record => record.status === 'processed');
      }
    },
    // 搜索记录
    searchRecords() {
      if (this.searchQuery.trim() === '') {
        // 如果搜索查询为空，则显示所有记录
        this.filterRecords('all');
      } else {
        // 否则根据搜索查询过滤记录
        this.filteredRecords = this.records.filter(record =>
          record.date.includes(this.searchQuery) ||
          record.reason.includes(this.searchQuery)
        );
      }
    },
    // 当用户在搜索输入框中输入时调用
    onSearchInput(event) {
      this.searchQuery = event.target.value;
      // 可以选择在这里自动调用searchRecords，或者等待用户点击搜索图标
      // this.searchRecords();
    }
  },
  // 生命周期钩子，页面加载时获取补卡记录
  onLoad() {
    this.fetchRecords();
  }
};
</script>

<style>
.container {
  padding: 10px;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-bar button {
  margin-right: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.nav-bar button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}


</style>

