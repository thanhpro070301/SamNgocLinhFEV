import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import router
import router from './router'

// Import auth store trước khi khởi tạo
import auth from './store/auth'

// Import global styles
import './assets/styles/main.scss'

// Create Pinia store
const pinia = createPinia()

// Khởi tạo auth store để kiểm tra trạng thái đăng nhập
auth.init()

// Create and mount Vue app
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app') 