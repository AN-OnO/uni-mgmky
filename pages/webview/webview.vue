<template>
  <view>
    <web-view :src="url" @message="handleMessage"></web-view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const url = ref('')

onLoad((options) => {
  // 接收传参，如：/pages/webview/webview?url=https://example.com
  if (options.url) {
    url.value = decodeURIComponent(options.url)
  }
})

// 接收网页消息（需网页配合）
const handleMessage = (e) => {
  console.log('收到网页消息:', e.detail.data)
}
</script>

<style>
page {
  background-color: var(--ticket-paper);
}
</style>