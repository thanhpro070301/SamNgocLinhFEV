<template>
  <div class="auth-page pt-20 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Login form -->
      <div class="p-8 relative">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Đăng nhập</h2>
          <p class="text-sm text-gray-600 mt-2">Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng của bạn</p>
        </div>
        
        <div v-if="error" class="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
          {{ error }}
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input 
                v-model="email" 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input 
                v-model="password" 
                id="password" 
                name="password" 
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="current-password" 
                required 
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Nhập mật khẩu của bạn"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                v-model="rememberMe" 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/auth/forgot-password" class="font-medium text-green-600 hover:text-green-500">
                Quên mật khẩu?
              </router-link>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="fas fa-circle-notch fa-spin"></i>
              </span>
              {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a href="#" class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <i class="fab fa-google text-red-500 mr-2"></i>
                <span>Google</span>
              </a>
            </div>
            <div>
              <a href="#" class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <i class="fab fa-facebook text-blue-600 mr-2"></i>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <router-link to="/auth/register" class="font-medium text-green-600 hover:text-green-500">
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useNotificationService } from '@/composables/useNotificationService'
import { clearAllAuthData, clearInvalidSession } from '@/utils/clearAuth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const notificationService = useNotificationService()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const redirectPath = ref(route.query.redirect || localStorage.getItem('redirectAfterLogin') || '/')
const pendingLoginInterval = ref(null)

// Kiểm tra tình trạng phiên đăng nhập
const checkExistingSession = async () => {
  try {
    // Đồng bộ localStorage và sessionStorage
    const localToken = localStorage.getItem('authToken')
    const sessionToken = sessionStorage.getItem('authToken')
    const localAuth = localStorage.getItem('isAuthenticated') === 'true'
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true'
    
    // Có token trong một trong hai storage
    if ((localToken || sessionToken) && (localAuth || sessionAuth)) {
      console.log('Found existing auth data, verifying...')
      
      // Đồng bộ hai storage nếu có sự khác biệt
      if (localToken && !sessionToken) {
        sessionStorage.setItem('authToken', localToken)
        sessionStorage.setItem('isAuthenticated', 'true')
      } else if (!localToken && sessionToken) {
        localStorage.setItem('authToken', sessionToken)
        localStorage.setItem('isAuthenticated', 'true')
      }
      
      // Kiểm tra token có hợp lệ không
      const result = await auth.init()
      
      if (result && result.success) {
        console.log('User already authenticated, redirecting')
        handleSuccessfulLogin(false) // Không hiển thị thông báo
        return true
      } else {
        console.log('Existing session invalid, clearing auth data')
        clearAllAuthData()
      }
    }
    return false
  } catch (err) {
    console.error('Error checking existing session:', err)
    return false
  }
}

