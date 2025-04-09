<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div class="text-center">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full overflow-hidden flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
              <img src="@/assets/images/products/sam-tuoi.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">Xác thực OTP</h2>
          <p class="mt-2 text-sm text-gray-600">
            Vui lòng nhập mã OTP được gửi đến email <span class="font-semibold">{{ email }}</span>
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <p>{{ successMessage }}</p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md space-y-4">
            <!-- OTP Input -->
            <div>
              <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="otp"
                  v-model="otpValue"
                  name="otp"
                  type="text"
                  required
                  class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Nhập mã OTP"
                >
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Mã OTP có hiệu lực trong 5 phút. Nếu không nhận được, bạn có thể 
                <button 
                  type="button" 
                  @click="resendOtp" 
                  class="text-green-600 hover:text-green-500 focus:outline-none"
                  :disabled="isResendDisabled"
                >
                  gửi lại {{ isResendDisabled ? `(${resendCountdown}s)` : '' }}
                </button>
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading || !otpValue"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ isLoading ? 'Đang xử lý...' : 'Xác thực' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const otpValue = ref('');
const email = ref('');
const action = ref('');

// Resend OTP logic
const isResendDisabled = ref(false);
const resendCountdown = ref(60);
let countdownInterval = null;

// Lấy dữ liệu đăng ký từ sessionStorage
const getRegistrationData = () => {
  const data = sessionStorage.getItem('registration_data');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing registration data from session storage', e);
      return null;
    }
  }
  return null;
};

// Xóa dữ liệu đăng ký
const clearRegistrationData = () => {
  sessionStorage.removeItem('registration_data');
};

const startResendCountdown = () => {
  isResendDisabled.value = true;
  resendCountdown.value = 60;
  
  countdownInterval = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      clearInterval(countdownInterval);
      isResendDisabled.value = false;
    }
  }, 1000);
};

const resendOtp = async () => {
  if (isResendDisabled.value) return;
  
  try {
    isLoading.value = true;
    const response = await api.auth.sendOtp(email.value);
    if (response && response.success) {
      successMessage.value = 'Mã OTP mới đã được gửi đến email của bạn.';
      errorMessage.value = '';
      startResendCountdown();
    } else {
      errorMessage.value = response?.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.';
      successMessage.value = '';
    }
  } catch (error) {
    errorMessage.value = error.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.';
    successMessage.value = '';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!otpValue.value) {
    errorMessage.value = 'Vui lòng nhập mã OTP!';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    // Xác thực OTP
    const response = await api.auth.verifyOtp(email.value, otpValue.value);
    
    if (!response || !response.success) {
      errorMessage.value = response?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.';
      return;
    }
    
    // Nếu xác thực thành công và đang trong quá trình đăng ký
    if (action.value === 'register') {
      const registrationData = getRegistrationData();
      
      if (!registrationData) {
        errorMessage.value = 'Thông tin đăng ký không hợp lệ. Vui lòng thử lại.';
        router.push('/admin/register');
        return;
      }
      
      // Chuyển về trang đăng ký để hoàn tất, với OTP đã xác thực
      router.push({
        path: '/admin/register',
        query: { 
          email: email.value,
          otp: otpValue.value,
          verified: 'true'
        }
      });
    } else {
      // Trường hợp chỉ xác thực OTP (không phải đăng ký)
      successMessage.value = 'Xác thực OTP thành công!';
      setTimeout(() => {
        // Xóa dữ liệu đăng ký nếu có
        clearRegistrationData();
        router.push('/admin/login');
      }, 1000);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    if (error.response?.status === 400) {
      errorMessage.value = 'Mã OTP không hợp lệ hoặc đã hết hạn.';
    } else if (error.response?.status === 429) {
      errorMessage.value = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    } else {
      errorMessage.value = error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const route = router.currentRoute.value;
  
  if (route.query.email) {
    email.value = route.query.email;
    action.value = route.query.action || '';
    
    // Nếu action là register, kiểm tra dữ liệu từ sessionStorage
    if (action.value === 'register') {
      const registrationData = getRegistrationData();
      if (!registrationData) {
        // Không tìm thấy dữ liệu đăng ký
        console.warn('Registration data not found in session storage');
      }
    }
    
    // Bắt đầu đếm ngược cho nút gửi lại
    startResendCountdown();
  } else {
    // Không có email, chuyển hướng về trang đăng ký
    router.push('/admin/register');
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

/* Animation for messages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 