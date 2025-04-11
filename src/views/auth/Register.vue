<template>
  <div class="auth-page pt-20 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Header image and logo removed - using global header now -->
      
      <!-- Registration form -->
      <div class="p-8 relative">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Đăng ký tài khoản</h2>
          <p class="text-sm text-gray-600 mt-2">Tạo tài khoản để mua sắm dễ dàng hơn</p>
        </div>
        
        <div v-if="error" class="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
          {{ error }}
        </div>
        
        <div v-if="successMessage" class="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-200">
          {{ successMessage }}
        </div>
        
        <!-- Step 1: Email verification -->
        <form v-if="currentStep === 1" @submit.prevent="sendVerificationCode" class="space-y-5">
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
                placeholder="Email của bạn"
                :disabled="isOtpSent"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">Bạn sẽ nhận được mã xác thực qua email này</p>
          </div>
          
          <div v-if="isOtpSent" class="space-y-4">
            <div>
              <label for="otp" class="block text-sm font-medium text-gray-700">Mã xác thực OTP</label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-key text-gray-400"></i>
                </div>
                <input 
                  v-model="otpCode" 
                  id="otp" 
                  name="otp" 
                  type="text" 
                  required 
                  maxlength="6"
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập mã OTP 6 số"
                />
              </div>
              <div class="mt-2 flex justify-between items-center">
                <p class="text-sm text-gray-500">
                  Mã sẽ hết hạn sau <span class="font-medium">{{ otpExpireMinutes }} phút</span>
                </p>
                <button 
                  type="button" 
                  @click="resendOtp" 
                  class="text-sm text-green-600 hover:text-green-700"
                  :disabled="resendCountdown > 0 || verifyingOtp"
                >
                  {{ resendCountdown > 0 ? `Gửi lại sau ${resendCountdown}s` : 'Gửi lại mã' }}
                </button>
              </div>
            </div>
            
            <button 
              type="button" 
              @click="verifyOtpCode" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
              :disabled="!otpCode || otpCode.length !== 6 || verifyingOtp"
            >
              <span v-if="verifyingOtp" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="fas fa-circle-notch fa-spin"></i>
              </span>
              {{ verifyingOtp ? 'Đang xác thực...' : 'Xác thực mã OTP' }}
            </button>
          </div>
          
          <button 
            v-if="!isOtpSent"
            type="submit" 
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
            :disabled="isLoading || !email"
          >
            <span v-if="isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
              <i class="fas fa-circle-notch fa-spin"></i>
            </span>
            {{ isLoading ? 'Đang gửi...' : 'Gửi mã xác thực' }}
          </button>
        </form>
        
        <!-- Step 2: Registration form -->
        <form v-if="currentStep === 2" @submit.prevent="register" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">Họ</label>
              <input 
                v-model="firstName" 
                id="firstName" 
                name="firstName" 
                type="text" 
                required 
                class="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Họ của bạn"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Tên</label>
              <input 
                v-model="lastName" 
                id="lastName" 
                name="lastName" 
                type="text" 
                required 
                class="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Tên của bạn"
              />
            </div>
          </div>

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
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                placeholder="Email của bạn"
                readonly
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i class="fas fa-check-circle text-green-500"></i>
              </div>
            </div>
            <p class="mt-1 text-sm text-green-600">Email đã được xác thực thành công</p>
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-phone text-gray-400"></i>
              </div>
              <input 
                v-model="phone" 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Số điện thoại của bạn"
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
                autocomplete="new-password" 
                required 
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Mật khẩu của bạn"
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
            <p class="mt-1 text-sm text-gray-500">Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <input 
                v-model="confirmPassword" 
                id="confirmPassword" 
                name="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                autocomplete="new-password" 
                required 
                class="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                :class="{'border-red-500': password !== confirmPassword && confirmPassword}"
                placeholder="Nhập lại mật khẩu"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword" 
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <p v-if="password !== confirmPassword && confirmPassword" class="mt-1 text-sm text-red-600">
              Mật khẩu xác nhận không khớp
            </p>
          </div>

          <div class="flex items-center">
            <input 
              v-model="agreeTerms" 
              id="agreeTerms" 
              name="agreeTerms" 
              type="checkbox" 
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với <a href="#" class="text-green-600 hover:text-green-500">Điều khoản dịch vụ</a> và <a href="#" class="text-green-600 hover:text-green-500">Chính sách bảo mật</a>
            </label>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
              :disabled="isLoading || password !== confirmPassword"
            >
              <span v-if="isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="fas fa-circle-notch fa-spin"></i>
              </span>
              {{ isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link to="/auth/login" class="font-medium text-green-600 hover:text-green-500">
              Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useNotificationService } from '@/composables/useNotificationService'

const router = useRouter()
const auth = useAuthStore()
const notificationService = useNotificationService()

// Steps control
const currentStep = ref(1) // 1: Email verification, 2: Registration form

// OTP verification state
const email = ref('')
const otpCode = ref('')
const isOtpSent = ref(false)
const verifyingOtp = ref(false)
const otpExpireMinutes = ref(5) // OTP expires after 5 minutes
const resendCountdown = ref(0)
const countdownInterval = ref(null)
const successMessage = ref('')

// Form state
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)
const isLoading = ref(false)
const error = ref('')

