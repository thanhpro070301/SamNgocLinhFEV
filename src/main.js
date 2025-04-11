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

// Đăng ký Pinia trước (vì Auth store phụ thuộc vào Pinia)
app.use(pinia)

// Đăng ký Router sau
app.use(router)

// Khởi tạo auth store (đảm bảo Pinia đã được đăng ký)
const authInit = async () => {
  try {
    console.log('Khởi tạo auth state...')
    const authStore = useAuthStore()
    
    // Thêm kiểm tra để đảm bảo authStore.init() là hàm trước khi gọi
    if (typeof authStore.init === 'function') {
      const result = await authStore.init()
      console.log('Auth state initialized:', result ? 'success' : 'failed')
    } else {
      console.error('Auth store init method not available')
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error)
  }
}

// Mount app, sau đó khởi tạo auth để tránh lỗi cycle
app.mount('#app')

// Khởi tạo auth sau khi đã mount app
authInit() 