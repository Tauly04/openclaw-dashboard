<template>
  <div class="feature-tree-node">
    <div 
      class="flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer group"
      :class="{ 
        'bg-white/10': isSelected,
        'hover:bg-white/5': !isSelected
      }"
      :style="{ paddingLeft: `${level * 20 + 8}px` }"
      @click="$emit('select', feature)"
    >
      <!-- Expand/Collapse -->
      <button 
        v-if="hasChildren"
        @click.stop="$emit('toggle', feature.id)"
        class="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all"
      >
        <svg 
          class="w-4 h-4 text-white/60 transition-transform"
          :class="{ 'rotate-90': isExpanded }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <span v-else class="w-5"></span>

      <!-- Icon -->
      <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="featureStore.getIconPath(feature.icon)"/>
        </svg>
      </div>

      <!-- Name -->
      <div class="flex-1 min-w-0">
        <span class="text-white font-medium truncate" :class="{ 'opacity-50': feature.status === 'disabled' }">
          {{ feature.name }}
        </span>
        <span class="text-white/40 text-xs ml-2">{{ feature.key }}</span>
      </div>

      <!-- Status Badge -->
      <div class="flex items-center gap-2">
        <span 
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-emerald-400': feature.status === 'active',
            'bg-amber-400': feature.status === 'beta',
            'bg-blue-400': feature.status === 'dev',
            'bg-gray-400': feature.status === 'disabled'
          }"
        />

        <!-- Actions -->
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            @click.stop="$emit('add-child', feature.id)"
            class="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            title="添加子功能"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
          <button 
            @click.stop="$emit('edit', feature)"
            class="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            title="编辑"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button 
            @click.stop="$emit('delete', feature)"
            class="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-red-400"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="mt-1">
      <FeatureTreeNode
        v-for="child in feature.children"
        :key="child.id"
        :feature="child"
        :level="level + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @add-child="$emit('add-child', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFeatureStore } from '@/stores/feature'

const props = defineProps({
  feature: { type: Object, required: true },
  level: { type: Number, default: 0 }
})

defineEmits(['select', 'toggle', 'add-child', 'edit', 'delete'])

const featureStore = useFeatureStore()

const hasChildren = computed(() => props.feature.children?.length > 0)
const isExpanded = computed(() => featureStore.isExpanded(props.feature.id))
const isSelected = computed(() => featureStore.selectedFeature?.id === props.feature.id)
</script>
