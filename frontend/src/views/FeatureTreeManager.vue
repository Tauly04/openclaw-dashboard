<template>
  <div class="feature-tree-manager min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">功能树管理</h1>
          <p class="text-white/60">管理 Dashboard 的功能模块和导航结构</p>
        </div>
        <div class="flex gap-3">
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl border border-blue-500/30 transition-all flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            添加功能
          </button>
          <button 
            @click="exportConfig"
            class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all"
          >
            导出配置
          </button>
          <button 
            @click="showImportModal = true"
            class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all"
          >
            导入配置
          </button>
          <button 
            @click="resetToDefault"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl border border-red-500/30 transition-all"
          >
            重置默认
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Left: Feature Tree -->
        <div class="col-span-7">
          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">功能结构树</h2>
              <div class="flex gap-2">
                <button @click="expandAll" class="text-sm text-white/60 hover:text-white">展开全部</button>
                <button @click="collapseAll" class="text-sm text-white/60 hover:text-white">收起全部</button>
              </div>
            </div>
            
            <div class="space-y-1 max-h-[600px] overflow-y-auto">
              <FeatureTreeNode
                v-for="feature in featureStore.featureTree"
                :key="feature.id"
                :feature="feature"
                :level="0"
                @select="selectFeature"
                @toggle="featureStore.toggleNode"
                @add-child="openAddChildModal"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </div>
          </div>
        </div>

        <!-- Right: Feature Details / Preview -->
        <div class="col-span-5">
          <div class="glass rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">功能详情</h2>
            
            <div v-if="selectedFeature" class="space-y-4">
              <div class="flex items-center gap-3 pb-4 border-b border-white/10">
                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(selectedFeature.icon)"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">{{ selectedFeature.name }}</h3>
                  <p class="text-white/60 text-sm">{{ selectedFeature.key }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-white/60">ID</span>
                  <span class="text-white font-mono text-sm">{{ selectedFeature.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">分类</span>
                  <span class="text-white">{{ getCategoryName(selectedFeature.category) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">状态</span>
                  <StatusBadge :status="selectedFeature.status" />
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">路由</span>
                  <span class="text-white font-mono text-sm">{{ selectedFeature.route }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">组件</span>
                  <span class="text-white font-mono text-sm">{{ selectedFeature.component }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">排序</span>
                  <span class="text-white">{{ selectedFeature.order }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-white/10">
                <p class="text-white/60 text-sm mb-2">描述</p>
                <p class="text-white">{{ selectedFeature.description || '暂无描述' }}</p>
              </div>

              <div class="pt-4 border-t border-white/10">
                <p class="text-white/60 text-sm mb-2">权限</p>
                <div class="flex gap-2">
                  <span 
                    v-for="perm in selectedFeature.permissions" 
                    :key="perm"
                    class="px-2 py-1 bg-white/10 rounded-lg text-xs text-white"
                  >
                    {{ perm }}
                  </span>
                </div>
              </div>

              <div v-if="selectedFeature.children?.length" class="pt-4 border-t border-white/10">
                <p class="text-white/60 text-sm mb-2">子功能 ({{ selectedFeature.children.length }})</p>
                <ul class="space-y-1">
                  <li 
                    v-for="child in selectedFeature.children" 
                    :key="child.id"
                    class="text-white/80 text-sm flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(child.icon)"/>
                    </svg>
                    {{ child.name }}
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="text-center py-12 text-white/40">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <p>点击左侧功能查看详情</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <FeatureModal
      v-if="showAddModal || showEditModal"
      :is-edit="showEditModal"
      :feature="editingFeature"
      :parent-id="addingChildTo"
      @save="saveFeature"
      @close="closeModals"
    />

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showImportModal = false">
      <div class="glass rounded-2xl p-6 w-full max-w-2xl">
        <h3 class="text-xl font-semibold text-white mb-4">导入配置</h3>
        <textarea 
          v-model="importJson"
          class="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white font-mono text-sm"
          placeholder="粘贴 JSON 配置..."
        />
        <div class="flex justify-end gap-3 mt-4">
          <button @click="showImportModal = false" class="px-4 py-2 text-white/60 hover:text-white">取消</button>
          <button @click="doImport" class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFeatureStore } from '@/stores/feature'
import FeatureTreeNode from '@/components/FeatureTreeNode.vue'
import FeatureModal from '@/components/FeatureModal.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const featureStore = useFeatureStore()

const selectedFeature = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const editingFeature = ref(null)
const addingChildTo = ref(null)
const importJson = ref('')

const getCategoryName = (key) => {
  const cat = Object.values(featureStore.FEATURE_CATEGORIES).find(c => c.key === key)
  return cat?.name || key
}

const selectFeature = (feature) => {
  selectedFeature.value = feature
  featureStore.selectFeature(feature)
}

const expandAll = () => {
  featureStore.featureTree.forEach(f => {
    featureStore.expandedNodes.add(f.id)
    if (f.children) {
      f.children.forEach(c => featureStore.expandedNodes.add(c.id))
    }
  })
}

const collapseAll = () => {
  featureStore.expandedNodes.clear()
}

const openAddChildModal = (parentId) => {
  addingChildTo.value = parentId
  editingFeature.value = null
  showAddModal.value = true
}

const openEditModal = (feature) => {
  editingFeature.value = feature
  addingChildTo.value = null
  showEditModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingFeature.value = null
  addingChildTo.value = null
}

const saveFeature = (data) => {
  if (showEditModal.value && editingFeature.value) {
    featureStore.updateFeature(editingFeature.value.id, data)
  } else {
    featureStore.addFeature(addingChildTo.value, data)
  }
  closeModals()
}

const confirmDelete = (feature) => {
  if (confirm(`确定要删除 "${feature.name}" 吗？${feature.children?.length ? `此功能有 ${feature.children.length} 个子功能，将一并删除。` : ''}`)) {
    featureStore.deleteFeature(feature.id)
    if (selectedFeature.value?.id === feature.id) {
      selectedFeature.value = null
    }
  }
}

const exportConfig = () => {
  const config = featureStore.exportTree()
  const blob = new Blob([config], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `openclaw-features-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const doImport = () => {
  if (featureStore.importTree(importJson.value)) {
    showImportModal.value = false
    importJson.value = ''
    alert('导入成功！')
  } else {
    alert('导入失败，请检查 JSON 格式')
  }
}

const resetToDefault = () => {
  if (confirm('确定要重置为默认功能树吗？所有自定义修改将丢失。')) {
    featureStore.resetToDefault()
    selectedFeature.value = null
  }
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
