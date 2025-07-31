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
/* Keep only essential variables for backward compatibility */
:root {
  --nav-height: 64px; /* Vuetify app bar height */
}

/* Remove custom body styling to let Vuetify handle it */
</style>