// Validation
const isPasswordValid = computed(() => {
  // Password should be at least 8 characters with at least one uppercase, one lowercase and one number
  if (!password.value) return true
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password.value)
})

// OTP Send Function
const sendVerificationCode = async () => {
  if (!email.value) {
    error.value = 'Vui lòng nhập địa chỉ email'
    return
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Địa chỉ email không hợp lệ'
    return
  }
  
  try {
    isLoading.value = true
    error.value = ''
    successMessage.value = ''
    
    const response = await auth.sendOtp(email.value)
    
    if (response.success) {
      isOtpSent.value = true
      successMessage.value = response.message || 'Mã OTP đã được gửi đến email của bạn!'
      startResendCountdown()
    } else {
      error.value = response.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.'
    }
  } catch (err) {
    console.error('Error sending OTP:', err)
    error.value = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Start countdown for resend OTP button
const startResendCountdown = () => {
  // Clear any existing interval
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  // Set countdown to 60 seconds
  resendCountdown.value = 60
  
  // Start the interval
  countdownInterval.value = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--
    } else {
      clearInterval(countdownInterval.value)
    }
  }, 1000)
}

// Resend OTP
const resendOtp = async () => {
  if (resendCountdown.value > 0) return
  
  try {
    isLoading.value = true
    error.value = ''
    successMessage.value = ''
    
    const response = await auth.sendOtp(email.value)
    
    if (response.success) {
      successMessage.value = response.message || 'Mã OTP mới đã được gửi đến email của bạn!'
      startResendCountdown()
    } else {
      error.value = response.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.'
    }
  } catch (err) {
    console.error('Error resending OTP:', err)
    error.value = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Verify OTP code
const verifyOtpCode = async () => {
  if (!otpCode.value || otpCode.value.length !== 6) {
    error.value = 'Vui lòng nhập đủ 6 chữ số của mã OTP'
    return
  }
  
  try {
    verifyingOtp.value = true
    error.value = ''
    successMessage.value = ''
    
    const response = await auth.verifyOtp(email.value, otpCode.value)
    
    if (response.success) {
      // OTP verified successfully, proceed to registration form
      successMessage.value = response.message || 'Xác thực email thành công!'
      
      // Clear any existing interval
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
      }
      
      // Move to step 2 after a brief delay
      setTimeout(() => {
        currentStep.value = 2
      }, 1000)
    } else {
      error.value = response.message || 'Mã OTP không đúng hoặc đã hết hạn.'
    }
  } catch (err) {
    console.error('Error verifying OTP:', err)
    error.value = err.message || 'Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau.'
  } finally {
    verifyingOtp.value = false
  }
}

// Registration function
const register = async () => {
  // Basic validation
  if (!firstName.value || !lastName.value || !email.value || !phone.value || !password.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  
  if (!isPasswordValid.value) {
    error.value = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    return
  }
  
  if (!agreeTerms.value) {
    error.value = 'Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật'
    return
  }
  
  try {
    isLoading.value = true
    error.value = ''
    
    // Call auth API to register
    const userData = {
      name: `${firstName.value} ${lastName.value}`.trim(),
      email: email.value,
      phone: phone.value,
      password: password.value
    }
    
    const response = await auth.register(userData)
    
    if (response.success) {
      // Show success notification
      notificationService.show('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.', {
        title: 'Đăng ký thành công',
        type: 'success'
      })
      
      // Redirect to login
      router.push('/auth/login')
    } else {
      error.value = response.message || 'Đăng ký thất bại. Vui lòng thử lại sau.'
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.'
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