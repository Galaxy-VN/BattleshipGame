<template>
  <div class="message-container" ref="container">
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="['message', `message-${message.type}`, { show: message.show }]"
    >
      {{ message.text }}
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
    showMessage(text, type = 'info', duration = 3000) {
      const message = {
        id: this.messageId++,
        text,
        type,
        show: false
      }
      
      this.messages.push(message)
      
      // Animate in
      setTimeout(() => {
        message.show = true
      }, 100)
      
      // Remove after duration
      setTimeout(() => {
        message.show = false
        setTimeout(() => {
          const index = this.messages.findIndex(m => m.id === message.id)
          if (index > -1) {
            this.messages.splice(index, 1)
          }
        }, 300)
      }, duration)
    }
  }
}
</script>

<style scoped>
.message-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 2000;
  pointer-events: none;
}

.message {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
  max-width: 300px;
  word-wrap: break-word;
}

.message.show {
  transform: translateX(0);
  opacity: 1;
}

.message-success {
  background: var(--success-color);
}

.message-warning {
  background: var(--warning-color);
}

.message-error {
  background: var(--hit-color);
}

.message-info {
  background: var(--secondary-color);
}

@media (max-width: 768px) {
  .message-container {
    right: 10px;
    left: 10px;
    top: 90px;
  }
  
  .message {
    max-width: none;
  }
}
</style>
