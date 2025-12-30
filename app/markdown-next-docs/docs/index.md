---
layout: page
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 检测用户浏览器语言
  const userLang = navigator.language || navigator.userLanguage

  // 判断是否为中文
  const isZh = userLang.toLowerCase().includes('zh')

  // 根据语言重定向到对应路径
  if (isZh) {
    window.location.href = '/v1/zh/'
  } else {
    window.location.href = '/v1/en/'
  }
})
</script>

<div style="display: flex; justify-content: center; align-items: center; min-height: 60vh; flex-direction: column; gap: 20px;">
  <h1>Redirecting...</h1>
  <p>正在重定向 / Redirecting to the appropriate language version...</p>
  <p>
    <a href="/v1/zh/">中文文档</a> | <a href="/v1/en/">English Documentation</a>
  </p>
</div>
