<template>
  <nav class="modern-nav">
    <!-- Background with animated gradient -->
    <div class="nav-background"></div>
    
    <div class="nav-container">
      <div class="nav-content">
        <!-- Logo & Brand -->
        <div class="brand-section">
          <div class="logo-container">
            <div class="logo-icon">
              <span class="anchor-icon">⚓</span>
              <div class="logo-ripple"></div>
            </div>
            <div class="brand-text">
              <h1 class="brand-title">Battleship</h1>
              <span class="brand-subtitle">Naval Combat</span>
            </div>
          </div>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <div class="nav-pills">
            <button
              v-for="page in pages"
              :key="page.value"
              @click="changePage(page.value)"
              :class="[
                'nav-pill',
                currentPage === page.value ? 'nav-pill-active' : 'nav-pill-inactive'
              ]"
            >
              <span class="nav-icon">{{ page.icon }}</span>
              <span class="nav-label">{{ page.label }}</span>
              <div class="nav-pill-bg"></div>
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu Toggle -->
        <div class="mobile-toggle">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            :class="['menu-toggle', mobileMenuOpen ? 'menu-toggle-open' : '']"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div :class="['mobile-menu', mobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed']">
      <div class="mobile-menu-backdrop" @click="mobileMenuOpen = false"></div>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-header">
          <h3 class="mobile-menu-title">Navigation</h3>
          <button @click="mobileMenuOpen = false" class="mobile-close">
            <span>✕</span>
          </button>
        </div>
        <div class="mobile-menu-items">
          <button
            v-for="page in pages"
            :key="`mobile-${page.value}`"
            @click="changePage(page.value)"
            :class="[
              'mobile-nav-item',
              currentPage === page.value ? 'mobile-nav-item-active' : ''
            ]"
          >
            <span class="mobile-nav-icon">{{ page.icon }}</span>
            <span class="mobile-nav-label">{{ page.label }}</span>
            <div class="mobile-nav-indicator"></div>
          </button>
        </div>
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
  data() {
    return {
      mobileMenuOpen: false,
      pages: [
        { value: 'game', label: 'Virtual Game', icon: '🎮' },
        { value: 'ai-game', label: 'AI Battle', icon: '🤖' },
        { value: 'tutorial', label: 'Tutorial', icon: '📚' },
        { value: 'about', label: 'About', icon: 'ℹ️' }
      ]
    }
  },
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
      this.mobileMenuOpen = false
      this.$emit('page-changed', page)
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.mobileMenuOpen = false
      }
    }
  },
  mounted() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.modern-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  overflow: hidden;
}

.nav-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.95) 0%, 
    rgba(147, 51, 234, 0.95) 50%, 
    rgba(236, 72, 153, 0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 51, 234, 0.1) 50%, 
    rgba(236, 72, 153, 0.1) 100%);
  animation: gradientFlow 8s ease-in-out infinite;
}

@keyframes gradientFlow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.nav-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 1.5rem;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.anchor-icon {
  font-size: 24px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(5deg); }
}

.logo-ripple {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 18px;
  animation: ripple 2s linear infinite;
  opacity: 0;
}

.logo-icon:hover .logo-ripple {
  opacity: 1;
}

@keyframes ripple {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.025em;
}

.brand-subtitle {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-top: -2px;
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: block;
  }
}

.nav-pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.375rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.nav-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 16px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1;
}

.nav-pill-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  border-radius: 16px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.nav-pill-active .nav-pill-bg {
  opacity: 1;
  transform: scale(1);
}

.nav-pill-active {
  color: var(--primary-700);
  text-shadow: none;
}

.nav-pill-inactive {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-pill-inactive:hover {
  color: white;
  transform: translateY(-1px);
}

.nav-pill-inactive:hover .nav-pill-bg {
  opacity: 0.2;
  transform: scale(1);
}

.nav-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  white-space: nowrap;
}

/* Mobile Toggle */
.mobile-toggle {
  display: block;
}

@media (min-width: 768px) {
  .mobile-toggle {
    display: none;
  }
}

.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  margin: 2px auto;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.menu-toggle-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.menu-toggle-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}

.mobile-menu-open {
  pointer-events: auto;
}

.mobile-menu-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.mobile-menu-open .mobile-menu-backdrop {
  opacity: 1;
}

.mobile-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.95) 0%, 
    rgba(147, 51, 234, 0.95) 100%);
  backdrop-filter: blur(20px);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-menu-open .mobile-menu-panel {
  transform: translateX(0);
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-menu-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.mobile-close {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-menu-items {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: white;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.mobile-nav-item-active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}

.mobile-nav-item-active::after {
  content: '';
  position: absolute;
  right: 1rem;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.mobile-nav-icon {
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-label {
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .brand-title {
    font-size: 1.25rem;
  }
  
  .brand-subtitle {
    display: none;
  }
  
  .mobile-menu-panel {
    width: 100vw;
    max-width: 320px;
  }
}
</style>
