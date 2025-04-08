<template>
  <div class="admin-register min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full overflow-hidden flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
            <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Đăng ký tài khoản</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Hoặc
          <router-link to="/admin/login" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
            đăng nhập nếu đã có tài khoản
          </router-link>
        </p>
      </div>
      
      <transition name="fade">
        <div v-if="errorMessage" class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4 rounded" role="alert">
          <p>{{ errorMessage }}</p>
        </div>
      </transition>
      
      <transition name="fade">
        <div v-if="successMessage" class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 mb-4 rounded" role="alert">
          <p>{{ successMessage }}</p>
        </div>
      </transition>

      <!-- Step 1: Basic Info -->
      <form v-if="currentStep === 1" @submit.prevent="handleStep1" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Tên người dùng</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Tên người dùng"
            >
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Mật khẩu</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
            >
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div>
            <label for="passwordConfirm" class="sr-only">Xác nhận mật khẩu</label>
            <input
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              name="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
            >
            <button type="button" @click="showPasswordConfirm = !showPasswordConfirm" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center">
          <input 
            id="agreeTerms" 
            v-model="agreeTerms"
            name="agreeTerms" 
            type="checkbox" 
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          >
          <label for="agreeTerms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Tôi đồng ý với <a href="#" class="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">điều khoản sử dụng</a>
          </label>
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
              <i class="fas fa-user-plus"></i>
            </span>
            {{ isLoading ? 'Đang xử lý...' : 'Tiếp tục' }}
          </button>
        </div>
      </form>

      <!-- Step 2: OTP Verification -->
      <form v-if="currentStep === 2" @submit.prevent="handleStep2" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="otp" class="sr-only">Mã OTP</label>
            <input
              id="otp"
              v-model="form.otp"
              name="otp"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mã OTP"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <button type="button" @click="resendOtp" class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
              Gửi lại mã OTP
            </button>
          </div>
          <div class="text-sm">
            <span class="text-gray-500">Mã OTP sẽ hết hạn sau {{ otpExpiry }} giây</span>
          </div>
        </div>

        <div>
          <button 
            type="submit"
            :disabled="isLoading || !form.otp"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-check"></i>
            </span>
            {{ isLoading ? 'Đang xác thực...' : 'Xác thực' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import auth from '@/store/auth'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const agreeTerms = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const currentStep = ref(1)
const otpExpiry = ref(300) // 5 minutes
let otpTimer = null

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  otp: ''
})

// Form validation
const isFormValid = computed(() => {
  return form.name.length >= 2 &&
         form.email &&
         form.password.length >= 6 &&
         form.password === form.passwordConfirm &&
         agreeTerms.value
})

// Start OTP countdown
const startOtpCountdown = () => {
  otpExpiry.value = 300
  if (otpTimer) clearInterval(otpTimer)
  otpTimer = setInterval(() => {
    if (otpExpiry.value > 0) {
      otpExpiry.value--
    } else {
      clearInterval(otpTimer)
    }
  }, 1000)
}

// Handle step 1: Send OTP
async function handleStep1() {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await api.auth.sendOtp(form.email)
    currentStep.value = 2
    startOtpCountdown()
  } catch (error) {
    console.error('Send OTP error:', error)
    errorMessage.value = 'Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Handle step 2: Verify OTP and Register
async function handleStep2() {
  if (!form.otp) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Verify OTP
    await api.auth.verifyOtp(form.email, form.otp)
    
    // Register user
    const success = await auth.register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    
    if (success) {
      successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...'
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
    } else {
      errorMessage.value = 'Đăng ký thất bại. Vui lòng thử lại sau.'
    }
  } catch (error) {
    console.error('Register error:', error)
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Resend OTP
async function resendOtp() {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await api.auth.sendOtp(form.email)
    startOtpCountdown()
    successMessage.value = 'Mã OTP mới đã được gửi đến email của bạn!'
  } catch (error) {
    console.error('Resend OTP error:', error)
    errorMessage.value = 'Có lỗi xảy ra khi gửi lại mã OTP. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (otpTimer) clearInterval(otpTimer)
})
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