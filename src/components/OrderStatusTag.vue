<template>
  <el-tag :type="statusType" :effect="effect">{{ statusText }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
  status: {
    type: [String, Object],
    required: true,
    default: 'pending_payment'
  },
  effect: {
    type: String,
    default: 'light'
  }
})

// 获取状态码
const statusCode = computed(() => {
  if (!props.status) return '';
  
  // 处理后端返回的可能是枚举对象的情况
  if (typeof props.status === 'object') {
    // 如果是JSON对象，可能有code字段
    return props.status.code;
  }
  
  // 处理大写状态码，如PENDING_PAYMENT -> pending_payment
  if (typeof props.status === 'string' && props.status.toUpperCase() === props.status) {
    return props.status.toLowerCase();
  }
  
  return props.status;
})

// 根据状态获取标签类型
const statusType = computed(() => {
  const code = statusCode.value;
  
  switch (code) {
    case 'pending_payment':
      return 'warning'
    case 'pending_shipment':
      return 'primary'
    case 'shipped':
      return 'success'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'info'
    default:
      return 'info'
  }
})

// 获取状态显示文本
const statusText = computed(() => {
  const code = statusCode.value;
  
  switch (code) {
    case 'pending_payment':
      return '待支付'
    case 'pending_shipment':
      return '待发货'
    case 'shipped':
      return '已发货'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
})
</script>

<style scoped>
.el-tag {
  text-align: center;
  min-width: 60px;
}
</style> 