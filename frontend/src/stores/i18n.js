import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations } from '../i18n'

export const useI18nStore = defineStore('i18n', () => {
  // State
  const currentLang = ref(localStorage.getItem('dashboard-lang') || 'zh')
  
  // Getters
  const t = computed(() => {
    return (key) => {
      return translations[currentLang.value]?.[key] || translations['en']?.[key] || key
    }
  })
  
  const isZh = computed(() => currentLang.value === 'zh')
  const isEn = computed(() => currentLang.value === 'en')
  
  // Actions
  function setLang(lang) {
    if (translations[lang]) {
      currentLang.value = lang
      localStorage.setItem('dashboard-lang', lang)
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    }
  }
  
  function toggleLang() {
    setLang(currentLang.value === 'zh' ? 'en' : 'zh')
  }
  
  // Initialize
  function init() {
    document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en'
  }
  
  return {
    currentLang,
    t,
    isZh,
    isEn,
    setLang,
    toggleLang,
    init
  }
})
