import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = '/api'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref([])
  const loading = ref(false)
  const ws = ref(null)
  const wsConnected = ref(false)

  // Getters
  const messageCount = computed(() => messages.value.length)

  // Actions
  async function loadHistory() {
    try {
      const response = await axios.get(`${API_URL}/chat/history`)
      messages.value = response.data.messages || []
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem('chat-history')
      if (saved) {
        try {
          messages.value = JSON.parse(saved)
        } catch (e) {
          messages.value = []
        }
      }
    }
  }

  async function clearHistory() {
    try {
      await axios.delete(`${API_URL}/chat/history`)
      messages.value = []
      localStorage.removeItem('chat-history')
    } catch (error) {
      console.error('Failed to clear chat history:', error)
      messages.value = []
      localStorage.removeItem('chat-history')
    }
  }

  function connectWebSocket(onMessage) {
    const token = localStorage.getItem('token')
    if (!token) return

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/chat?token=${token}`
    
    ws.value = new WebSocket(wsUrl)
    
    ws.value.onopen = () => {
      wsConnected.value = true
      console.log('Chat WebSocket connected')
    }
    
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message' || data.type === 'history') {
        messages.value.push({
          role: data.role,
          content: data.content,
          timestamp: data.timestamp
        })
        // Also save to localStorage as backup
        localStorage.setItem('chat-history', JSON.stringify(messages.value))
      }
      if (onMessage) onMessage(data)
    }
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      wsConnected.value = false
    }
    
    ws.value.onclose = () => {
      wsConnected.value = false
      ws.value = null
    }
  }

  function sendMessage(content) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return false
    }
    
    // Add to local messages immediately
    messages.value.push({
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    })
    
    ws.value.send(JSON.stringify({
      type: 'message',
      content: content
    }))
    
    return true
  }

  function disconnect() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
      wsConnected.value = false
    }
  }

  return {
    messages,
    loading,
    wsConnected,
    messageCount,
    loadHistory,
    clearHistory,
    connectWebSocket,
    sendMessage,
    disconnect
  }
})
