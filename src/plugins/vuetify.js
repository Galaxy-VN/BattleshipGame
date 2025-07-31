// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Custom theme for Battleship Game - Beautiful and Consistent
const battleshipTheme = {
  dark: false,
  colors: {
    // Primary colors - Ocean theme
    primary: '#0277BD',        // Deep Ocean Blue
    'primary-darken-1': '#01579B',
    'primary-lighten-1': '#0288D1',
    
    // Secondary colors - Sunset/Fire theme  
    secondary: '#FF6F00',      // Deep Orange
    'secondary-darken-1': '#E65100',
    'secondary-lighten-1': '#FF8F00',
    
    // Accent colors
    accent: '#00ACC1',         // Cyan accent
    
    // Semantic colors
    success: '#2E7D32',        // Forest Green
    warning: '#F57C00',        // Amber
    error: '#C62828',          // Deep Red
    info: '#1976D2',           // Blue
    
    // Surface colors
    surface: '#FFFFFF',
    'surface-variant': '#F5F5F5',
    background: '#FAFAFA',
    
    // Custom game colors
    'ocean-dark': '#01579B',
    'ocean-light': '#B3E5FC',
    'ship-steel': '#455A64',
    'hit-explosion': '#D32F2F',
    'miss-splash': '#1976D2',
    'water-deep': '#0277BD',
    'water-shallow': '#E1F5FE'
  }
}

const darkBattleshipTheme = {
  dark: true,
  colors: {
    primary: '#1E88E5',
    'primary-darken-1': '#1565C0',
    'primary-lighten-1': '#42A5F5',
    
    secondary: '#FF9800',
    'secondary-darken-1': '#F57C00',
    'secondary-lighten-1': '#FFB74D',
    
    accent: '#26C6DA',
    
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',
    
    surface: '#1E1E1E',
    'surface-variant': '#2D2D2D',
    background: '#121212',
    
    'ocean-dark': '#0D47A1',
    'ocean-light': '#1976D2',
    'ship-steel': '#78909C',
    'hit-explosion': '#F44336',
    'miss-splash': '#2196F3',
    'water-deep': '#1565C0',
    'water-shallow': '#1976D2'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'battleshipLight',
    themes: {
      battleshipLight: battleshipTheme,
      battleshipDark: darkBattleshipTheme,
    }
  },
  defaults: {
    VBtn: {
      elevation: 2,
      rounded: 'lg',
      style: 'text-transform: none; font-weight: 500;'
    },
    VCard: {
      elevation: 4,
      rounded: 'xl'
    },
    VChip: {
      elevation: 1,
      rounded: 'lg'
    },
    VAppBar: {
      elevation: 4
    }
  }
})
