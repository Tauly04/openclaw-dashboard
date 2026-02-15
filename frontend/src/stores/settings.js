import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = '/api'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const language = ref('zh')
  const bgImage = ref('')
  const loading = ref(false)

  // Getters
  const isZh = computed(() => language.value === 'zh')
  const isEn = computed(() => language.value === 'en')

  // Actions
  async function loadSettings() {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      language.value = response.data.language || 'zh'
      bgImage.value = response.data.bg_image || ''
    } catch (error) {
      console.error('Failed to load settings from server:', error)
      // Fallback to localStorage
      language.value = localStorage.getItem('dashboard-lang') || 'zh'
      bgImage.value = localStorage.getItem('dashboard-bg-image') || ''
    }
  }

  async function saveSettings(newSettings) {
    try {
      await axios.put(`${API_URL}/settings`, newSettings)
      if (newSettings.language) language.value = newSettings.language
      if (newSettings.bg_image !== undefined) bgImage.value = newSettings.bg_image
      
      // Also save to localStorage as backup
      if (newSettings.language) localStorage.setItem('dashboard-lang', newSettings.language)
      if (newSettings.bg_image !== undefined) localStorage.setItem('dashboard-bg-image', newSettings.bg_image)
      
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      // Save to localStorage as fallback
      if (newSettings.language) localStorage.setItem('dashboard-lang', newSettings.language)
      if (newSettings.bg_image !== undefined) localStorage.setItem('dashboard-bg-image', newSettings.bg_image)
      return false
    }
  }

  function setLanguage(lang) {
    language.value = lang
    saveSettings({ language: lang })
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }

  function setBgImage(image) {
    bgImage.value = image
    saveSettings({ bg_image: image })
  }

  // Initialize
  function init() {
    loadSettings()
    document.documentElement.lang = language.value === 'zh' ? 'zh-CN' : 'en'
  }

  return {
    language,
    bgImage,
    loading,
    isZh,
    isEn,
    loadSettings,
    saveSettings,
    setLanguage,
    setBgImage,
    init
  }
})
