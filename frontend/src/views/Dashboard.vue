<template>
  <div class="vision-shell min-h-screen" :style="bgStyle" @mousemove="onMouseMove">
    <!-- Background Image Upload -->
    <input
      ref="bgInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onBgUpload"
    />
    
    <!-- Top Status Bar -->
    <header class="fixed top-0 left-0 right-0 z-50 px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold text-white/90">{{ $t('appTitle') }}</span>
        </div>
        <div class="flex items-center gap-6">
          <!-- Language Switcher -->
          <div class="flex items-center gap-2 glass rounded-full px-3 py-1">
            <button 
              @click="i18n.setLang('zh')"
              class="px-2 py-1 text-xs rounded-full transition-all"
              :class="i18n.isZh ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'"
            >
              中文
            </button>
            <button 
              @click="i18n.setLang('en')"
              class="px-2 py-1 text-xs rounded-full transition-all"
              :class="i18n.isEn ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'"
            >
              EN
            </button>
          </div>
          
          <div class="flex items-center gap-6 text-sm text-white/70">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              <span>{{ $t('connected') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span>{{ $t('dataSync') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>84%</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Left Sidebar Navigation -->
    <nav class="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
      <button 
        class="w-12 h-12 rounded-2xl glass flex items-center justify-center transition-all hover:scale-110"
        :class="{ 'bg-white/20': currentView === 'home' }"
        @click="currentView = 'home'"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      <button 
        class="w-12 h-12 rounded-2xl glass flex items-center justify-center transition-all hover:scale-110 relative"
        :class="{ 'bg-white/20': currentView === 'chat' }"
        @click="currentView = 'chat'"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span v-if="alertCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {{ alertCount }}
        </span>
      </button>
      <button 
        class="w-12 h-12 rounded-2xl glass flex items-center justify-center transition-all hover:scale-110"
        @click="showSettings = true"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </nav>

    <!-- Main Content -->
    <main class="vision-frame min-h-screen flex items-center justify-center p-8 pl-24">
      <div class="w-full max-w-5xl">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-4xl font-light text-white mb-2">{{ $t('welcomeBack') }}, {{ username }}</h1>
        </div>

        <!-- System Status Row -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="glass rounded-2xl p-4 flex items-center gap-4">
            <div class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
            <span class="text-white/90">{{ gatewayRunning ? $t('online') : $t('offline') }}</span>
          </div>
          <div class="glass rounded-2xl p-4 flex items-center gap-4">
            <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-white/90">{{ runningTasksCount }} {{ $t('tasksRunning') }}</span>
          </div>
          <div class="glass rounded-2xl p-4 flex items-center gap-4">
            <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="text-white/90">{{ $t('cpu') }} {{ cpuPercent }}%</span>
          </div>
        </div>

        <!-- Main Cards Grid -->
        <div class="grid grid-cols-3 gap-6 mb-8">
          <!-- Agent Control Card -->
          <div class="glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ $t('agentControl') }}</h3>
              <p class="text-white/60 mb-4">{{ totalAgents }} {{ $t('agentsActive') }}</p>
              <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all"
                @click="showAgentModal = true"
              >
                {{ $t('manageAgents') }}
              </button>
            </div>
          </div>

          <!-- System Monitor Card -->
          <div class="glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ $t('systemMonitor') }}</h3>
              <p class="text-white/60 mb-4">{{ alertCount }} {{ $t('alerts') }}</p>
              <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all"
                @click="showSystemModal = true"
              >
                {{ $t('viewStatus') }}
              </button>
            </div>
          </div>

          <!-- Command Center Card -->
          <div class="glass rounded-3xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
              <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ $t('commandCenter') }}</h3>
              <p class="text-white/60 mb-4">{{ $t('quickActions') }}</p>
              <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all"
                @click="showTerminalModal = true"
              >
                {{ $t('openTerminal') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass rounded-3xl p-6">
          <h3 class="text-lg font-medium text-white/80 mb-4">{{ $t('quickActions') }}</h3>
          <div class="flex flex-wrap gap-4">
            <button class="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-all flex items-center gap-2"
              @click="toggleLightMode"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {{ $t('lightMode') }}
            </button>
            <button class="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-all flex items-center gap-2" @click="$refs.bgInput.click()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('changeBackground') }}
            </button>
            <button 
              class="px-6 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 transition-all flex items-center gap-2 border border-blue-500/30"
              @click="showTaskModal = true"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {{ $t('viewTasks') }}
            </button>
            <button 
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
              @click="confirmRestart"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ $t('deployAssistant') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Agent Modal -->
    <div v-if="showAgentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showAgentModal = false">
      <div class="glass rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">{{ $t('agentControl') }}</h3>
          <button class="text-white/60 hover:text-white" @click="showAgentModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-if="!subagents.length" class="text-center text-white/50 py-8">
            {{ $t('noTasks') }}
          </div>
          <div v-for="agent in subagents" :key="agent.run_id" class="glass rounded-xl p-4 flex items-center justify-between">
            <div class="min-w-0">
              <p class="text-white/90 font-medium truncate">{{ agent.agent_name || 'Unnamed Agent' }}</p>
              <p class="text-white/50 text-sm">{{ agent.run_id }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs" :class="getAgentStatusClass(agent.status)">
              {{ agent.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- System Monitor Modal -->
    <div v-if="showSystemModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showSystemModal = false">
      <div class="glass rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">{{ $t('systemMonitor') }}</h3>
          <button class="text-white/60 hover:text-white" @click="showSystemModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="glass rounded-xl p-4">
            <p class="text-white/60 mb-1">CPU</p>
            <p class="text-2xl font-semibold text-white">{{ cpuPercent }}%</p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-white/60 mb-1">Memory</p>
            <p class="text-2xl font-semibold text-white">{{ memoryPercent }}%</p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-white/60 mb-1">Gateway</p>
            <p class="text-lg font-semibold" :class="gatewayRunning ? 'text-emerald-400' : 'text-red-400'">
              {{ gatewayRunning ? $t('online') : $t('offline') }}
            </p>
          </div>
          <div class="glass rounded-xl p-4">
            <p class="text-white/60 mb-1">{{ $t('alerts') }}</p>
            <p class="text-2xl font-semibold text-white">{{ alertCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Terminal Modal -->
    <div v-if="showTerminalModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showTerminalModal = false">
      <div class="glass rounded-3xl p-6 w-full max-w-3xl h-[60vh] flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-white">Terminal</h3>
          <button class="text-white/60 hover:text-white" @click="showTerminalModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 glass rounded-xl p-4 font-mono text-sm overflow-auto">
          <div class="text-emerald-400">$ openclaw status</div>
          <div class="text-white/80">Gateway: {{ gatewayRunning ? 'Running' : 'Stopped' }}</div>
          <div class="text-white/80">Agents: {{ totalAgents }} active</div>
          <div class="text-white/80">Tasks: {{ runningTasksCount }} running</div>
          <div class="text-emerald-400 mt-2">$ _</div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showTaskModal = false">
      <div class="glass rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">{{ $t('tasks') }}</h3>
          <button class="text-white/60 hover:text-white" @click="showTaskModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-if="!todos.length" class="text-center text-white/50 py-8">
            {{ $t('noTasks') }}
          </div>
          <div v-for="todo in todos" :key="todo.id" class="glass rounded-xl p-4 flex items-center justify-between">
            <span class="text-white/80">{{ todo.title }}</span>
            <button 
              class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all"
              @click="completeTask(todo.id)"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showSettings = false">
      <div class="glass rounded-3xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">{{ $t('settings') }}</h3>
          <button class="text-white/60 hover:text-white" @click="showSettings = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Language Setting -->
          <div class="glass rounded-xl p-4">
            <label class="block text-white/80 mb-3">{{ $t('language') }}</label>
            <div class="flex gap-2">
              <button 
                @click="i18n.setLang('zh')"
                class="flex-1 py-2 rounded-lg transition-all"
                :class="i18n.isZh ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'"
              >
                {{ $t('chinese') }}
              </button>
              <button 
                @click="i18n.setLang('en')"
                class="flex-1 py-2 rounded-lg transition-all"
                :class="i18n.isEn ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'"
              >
                {{ $t('english') }}
              </button>
            </div>
          </div>
          
          <div class="glass rounded-xl p-4">
            <label class="block text-white/80 mb-2">{{ $t('backgroundImage') }}</label>
            <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all" @click="$refs.bgInput.click()">
              {{ $t('uploadBackground') }}
            </button>
            <button v-if="bgImage" class="w-full mt-2 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all" @click="clearBgImage">
              {{ $t('removeBackground') }}
            </button>
          </div>
          
          <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all" @click="logout">
            {{ $t('logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'
import { useI18nStore } from '../stores/i18n'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const i18n = useI18nStore()

// Provide i18n to template
const $t = i18n.t
provide('$t', $t)

const currentView = ref('home')
const showTaskModal = ref(false)
const showSettings = ref(false)
const showAgentModal = ref(false)
const showSystemModal = ref(false)
const showTerminalModal = ref(false)
const bgImage = ref(localStorage.getItem('dashboard-bg-image') || '')
const mousePos = ref({ x: 0.5, y: 0.5 })
const isLightMode = ref(false)

// Background style
const bgStyle = computed(() => {
  const styles = {}
  if (bgImage.value) {
    styles['--bg-image'] = `url(${bgImage.value})`
    styles['background-image'] = `var(--bg-image), radial-gradient(circle at 18% 22%, rgba(96, 165, 250, 0.14), transparent 40%), radial-gradient(circle at 85% 10%, rgba(94, 234, 212, 0.08), transparent 36%), radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.05), transparent 55%), linear-gradient(135deg, #0b0f14, #0a1020 35%, #0b0f14 70%)`
    styles['background-size'] = 'cover, auto, auto, auto, auto'
    styles['background-position'] = 'center, auto, auto, auto, auto'
    styles['background-repeat'] = 'no-repeat, auto, auto, auto, auto'
  }
  styles['--mx'] = mousePos.value.x
  styles['--my'] = mousePos.value.y
  return styles
})

// Mouse tracking for glow effect
function onMouseMove(e) {
  mousePos.value = {
    x: e.clientX / window.innerWidth,
    y: e.clientY / window.innerHeight
  }
}

// Light mode toggle
function toggleLightMode() {
  isLightMode.value = !isLightMode.value
  document.body.style.filter = isLightMode.value ? 'invert(1) hue-rotate(180deg)' : ''
}

// Background upload
function onBgUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      bgImage.value = event.target.result
      localStorage.setItem('dashboard-bg-image', bgImage.value)
    }
    reader.readAsDataURL(file)
  }
}

function clearBgImage() {
  bgImage.value = ''
  localStorage.removeItem('dashboard-bg-image')
}

// Computed data
const username = computed(() => authStore.user?.username || 'User')
const gatewayRunning = computed(() => dashboardStore.status?.system?.gateway?.running || false)
const cpuPercent = computed(() => (dashboardStore.status?.system?.cpu_percent || 0).toFixed(1))
const memoryPercent = computed(() => (dashboardStore.status?.system?.memory_percent || 0).toFixed(1))
const runningTasksCount = computed(() => dashboardStore.status?.agents?.running_tasks_count || 0)
const totalAgents = computed(() => (dashboardStore.status?.agents?.subagents_running || 0) + 1)
const todos = computed(() => dashboardStore.status?.todos || [])
const subagents = computed(() => dashboardStore.status?.agents?.subagent_runs || [])

const alertCount = computed(() => {
  let count = 0
  if (dashboardStore.error) count++
  const logs = dashboardStore.status?.logs || []
  logs.forEach(log => {
    if (log.error_count > 0) count++
  })
  return count
})

function getAgentStatusClass(status) {
  if (status === 'running') return 'bg-emerald-500/20 text-emerald-300'
  if (status === 'failed' || status === 'error') return 'bg-red-500/20 text-red-300'
  return 'bg-white/10 text-white/60'
}

async function completeTask(taskId) {
  await dashboardStore.completeTodo(taskId)
  await dashboardStore.fetchDashboard()
}

// Actions
function logout() {
  authStore.logout()
  router.push('/login')
}

function confirmRestart() {
  if (confirm($t.value('confirmRestart'))) {
    dashboardStore.restartGateway()
  }
}

// Lifecycle
onMounted(() => {
  i18n.init()
  dashboardStore.startAutoRefresh()
})

onUnmounted(() => {
  dashboardStore.stopAutoRefresh()
})
</script>

<style scoped>
.vision-shell {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.vision-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 40px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
