<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-24 w-auto" src="/assets/images/products/sam-tuoi.png" alt="Logo">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Đăng nhập quản trị
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Hoặc
        <router-link to="/admin/register" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
          đăng ký tài khoản mới
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                v-model="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                :class="{'border-red-500': emailError}"
              >
              <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mật khẩu
            </label>
            <div class="relative mt-1">
              <input 
                id="password" 
                name="password" 
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="current-password" 
                v-model="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                :class="{'border-red-500': passwordError}"
              >
              <button 
                type="button" 
                @click="togglePassword" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400"></i>
              </button>
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                v-model="rememberMe"
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/admin/forgot-password" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                Quên mật khẩu?
              </router-link>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt"></i>
              </span>
              {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
          </div>

          <div v-if="error" class="bg-red-50 p-4 rounded-md mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Đăng nhập thất bại
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Form validation
const emailError = ref('')
const passwordError = ref('')

const validateForm = () => {
  emailError.value = !email.value ? 'Email không được để trống' : ''
  passwordError.value = !password.value ? 'Mật khẩu không được để trống' : ''
  
  return !emailError.value && !passwordError.value
}

const isFormValid = computed(() => {
  return email.value && password.value
})

// Kiểm tra khi component được mount
onMounted(() => {
  // Xóa token cũ nếu đã có trên trang đăng nhập
  console.log('Login component mounted, checking token state')
  const token = localStorage.getItem('authToken')
  const expiresAt = localStorage.getItem('tokenExpiresAt')
  
  if (token && expiresAt) {
    // Kiểm tra xem token có hết hạn chưa
    const isExpired = Date.now() >= parseInt(expiresAt)
    console.log('Found expired token on login page, clearing it', { isExpired })
    
    if (isExpired) {
      // Xóa token đã hết hạn
      sessionToken.resetAll()
    } else {
      // Nếu token còn hạn, chuyển hướng đến dashboard
      console.log('Token still valid, redirecting to dashboard')
      router.push('/admin/dashboard')
    }
  }
})

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    console.log('Starting login process with credentials:', {
      email: email.value,
      password: '********',
      rememberMe: rememberMe.value
    })
    
    // API URL from env or fallback
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
    console.log('Using API URL:', apiURL)
    
    // Xóa trạng thái cũ trước khi đăng nhập
    sessionToken.resetAll()
    
    // Make login request
    const response = await fetch(`${apiURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value
      }),
      credentials: 'omit' // Don't include cookies - we're using token-based auth
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Login API response:', data)
    
    if (data.success && data.data && data.data.token) {
      // Get token and user data
      const token = data.data.token
      const userData = data.data.user || {
        id: Date.now().toString(),
        email: email.value,
        name: email.value.split('@')[0],
        role: 'ADMIN'
      }
      
      // Calculate expiry date
      const now = Date.now()
      const expiresAt = data.data.expiresAt 
        ? new Date(data.data.expiresAt).getTime() 
        : (rememberMe.value 
            ? now + (30 * 24 * 60 * 60 * 1000) // 30 days
            : now + (2 * 60 * 60 * 1000)) // 2 hours
      
      console.log('Setting up session token with expiry:', new Date(expiresAt).toISOString())
      
      // Sử dụng sessionToken để lưu trữ token
      const tokenCreated = sessionToken.createToken(
        userData,
        token,
        data.data.refreshToken || null,
        rememberMe.value
      )
      
      if (!tokenCreated) {
        throw new Error('Không thể tạo session token')
      }
      
      // Cập nhật thời gian hết hạn
      localStorage.setItem('tokenExpiresAt', expiresAt.toString())
      sessionStorage.setItem('tokenExpiresAt', expiresAt.toString())
      
      // Xác minh token đã được lưu trữ đúng
      const storedToken = localStorage.getItem('authToken')
      if (!storedToken || storedToken !== token) {
        console.error('Token không được lưu trữ đúng cách', {
          expected: token.substring(0, 8) + '...',
          actual: storedToken ? storedToken.substring(0, 8) + '...' : null
        })
        
        // Tự lưu trữ token
        localStorage.setItem('authToken', token)
        localStorage.setItem('admin_current_token', token)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        sessionStorage.setItem('authToken', token)
        sessionStorage.setItem('admin_current_token', token)
        sessionStorage.setItem('isAuthenticated', 'true')
        sessionStorage.setItem('currentUser', JSON.stringify(userData))
      }
      
      console.log('Auth data saved, initializing auth store')
      
      // Khởi tạo auth store
      await auth.init()
      
      console.log('Auth store initialized, redirecting to dashboard...')
      
      // Delay redirect để đảm bảo dữ liệu được lưu
      setTimeout(() => {
        // Redirect with router first, fallback to location change
        try {
          router.push('/admin/dashboard')
        } catch (e) {
          console.error('Router navigation failed, using location.href', e)
          window.location.href = '/admin/dashboard'
        }
      }, 100)
    } else {
      error.value = data.message || 'Đăng nhập thất bại: Phản hồi không hợp lệ'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Đăng nhập thất bại: ' + (err.message || 'Lỗi không xác định')
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
/* Existing styles */
</style> 