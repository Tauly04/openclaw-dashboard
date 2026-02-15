import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { DEFAULT_FEATURE_TREE, FEATURE_CATEGORIES, FEATURE_STATUS } from '@/config/featureTree'

// SVG Icons mapping
const ICONS = {
  LayoutDashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  Bot: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  Monitor: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  Wrench: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  Zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  Settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  Activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  CheckSquare: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  List: 'M4 6h16M4 12h16M4 18h16',
  MessageCircle: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  Terminal: 'M4 17l6-6-6-6M12 19h8',
  Folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  Sliders: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  GitBranch: 'M6 3v12M6 3a3 3 0 100 6 3 3 0 000-6z M6 15a3 3 0 100 6 3 3 0 000-6z M18 9a3 3 0 100 6 3 3 0 000-6z M6 9h12',
  Plus: 'M12 4v16m8-8H4',
  Trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  Edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  Eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  EyeOff: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
}

export const useFeatureStore = defineStore('feature', () => {
  // State
  const featureTree = ref([])
  const expandedNodes = ref(new Set())
  const selectedFeature = ref(null)
  const isLoading = ref(false)
  
  // Load from localStorage or use default
  const loadFeatureTree = () => {
    const saved = localStorage.getItem('feature-tree')
    if (saved) {
      try {
        featureTree.value = JSON.parse(saved)
        return
      } catch (e) {
        console.error('Failed to load feature tree:', e)
      }
    }
    featureTree.value = JSON.parse(JSON.stringify(DEFAULT_FEATURE_TREE))
  }
  
  // Save to localStorage
  const saveFeatureTree = () => {
    localStorage.setItem('feature-tree', JSON.stringify(featureTree.value))
  }
  
  // Watch for changes and auto-save
  watch(featureTree, saveFeatureTree, { deep: true })
  
  // Getters
  const allFeatures = computed(() => {
    const flatten = (nodes) => {
      let result = []
      for (const node of nodes) {
        result.push(node)
        if (node.children) {
          result = result.concat(flatten(node.children))
        }
      }
      return result
    }
    return flatten(featureTree.value)
  })
  
  const activeFeatures = computed(() => {
    return allFeatures.value.filter(f => f.status === 'active')
  })
  
  const featuresByCategory = computed(() => {
    const grouped = {}
    for (const cat of Object.values(FEATURE_CATEGORIES)) {
      grouped[cat.key] = allFeatures.value.filter(f => f.category === cat.key)
    }
    return grouped
  })
  
  const getFeatureById = (id) => {
    return allFeatures.value.find(f => f.id === id)
  }
  
  const getFeatureByKey = (key) => {
    return allFeatures.value.find(f => f.key === key)
  }
  
  const getFeatureByRoute = (route) => {
    return allFeatures.value.find(f => f.route === route)
  }
  
  const getIconPath = (iconName) => {
    return ICONS[iconName] || ICONS.LayoutDashboard
  }
  
  const isExpanded = (id) => expandedNodes.value.has(id)
  
  // Actions
  const toggleNode = (id) => {
    if (expandedNodes.value.has(id)) {
      expandedNodes.value.delete(id)
    } else {
      expandedNodes.value.add(id)
    }
  }
  
  const selectFeature = (feature) => {
    selectedFeature.value = feature
  }
  
  const addFeature = (parentId, featureData) => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      key: featureData.key || `feature-${Date.now()}`,
      name: featureData.name || 'New Feature',
      category: featureData.category || 'tools',
      icon: featureData.icon || 'Wrench',
      description: featureData.description || '',
      status: featureData.status || 'dev',
      order: featureData.order || 999,
      route: featureData.route || `/feature/${featureData.key}`,
      component: featureData.component || 'GenericFeature',
      permissions: featureData.permissions || ['user'],
      config: featureData.config || {},
      children: []
    }
    
    if (!parentId) {
      // Add as root
      featureTree.value.push(newFeature)
    } else {
      // Add as child
      const addToParent = (nodes) => {
        for (const node of nodes) {
          if (node.id === parentId) {
            if (!node.children) node.children = []
            node.children.push(newFeature)
            return true
          }
          if (node.children && addToParent(node.children)) {
            return true
          }
        }
        return false
      }
      addToParent(featureTree.value)
    }
    
    return newFeature
  }
  
  const updateFeature = (id, updates) => {
    const updateInTree = (nodes) => {
      for (const node of nodes) {
        if (node.id === id) {
          Object.assign(node, updates)
          return true
        }
        if (node.children && updateInTree(node.children)) {
          return true
        }
      }
      return false
    }
    return updateInTree(featureTree.value)
  }
  
  const deleteFeature = (id) => {
    const deleteFromTree = (nodes) => {
      const index = nodes.findIndex(n => n.id === id)
      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }
      for (const node of nodes) {
        if (node.children && deleteFromTree(node.children)) {
          return true
        }
      }
      return false
    }
    return deleteFromTree(featureTree.value)
  }
  
  const moveFeature = (id, newParentId, newIndex) => {
    const feature = getFeatureById(id)
    if (!feature) return false
    
    // Remove from current location
    deleteFeature(id)
    
    // Add to new location
    if (!newParentId) {
      featureTree.value.splice(newIndex, 0, feature)
    } else {
      const parent = getFeatureById(newParentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.splice(newIndex, 0, feature)
      }
    }
    return true
  }
  
  const resetToDefault = () => {
    featureTree.value = JSON.parse(JSON.stringify(DEFAULT_FEATURE_TREE))
  }
  
  const exportTree = () => {
    return JSON.stringify(featureTree.value, null, 2)
  }
  
  const importTree = (jsonString) => {
    try {
      featureTree.value = JSON.parse(jsonString)
      return true
    } catch (e) {
      console.error('Failed to import feature tree:', e)
      return false
    }
  }
  
  // Initialize
  loadFeatureTree()
  
  return {
    // State
    featureTree,
    expandedNodes,
    selectedFeature,
    isLoading,
    
    // Getters
    allFeatures,
    activeFeatures,
    featuresByCategory,
    getFeatureById,
    getFeatureByKey,
    getFeatureByRoute,
    getIconPath,
    isExpanded,
    
    // Actions
    toggleNode,
    selectFeature,
    addFeature,
    updateFeature,
    deleteFeature,
    moveFeature,
    resetToDefault,
    exportTree,
    importTree,
    saveFeatureTree,
    loadFeatureTree,
    
    // Constants
    FEATURE_CATEGORIES,
    FEATURE_STATUS,
    ICONS
  }
})
