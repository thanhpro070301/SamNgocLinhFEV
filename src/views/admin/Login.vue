<template>
  <div class="admin-login min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full overflow-hidden flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
            <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Đăng nhập quản trị</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Hoặc 
          <router-link to="/admin/register" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
            đăng ký tài khoản mới
          </router-link>
        </p>
      </div>
      
      <transition name="fade">
        <div v-if="errorMessage" class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4 rounded" role="alert">
          <p>{{ errorMessage }}</p>
        </div>
      </transition>
      
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md -space-y-px">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              id="email" 
              v-model="form.email"
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
              placeholder="example@email.com"
              @input="validateEmail"
            >
            <p v-if="emailError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ emailError }}</p>
          </div>
          
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <div class="relative">
              <input 
                id="password" 
                v-model="form.password"
                name="password" 
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="current-password" 
                required 
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
                placeholder="••••••••"
                @input="validatePassword"
              >
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ passwordError }}</p>
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
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-sign-in-alt"></i>
            </span>
            {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import auth from '@/store/auth'
import sessionToken from '@/store/sessionToken'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)
const showPassword = ref(false)

// Form validation errors
const emailError = ref('')
const passwordError = ref('')

// Form data
const form = reactive({
  email: '',
  password: ''
})

const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// Computed property for form validation
const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         !emailError.value && 
         !passwordError.value
})

// Validation functions
function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    emailError.value = 'Vui lòng nhập email'
  } else if (!emailRegex.test(form.email)) {
    emailError.value = 'Email không hợp lệ'
  } else {
    emailError.value = ''
  }
}

function validatePassword() {
  if (!form.password) {
    passwordError.value = 'Vui lòng nhập mật khẩu'
  } else {
    passwordError.value = ''
  }
}

// Login function
async function login() {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const success = await auth.login({
      email: form.email,
      password: form.password,
      rememberMe: rememberMe.value
    })
    
    if (success) {
      // Chuyển hướng đến trang dashboard
      router.push('/admin/dashboard')
    } else {
      errorMessage.value = 'Email hoặc mật khẩu không đúng'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 