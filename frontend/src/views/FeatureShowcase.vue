<template>
  <div class="feature-showcase min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">功能矩阵</h1>
        <p class="text-white/60 text-lg max-w-2xl mx-auto">
          OpenClaw Dashboard 所有功能模块一览。绿色表示已上线，黄色测试中，蓝色开发中。
        </p>
        
        <div class="flex justify-center gap-6 mt-6">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span class="text-white/60 text-sm">已上线</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            <span class="text-white/60 text-sm">测试中</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-400"></span>
            <span class="text-white/60 text-sm">开发中</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gray-400"></span>
            <span class="text-white/60 text-sm">已禁用</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-4 mb-12">
        <div class="glass rounded-2xl p-6 text-center">
          <p class="text-3xl font-bold text-white mb-1">{{ stats.total }}</p>
          <p class="text-white/60">总功能数</p>
        </div>
        <div class="glass rounded-2xl p-6 text-center">
          <p class="text-3xl font-bold text-emerald-400 mb-1">{{ stats.active }}</p>
          <p class="text-white/60">已上线</p>
        </div>
        <div class="glass rounded-2xl p-6 text-center">
          <p class="text-3xl font-bold text-amber-400 mb-1">{{ stats.beta }}</p>
          <p class="text-white/60">测试中</p>
        </div>
        <div class="glass rounded-2xl p-6 text-center">
          <p class="text-3xl font-bold text-blue-400 mb-1">{{ stats.dev }}</p>
          <p class="text-white/60">开发中</p>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex justify-center gap-2 mb-8">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-2"
          :class="activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(cat.icon)"/>
          </svg>
          {{ cat.name }}
          <span class="px-2 py-0.5 bg-white/10 rounded-full text-xs">
            {{ getCategoryCount(cat.key) }}
          </span>
        </button>
      </div>

      <!-- Feature Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in filteredFeatures"
          :key="feature.id"
          class="glass rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer relative overflow-hidden"
          @click="showFeatureDetail(feature)"
        >
          <!-- Status Indicator -->
          <div 
            class="absolute top-0 left-0 w-full h-1"
            :class="{
              'bg-emerald-400': feature.status === 'active',
              'bg-amber-400': feature.status === 'beta',
              'bg-blue-400': feature.status === 'dev',
              'bg-gray-400': feature.status === 'disabled'
            }"
          />

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(feature.icon)"/>
              </svg>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-semibold text-white">{{ feature.name }}</h3>
                <StatusBadge :status="feature.status" />
              </div>
              
              <p class="text-white/60 text-sm mb-3">{{ feature.description || '暂无描述' }}</p>
              
              <div class="flex items-center gap-4 text-xs text-white/40">
                <span class="font-mono">{{ feature.key }}</span>
                <span v-if="feature.children?.length">{{ feature.children.length }} 个子功能</span>
              </div>
            </div>
          </div>

          <!-- Children Preview -->
          <div v-if="feature.children?.length" class="mt-4 pt-4 border-t border-white/10">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="child in feature.children.slice(0, 3)"
                :key="child.id"
                class="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/60 flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(child.icon)"/>
                </svg>
                {{ child.name }}
              </span>
              <span v-if="feature.children.length > 3" class="text-white/40 text-xs">
                +{{ feature.children.length - 3 }} 更多
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFeatures.length === 0" class="text-center py-20">
        <svg class="w-20 h-20 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="text-white/40">该分类下暂无功能</p>
      </div>
    </div>

    <!-- Feature Detail Modal -->
    <div v-if="selectedFeature" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" @click.self="selectedFeature = null">
      <div class="glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-start gap-6 mb-6">
          <div class="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(selectedFeature.icon)"/>
            </svg>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-white">{{ selectedFeature.name }}</h2>
              <StatusBadge :status="selectedFeature.status" />
            </div>
            
            <p class="text-white/60">{{ selectedFeature.description || '暂无描述' }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-8">
          <div class="glass rounded-xl p-4">
            <h4 class="text-white/60 text-sm mb-3">技术信息</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-white/40">标识符：</span>
                <span class="text-white font-mono">{{ selectedFeature.key }}</span>
              </div>
              <div>
                <span class="text-white/40">路由：</span>
                <span class="text-white font-mono">{{ selectedFeature.route }}</span>
              </div>
              <div>
                <span class="text-white/40">组件：</span>
                <span class="text-white font-mono">{{ selectedFeature.component }}</span>
              </div>
              <div>
                <span class="text-white/40">分类：</span>
                <span class="text-white">{{ getCategoryName(selectedFeature.category) }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedFeature.children?.length" class="glass rounded-xl p-4">
            <h4 class="text-white/60 text-sm mb-3">子功能 ({{ selectedFeature.children.length }})</h4>
            
            <div class="space-y-2">
              <div
                v-for="child in selectedFeature.children"
                :key="child.id"
                class="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <svg class="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(child.icon)"/>
                </svg>
                <span class="text-white">{{ child.name }}</span>
                <StatusBadge :status="child.status" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button 
            @click="selectedFeature = null"
            class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFeatureStore } from '@/stores/feature'
import StatusBadge from '@/components/StatusBadge.vue'

const featureStore = useFeatureStore()

const activeCategory = ref('dashboard')
const selectedFeature = ref(null)

const categories = Object.values(featureStore.FEATURE_CATEGORIES)

const stats = computed(() => {
  const all = featureStore.allFeatures
  return {
    total: all.length,
    active: all.filter(f => f.status === 'active').length,
    beta: all.filter(f => f.status === 'beta').length,
    dev: all.filter(f => f.status === 'dev').length
  }
})

const filteredFeatures = computed(() => {
  return featureStore.featureTree.filter(f => f.category === activeCategory.value)
})

const getCategoryCount = (categoryKey) => {
  return featureStore.allFeatures.filter(f => f.category === categoryKey).length
}

const getCategoryName = (key) => {
  const cat = categories.find(c => c.key === key)
  return cat?.name || key
}

const showFeatureDetail = (feature) => {
  selectedFeature.value = feature
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
