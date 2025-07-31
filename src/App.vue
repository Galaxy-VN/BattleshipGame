<template>
  <v-app>
    <!-- Navigation Component -->
    <Navigation 
      :current-page="currentPage"
      @page-changed="handlePageChange"
    />
    
    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-0">
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
      </v-container>
    </v-main>
    
    <!-- Message Container -->
    <MessageContainer ref="messageContainer" />
  </v-app>
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
/* Ocean-themed background */
:root {
  --nav-height: 64px;
}

.v-application {
  background: linear-gradient(135deg, 
    #E3F2FD 0%, 
    #BBDEFB 25%, 
    #90CAF9 50%, 
    #64B5F6 75%, 
    #42A5F5 100%) !important;
  min-height: 100vh;
}

/* Enhanced global styling */
.v-main {
  background: transparent;
}

.v-container {
  max-width: 1400px;
}

/* Beautiful card hover effects */
.v-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

.v-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

/* Enhanced button styling */
.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
}
</style>
