// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Custom theme for Battleship Game
const battleshipTheme = {
  dark: false,
  colors: {
    primary: '#1976D2',      // Navy blue
    secondary: '#FF5722',    // Orange for hits
    accent: '#4CAF50',       // Green for successful actions
    error: '#F44336',        // Red for errors/misses
    warning: '#FF9800',      // Orange for warnings
    info: '#2196F3',         // Light blue for info
    success: '#4CAF50',      // Green for success
    surface: '#FFFFFF',      // White background
    background: '#F5F5F5',   // Light gray background
    'ocean-blue': '#0D47A1', // Deep ocean blue
    'ship-gray': '#607D8B',  // Ship gray
    'water-light': '#E3F2FD' // Light water blue
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'battleshipTheme',
    themes: {
      battleshipTheme,
    }
  },
  defaults: {
    VBtn: {
      elevation: 2,
      rounded: 'lg'
    },
    VCard: {
      elevation: 3,
      rounded: 'lg'
    }
  }
})
