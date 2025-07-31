<template>
  <div id="app">
    <!-- Navigation Component -->
    <Navigation 
      :current-page="currentPage"
      @page-changed="handlePageChange"
    />
    
    <!-- Game Page -->
    <VirtualGamePage 
      v-if="currentPage === 'game'"
    />
    
    <!-- AI Game Page -->
    <AIGamePage 
      v-if="currentPage === 'ai-game'"
      @page-changed="handlePageChange"
    />
    
    <!-- Tutorial Page -->
    <TutorialPage 
      v-if="currentPage === 'tutorial'"
    />
    
    <!-- About Page -->
    <AboutPage 
      v-if="currentPage === 'about'"
    />
    
    <!-- Message Container -->
    <MessageContainer ref="messageContainer" />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import VirtualGamePage from './views/VirtualGamePage.vue'
import AIGamePage from './views/AIGamePage.vue'
import TutorialPage from './views/TutorialPage.vue'
import AboutPage from './views/AboutPage.vue'
import MessageContainer from './components/MessageContainer.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    VirtualGamePage,
    AIGamePage,
    TutorialPage,
    AboutPage,
    MessageContainer
  },
  data() {
    return {
      currentPage: 'game'
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    showMessage(text, type = 'info', duration = 3000) {
      this.$refs.messageContainer.showMessage(text, type, duration)
    }
  },
  provide() {
    return {
      showMessage: this.showMessage
    }
  }
}
</script>

<style>
:root {
  --primary-color: #0d47a1;
  --secondary-color: #1976d2;
  --background-color: #e3f2fd;
  --cell-border-color: #90caf9;
  --text-color: #212121;
  --ship-color: #546e7a;
  --hit-color: #d32f2f;
  --my-ship-hit-color: #ff8a65;
  --miss-color: #ffffff;
  --hover-color: #bbdefb;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --nav-height: 70px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Be Vietnam Pro', sans-serif;
  background: linear-gradient(135deg, var(--background-color) 0%, #bbdefb 100%);
  color: var(--text-color);
  min-height: 100vh;
  padding-top: var(--nav-height);
  margin: 0;
  overflow-x: hidden;
}

html {
  overflow-y: scroll;
}

#app {
  min-height: 100vh;
}
</style>