// Thiết lập trang đăng nhập
onMounted(async () => {
  // First quickly check if user is already authenticated to avoid flickering
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true' || 
                    sessionStorage.getItem('isAuthenticated') === 'true';
  const currentPath = window.location.pathname;
  
  // Can use auth store's authStatus getter for a more comprehensive check
  const isAuthenticated = token && isAuthFlag && auth.authStatus;
  
  // If already authenticated and not explicitly trying to logout, redirect away from login
  if (isAuthenticated && 
      !route.query.logout && 
      !route.query.force && 
      !route.query.session && 
      currentPath === '/auth/login') {
    console.log('Already authenticated, redirecting away from login page');
    const redirectTo = route.query.redirect || '/profile';
    
    // Use location.replace to avoid adding to browser history
    window.location.replace(redirectTo);
    return;
  }
  
  // Xóa dữ liệu trước đó nếu session đã hết hạn
  if (route.query.session === 'expired' || route.query.session === 'invalid') {
    await clearInvalidSession()
    
    if (route.query.session === 'expired') {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else if (route.query.session === 'invalid') {
      error.value = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
    }
  } else {
    // Kiểm tra xem người dùng đã đăng nhập chưa - using a safer check
    try {
      const alreadyLoggedIn = await checkExistingSession()
      if (alreadyLoggedIn) return
    } catch (err) {
      console.error('Error checking session:', err)
      // Continue to login form on error
    }
  }
  
  // Lưu lại đường dẫn chuyển hướng
  if (route.query.redirect) {
    redirectPath.value = route.query.redirect
    localStorage.setItem('redirectAfterLogin', redirectPath.value)
  }
})

// Dọn dẹp khi unmount
onUnmounted(() => {
  if (pendingLoginInterval.value) {
    clearInterval(pendingLoginInterval.value)
  }
})

// Xử lý thành công sau khi đăng nhập
const handleSuccessfulLogin = (showNotification = true) => {
  try {
    // Hiển thị thông báo nếu cần
    if (showNotification) {
      notificationService.show('Đăng nhập thành công!', {
        title: 'Chào mừng trở lại',
        type: 'success'
      })
    }
    
    // Đảm bảo dữ liệu người dùng có sẵn
    let userData = auth.user
    let userDetailsFromStorage
    
    // Nếu không có dữ liệu trong store, lấy từ storage
    if (!userData) {
      try {
        const userStr = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails')
        if (userStr) {
          userDetailsFromStorage = JSON.parse(userStr)
          userData = userDetailsFromStorage
        }
      } catch (error) {
        console.error('Error parsing user details:', error)
      }
    }
    
    // Đảm bảo đã có token và xác thực trước khi chuyển hướng
    const hasToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    if (!hasToken) {
      console.error('Missing token after login')
      error.value = 'Lỗi xác thực, vui lòng thử lại'
      return
    }
    
    const isAdmin = userData?.role === 'ADMIN'
    console.log('Redirecting based on user role:', { isAdmin, redirectPath: redirectPath.value })
    
    // Sử dụng setTimeout để đảm bảo trạng thái đã được cập nhật
    setTimeout(() => {
      // Xóa đường dẫn chuyển hướng đã lưu
      localStorage.removeItem('redirectAfterLogin')
      
      if (isAdmin) {
        window.location.href = '/admin/dashboard'
      } else if (redirectPath.value && redirectPath.value !== '/auth/login') {
        window.location.href = redirectPath.value
      } else {
        window.location.href = '/profile'
      }
    }, 500)
    
    // Thiết lập interval để đồng bộ token mỗi 0.5 giây trong thời gian chuyển trang
    pendingLoginInterval.value = setInterval(() => {
      if (auth.syncStorages) {
        auth.syncStorages()
      }
    }, 500)
  } catch (error) {
    console.error('Error during login redirection:', error)
    notificationService.show('Có lỗi xảy ra khi chuyển hướng', { type: 'error' })
  }
}

// Hàm đăng nhập
const login = async () => {
  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập email và mật khẩu'
    return
  }
  
  try {
    isLoading.value = true
    error.value = ''
    
    // Đảm bảo xóa dữ liệu cũ
    clearAllAuthData()
    
    // Gọi auth store để đăng nhập
    const credentials = {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    }
    
    console.log('Đang đăng nhập với email:', email.value)
    
    try {
      const result = await auth.login(credentials)
      
      if (result.success) {
        // Xác nhận đồng bộ giữa localStorage và sessionStorage
        if (auth.syncStorages) {
          console.log('Đồng bộ dữ liệu đăng nhập')
          auth.syncStorages()
        }
        
        // Xử lý chuyển hướng sau đăng nhập
        handleSuccessfulLogin(true)
      } else {
        error.value = result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      }
    } catch (loginError) {
      console.error('Login function error:', loginError)
      error.value = 'Lỗi hệ thống. Vui lòng thử lại sau.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.auth-page {
  padding-bottom: 4rem;
}

@media (max-width: 640px) {
  .auth-page {
    padding-top: 6rem;
  }
}
</style> 