<template>
  <nav class="main-nav">
    <div class="nav-container">
      <h1 class="nav-title">TRẬN CHIẾN TRÊN BIỂN</h1>
      <div class="nav-buttons">
        <button 
          :class="['nav-btn', { active: currentPage === 'game' }]"
          @click="changePage('game')"
        >
          Bảng Virtual
        </button>
        <button 
          :class="['nav-btn', { active: currentPage === 'ai-game' }]"
          @click="changePage('ai-game')"
        >
          Chơi với AI
        </button>
        <button 
          :class="['nav-btn', { active: currentPage === 'tutorial' }]"
          @click="changePage('tutorial')"
        >
          Hướng Dẫn
        </button>
        <button 
          :class="['nav-btn', { active: currentPage === 'about' }]"
          @click="changePage('about')"
        >
          Giới Thiệu
        </button>
      </div>
    </div>
  </nav>
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
  methods: {
    changePage(page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>

<style scoped>
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
}

.nav-title {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: white;
  color: var(--primary-color);
  border-color: white;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 10px 20px;
    height: auto;
    gap: 10px;
  }
  
  .nav-title {
    font-size: 1.2em;
  }
  
  .nav-buttons {
    gap: 5px;
  }
  
  .nav-btn {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}
</style>
