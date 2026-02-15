<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-semibold text-white mb-6">{{ isEdit ? '编辑功能' : '添加功能' }}</h3>
      
      <form @submit.prevent="save" class="space-y-4">
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-white/60 text-sm mb-2">名称 *</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="功能名称"
            />
          </div>
          
          <div>
            <label class="block text-white/60 text-sm mb-2">标识符 (key) *</label>
            <input 
              v-model="form.key"
              type="text"
              required
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="unique-key"
            />
          </div>
        </div>

        <!-- Category & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-white/60 text-sm mb-2">分类</label>
            <select 
              v-model="form.category"
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            >
              <option v-for="cat in categories" :key="cat.key" :value="cat.key">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-white/60 text-sm mb-2">状态</label>
            <select 
              v-model="form.status"
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            >
              <option value="active">🟢 已上线</option>
              <option value="beta">🟡 测试中</option>
              <option value="dev">🔵 开发中</option>
              <option value="disabled">⚫ 已禁用</option>
            </select>
          </div>
        </div>

        <!-- Icon Selection -->
        <div>
          <label class="block text-white/60 text-sm mb-2">图标</label>
          <div class="grid grid-cols-10 gap-2">
            <button
              v-for="(path, name) in availableIcons"
              :key="name"
              type="button"
              @click="form.icon = name"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              :class="form.icon === name ? 'bg-blue-500/30 border border-blue-500/50' : 'bg-white/5 hover:bg-white/10'"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Route & Component -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-white/60 text-sm mb-2">路由路径</label>
            <input 
              v-model="form.route"
              type="text"
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="/feature/name"
            />
          </div>
          
          <div>
            <label class="block text-white/60 text-sm mb-2">组件名称</label>
            <input 
              v-model="form.component"
              type="text"
              class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              placeholder="ComponentName"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-white/60 text-sm mb-2">描述</label>
          <textarea 
            v-model="form.description"
            rows="2"
            class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            placeholder="功能描述..."
          />
        </div>

        <!-- Order -->
        <div>
          <label class="block text-white/60 text-sm mb-2">排序权重</label>
          <input 
            v-model.number="form.order"
            type="number"
            class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        <!-- Permissions -->
        <div>
          <label class="block text-white/60 text-sm mb-2">权限</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-white cursor-pointer">
              <input 
                v-model="form.permissions"
                type="checkbox"
                value="user"
                class="rounded border-white/30 bg-black/30"
              />
              普通用户
            </label>
            <label class="flex items-center gap-2 text-white cursor-pointer">
              <input 
                v-model="form.permissions"
                type="checkbox"
                value="admin"
                class="rounded border-white/30 bg-black/30"
              />
              管理员
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-white/60 hover:text-white"
          >
            取消
          </button>
          <button 
            type="submit"
            class="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl border border-blue-500/30 transition-all"
          >
            {{ isEdit ? '保存' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFeatureStore } from '@/stores/feature'

const props = defineProps({
  isEdit: { type: Boolean, default: false },
  feature: { type: Object, default: null },
  parentId: { type: String, default: null }
})

const emit = defineEmits(['save', 'close'])

const featureStore = useFeatureStore()

const categories = Object.values(featureStore.FEATURE_CATEGORIES)
const availableIcons = featureStore.ICONS

const form = ref({
  name: '',
  key: '',
  category: 'tools',
  icon: 'Wrench',
  description: '',
  status: 'dev',
  order: 100,
  route: '',
  component: 'GenericFeature',
  permissions: ['user']
})

// Watch for feature changes (when editing)
watch(() => props.feature, (newFeature) => {
  if (newFeature && props.isEdit) {
    form.value = { ...newFeature }
  }
}, { immediate: true })

// Auto-generate route and component from key
watch(() => form.value.key, (key) => {
  if (!props.isEdit && key) {
    if (!form.value.route) {
      form.value.route = `/feature/${key}`
    }
    if (form.value.component === 'GenericFeature') {
      form.value.component = key.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
    }
  }
})

const save = () => {
  emit('save', { ...form.value })
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
