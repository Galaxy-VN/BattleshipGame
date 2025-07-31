<template>
  <v-app-bar 
    app 
    color="primary" 
    dark
    elevation="4"
    height="64"
  >
    <v-app-bar-title class="text-h5 font-weight-bold">
      <v-icon left size="large" class="mr-2">mdi-ship-wheel</v-icon>
      TRẬN CHIẾN TRÊN BIỂN
    </v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-btn-toggle
      v-model="selectedTab"
      color="white"
      mandatory
      rounded="lg"
      class="nav-buttons"
    >
      <v-btn
        value="game"
        @click="changePage('game')"
        prepend-icon="mdi-grid"
      >
        Bảng Virtual
      </v-btn>
      
      <v-btn
        value="ai-game"
        @click="changePage('ai-game')"
        prepend-icon="mdi-robot"
      >
        Chơi với AI
      </v-btn>
      
      <v-btn
        value="tutorial"
        @click="changePage('tutorial')"
        prepend-icon="mdi-book-open-variant"
      >
        Hướng Dẫn
      </v-btn>
      
      <v-btn
        value="about"
        @click="changePage('about')"
        prepend-icon="mdi-information"
      >
        Giới Thiệu
      </v-btn>
    </v-btn-toggle>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavigation',
  props: {
    currentPage: {
      type: String,
      default: 'game'
    }
  },
  emits: ['page-changed'],
  computed: {
    selectedTab: {
      get() {
        return this.currentPage
      },
      set(value) {
        this.changePage(value)
      }
    }
  },
  methods: {
    changePage(page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>

<style scoped>
.nav-buttons {
  margin-left: 16px;
}

@media (max-width: 960px) {
  .nav-buttons {
    margin-left: 8px;
  }
  
  .nav-buttons .v-btn {
    min-width: auto !important;
    padding: 0 8px !important;
  }
  
  .nav-buttons .v-btn__content {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 600px) {
  .nav-buttons {
    display: none;
  }
}
</style>
