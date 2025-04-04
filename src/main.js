import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import router
import router from './router'

// Import auth store trước khi khởi tạo
import auth from './store/auth'

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

try {
  // Khởi tạo auth store để kiểm tra trạng thái đăng nhập
  auth.init()

  // Create and mount Vue app
  const app = createApp(App)
  
  // Global error handler
  app.config.errorHandler = handleError
  
  app.use(router)
  app.use(pinia)

  app.mount('#app')
} catch (error) {
  console.error('Error initializing app:', error)
} 