import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './assets/tailwind.css'
import './assets/design-system.css'
import './assets/gameboard-enhanced.css'
import './assets/ship-controls-enhanced.css'
import './assets/ship-controls-layout.css'
import './assets/message-container-enhanced.css'
import './assets/virtual-game-enhanced.css'

createApp(App)
  .use(vuetify)
  .mount('#app')
