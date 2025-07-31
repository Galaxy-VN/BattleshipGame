<template>
  <div class="message-container">
    <v-snackbar
      v-for="message in messages"
      :key="message.id"
      v-model="message.show"
      :color="getSnackbarColor(message.type)"
      :timeout="message.duration"
      location="top right"
      class="message-snackbar"
      @update:model-value="(value) => !value && removeMessage(message.id)"
    >
      <div class="d-flex align-center">
        <v-icon :icon="getMessageIcon(message.type)" class="mr-2"></v-icon>
        {{ message.text }}
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="message.show = false"
          icon="mdi-close"
          size="small"
        ></v-btn>
      </template>
    </v-snackbar>
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
        show: true,
        duration
      }
      
      this.messages.push(message)
    },
    
    removeMessage(messageId) {
      setTimeout(() => {
        const index = this.messages.findIndex(m => m.id === messageId)
        if (index > -1) {
          this.messages.splice(index, 1)
        }
      }, 300)
    },
    
    getSnackbarColor(type) {
      const colorMap = {
        'success': 'success',
        'error': 'error',
        'warning': 'warning',
        'info': 'info'
      }
      return colorMap[type] || 'info'
    },
    
    getMessageIcon(type) {
      const iconMap = {
        'success': 'mdi-check-circle',
        'error': 'mdi-alert-circle',
        'warning': 'mdi-alert',
        'info': 'mdi-information'
      }
      return iconMap[type] || 'mdi-information'
    }
  }
}
</script>

<style scoped>
.message-container {
  position: relative;
}

.message-snackbar {
  position: absolute !important;
}
</style>
