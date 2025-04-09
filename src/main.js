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

// Import Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

// Import Vuetify styles
import '@mdi/font/css/materialdesignicons.css'

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
app.use(createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#16a34a',
          secondary: '#f97316',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },
}))

// Initialize auth store after plugins are registered
const auth = useAuthStore()
auth.init()

// Mount app
app.mount('#app') 