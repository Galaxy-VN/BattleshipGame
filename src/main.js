import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './assets/gameboard-vuetify.css'
import './assets/mobile-responsive.css'

createApp(App)
  .use(vuetify)
  .mount('#app')
