import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import router
import router from './router'

// Import global styles
import './assets/styles/main.scss'

// Create Pinia store
const pinia = createPinia()

// Create and mount Vue app
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app') 