import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import router
import router from './router'

// Import auth store
import { useAuthStore } from './store/auth'

// Import AOS
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 50,
  delay: 100
})

// Import global styles
import './assets/styles/main.scss'

// Error handling
const handleError = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// Create Pinia store
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Global error handler
app.config.errorHandler = handleError

// Use plugins
app.use(router)
app.use(pinia)

// Initialize auth store after plugins are registered
const auth = useAuthStore()
auth.init()

// Mount app
app.mount('#app') 