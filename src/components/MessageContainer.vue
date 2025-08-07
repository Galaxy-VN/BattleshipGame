<template>
  <div class="message-container-wrapper">
    <!-- Toast Messages -->
    <div class="toast-container fixed top-4 right-4 z-50 flex flex-col gap-2">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'toast-message',
          'transform transition-all duration-300 ease-in-out',
          'bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20',
          'p-4 min-w-80 max-w-96',
          getToastClasses(message.type),
          message.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div :class="['toast-icon', 'w-6 h-6 rounded-full flex items-center justify-center', getIconClasses(message.type)]">
            <span :class="['text-sm font-bold', getIconTextClasses(message.type)]">
              {{ getMessageIcon(message.type) }}
            </span>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p :class="['toast-text', 'font-body text-sm font-medium leading-relaxed', getTextClasses(message.type)]">
              {{ message.text }}
            </p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="closeMessage(message.id)"
            class="toast-close w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 
                   flex items-center justify-center transition-colors duration-200
                   text-neutral-500 hover:text-neutral-700 text-xs font-bold"
          >
            ×
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-3 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            :class="['progress-bar', 'h-full rounded-full transition-all duration-100 ease-linear', getProgressClasses(message.type)]"
            :style="{ width: message.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageContainer',
  data() {
    return {
      messages: [],
      messageId: 0
    }
  },
  methods: {
    showMessage(text, type = 'info', duration = 4000) {
      const message = {
        id: this.messageId++,
        text,
        type,
        show: false,
        duration,
        progress: 100
      }
      
      this.messages.push(message)
      
      // Show with animation
      this.$nextTick(() => {
        message.show = true
        this.startProgressTimer(message)
      })
    },
    
    startProgressTimer(message) {
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, message.duration - elapsed)
        message.progress = (remaining / message.duration) * 100
        
        if (remaining <= 0) {
          clearInterval(interval)
          this.closeMessage(message.id)
        }
      }, 50)
    },
    
    closeMessage(messageId) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        message.show = false
        setTimeout(() => {
          this.removeMessage(messageId)
        }, 300)
      }
    },
    
    removeMessage(messageId) {
      const index = this.messages.findIndex(m => m.id === messageId)
      if (index > -1) {
        this.messages.splice(index, 1)
      }
    },
    
    getToastClasses(type) {
      const classMap = {
        'success': 'border-l-4 border-l-green-500',
        'error': 'border-l-4 border-l-red-500',
        'warning': 'border-l-4 border-l-yellow-500',
        'info': 'border-l-4 border-l-blue-500'
      }
      return classMap[type] || classMap.info
    },
    
    getIconClasses(type) {
      const classMap = {
        'success': 'bg-green-100',
        'error': 'bg-red-100',
        'warning': 'bg-yellow-100',
        'info': 'bg-blue-100'
      }
      return classMap[type] || classMap.info
    },
    
    getIconTextClasses(type) {
      const classMap = {
        'success': 'text-green-600',
        'error': 'text-red-600',
        'warning': 'text-yellow-600',
        'info': 'text-blue-600'
      }
      return classMap[type] || classMap.info
    },
    
    getTextClasses(type) {
      const classMap = {
        'success': 'text-green-800',
        'error': 'text-red-800',
        'warning': 'text-yellow-800',
        'info': 'text-blue-800'
      }
      return classMap[type] || classMap.info
    },
    
    getProgressClasses(type) {
      const classMap = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
      }
      return classMap[type] || classMap.info
    },
    
    getMessageIcon(type) {
      const iconMap = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'i'
      }
      return iconMap[type] || iconMap.info
    }
  }
}
</script>

<style scoped>
.toast-container {
  pointer-events: none;
}

.toast-message {
  pointer-events: auto;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-message.translate-x-full {
  animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-icon {
  flex-shrink: 0;
}

.toast-text {
  word-break: break-word;
}

.toast-close:hover {
  transform: scale(1.1);
}

.progress-bar {
  transition: width 50ms linear;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .toast-message {
    animation: none;
    transition: opacity 0.3s ease-in-out;
  }

  .toast-close:hover {
    transform: none;
  }

  .progress-bar {
    transition: none;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    top: 1rem;
  }
  
  .toast-message {
    min-width: auto;
    max-width: none;
  }
}
</style>
