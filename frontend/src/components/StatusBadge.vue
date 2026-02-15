<template>
  <span 
    class="px-2 py-1 rounded-lg text-xs font-medium"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'dev',
    validator: (value) => ['active', 'beta', 'dev', 'disabled'].includes(value)
  }
})

const badgeClass = computed(() => {
  const classes = {
    active: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    beta: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    dev: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    disabled: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
  }
  return classes[props.status] || classes.dev
})

const label = computed(() => {
  const labels = {
    active: '已上线',
    beta: '测试中',
    dev: '开发中',
    disabled: '已禁用'
  }
  return labels[props.status] || props.status
})
</script>
