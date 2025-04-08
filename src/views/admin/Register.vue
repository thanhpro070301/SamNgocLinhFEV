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
            <label for="name" class="sr-only">Họ và tên</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              minlength="2"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Họ và tên"
            >
            <p v-if="form.name && form.name.length < 2" class="text-red-500 text-xs mt-1">Họ và tên phải có ít nhất 2 ký tự</p>
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
            <p v-if="form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)" class="text-red-500 text-xs mt-1">Email không hợp lệ</p>
          </div>
          <div>
            <label for="phone" class="sr-only">Số điện thoại</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Số điện thoại (không bắt buộc)"
            >
            <p v-if="form.phone && !/^\d{10,11}$/.test(form.phone)" class="text-red-500 text-xs mt-1">Số điện thoại phải có 10-11 chữ số</p>
          </div>
          <div>
            <label for="password" class="sr-only">Mật khẩu</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
            >
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
            <div v-if="form.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div v-for="i in 5" :key="i" 
                  class="h-1 flex-1 rounded"
                  :class="i <= passwordStrength ? 'bg-green-500' : 'bg-gray-200'">
                </div>
              </div>
              <p class="text-xs mt-1 text-gray-500">
                Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
              </p>
            </div>
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
            <p v-if="form.passwordConfirm && form.password !== form.passwordConfirm" class="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
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
              maxlength="6"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mã OTP"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <button 
              type="button" 
              @click="resendOtp" 
              :disabled="otpExpiry > 0"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi lại mã OTP
            </button>
          </div>
          <div class="text-sm">
            <span class="text-gray-500" :class="{ 'text-red-500': otpExpiry < 60 }">
              Mã OTP sẽ hết hạn sau {{ Math.floor(otpExpiry / 60) }}:{{ (otpExpiry % 60).toString().padStart(2, '0') }}
            </span>
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
  phone: '',
  otp: ''
})

// Form validation
const isFormValid = computed(() => {
  return form.name.length >= 2 &&
         form.email &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
         form.password.length >= 6 &&
         /[A-Z]/.test(form.password) &&
         /[a-z]/.test(form.password) &&
         /[0-9]/.test(form.password) &&
         form.password === form.passwordConfirm &&
         (!form.phone || /^\d{10,11}$/.test(form.phone)) &&
         agreeTerms.value
})

// Password strength indicator
const passwordStrength = computed(() => {
  if (!form.password) return 0
  let strength = 0
  if (form.password.length >= 8) strength++
  if (/[A-Z]/.test(form.password)) strength++
  if (/[a-z]/.test(form.password)) strength++
  if (/[0-9]/.test(form.password)) strength++
  if (/[^A-Za-z0-9]/.test(form.password)) strength++
  return strength
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
    successMessage.value = 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.'
  } catch (error) {
    console.error('Send OTP error:', error)
    if (error.response?.status === 429) {
      errorMessage.value = 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    } else {
      errorMessage.value = 'Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.'
    }
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
      password: form.password,
      phone: form.phone || null
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
    if (error.response?.status === 429) {
      errorMessage.value = 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    } else if (error.response?.status === 400) {
      errorMessage.value = error.response.data.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
    } else {
      errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    }
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