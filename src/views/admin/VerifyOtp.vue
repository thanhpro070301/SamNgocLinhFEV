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
            Mã xác thực đã được gửi đến email <span class="font-semibold">{{ email }}</span>
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
            <!-- OTP Input with 6 separate boxes -->
            <div>
              <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">Nhập mã OTP (6 chữ số)</label>
              <div class="flex justify-between gap-2">
                <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  v-model="otpDigits[index]"
                  type="text"
                  maxlength="1"
                  class="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  @input="handleDigitInput(index)"
                  @keydown="handleKeyDown($event, index)"
                  @paste="handlePaste"
                  ref="otpInputs"
                >
              </div>
              
              <p class="mt-3 text-xs text-gray-500">
                Mã OTP có hiệu lực trong <span class="font-semibold">5 phút</span>. Nếu không nhận được, bạn có thể 
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
              :disabled="isLoading || !isOtpComplete"
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
              {{ isLoading ? 'Đang xác thực...' : 'Xác thực' }}
            </button>
          </div>
          
          <div class="text-center">
            <router-link to="/admin/register" class="text-sm text-green-600 hover:text-green-500">
              Quay lại trang đăng ký
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const email = ref('');
const action = ref('register');

// OTP input logic
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);

// Computed property để kiểm tra OTP đã nhập đủ chưa
const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit.length === 1);
});

// Computed property để lấy toàn bộ mã OTP
const otpValue = computed(() => {
  return otpDigits.value.join('');
});

// Hàm xử lý khi nhập một chữ số
const handleDigitInput = (index) => {
  // Đảm bảo giá trị là một chữ số
  otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '');
  
  // Tự động di chuyển đến ô tiếp theo nếu đã nhập
  if (otpDigits.value[index] && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1].focus();
    });
  }
};

// Xử lý việc xóa số bằng phím Backspace
const handleKeyDown = (event, index) => {
  // Xử lý phím Backspace
  if (event.key === 'Backspace') {
    if (otpDigits.value[index] === '') {
      // Nếu ô hiện tại trống, di chuyển focus đến ô trước đó
      if (index > 0) {
        otpInputs.value[index - 1].focus();
      }
    } else {
      // Xóa giá trị trong ô hiện tại
      otpDigits.value[index] = '';
    }
  }
};

// Xử lý paste OTP
const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = (event.clipboardData || window.clipboardData).getData('text');
  const digits = pastedData.replace(/[^0-9]/g, '').substring(0, 6);
  
  if (digits.length > 0) {
    for (let i = 0; i < 6; i++) {
      otpDigits.value[i] = i < digits.length ? digits[i] : '';
    }
    
    // Focus vào ô cuối cùng hoặc ô tiếp theo sau số đã paste
    const focusIndex = Math.min(digits.length, 5);
    nextTick(() => {
      otpInputs.value[focusIndex].focus();
    });
  }
};

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
    errorMessage.value = '';
    successMessage.value = '';
    
    console.log('Attempting to send OTP to:', email.value);
    const response = await api.auth.sendOtp(email.value);
    console.log('Resend OTP response:', response);
    
    // Nếu không có lỗi, coi như thành công
    // Kiểm tra phản hồi theo định dạng API mới
    if (response && (response.success || response.message)) {
      successMessage.value = response.message || 'Mã OTP mới đã được gửi đến email của bạn.';
      startResendCountdown();
    } else if (typeof response === 'string') {
      // Trường hợp API trả về chuỗi text trực tiếp
      successMessage.value = response || 'Mã OTP mới đã được gửi đến email của bạn.';
      startResendCountdown();
    } else {
      // Phòng trường hợp response có dạng khác
      successMessage.value = 'Mã OTP mới đã được gửi đến email của bạn.';
      startResendCountdown();
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    if (error.response) {
      console.log('OTP error response:', error.response);
      if (error.response.status === 400) {
        errorMessage.value = 'Email không hợp lệ hoặc không thể gửi OTP.';
      } else if (error.response.status === 429) {
        errorMessage.value = 'Đã gửi quá nhiều OTP. Vui lòng thử lại sau.';
      } else {
        errorMessage.value = 'Không thể gửi mã OTP. Máy chủ gặp sự cố.';
      }
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      errorMessage.value = 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      // Lỗi cấu hình request
      errorMessage.value = error.message || 'Không thể gửi lại OTP. Vui lòng thử lại sau.';
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!isOtpComplete.value) {
    errorMessage.value = 'Vui lòng nhập đủ 6 chữ số OTP!';
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    console.log('Đang xác thực OTP:', otpValue.value, 'cho email:', email.value);
    
    // Xác thực OTP
    const response = await api.auth.verifyOtp(email.value, otpValue.value);
    console.log('Verify OTP response:', response);
    
    // Bất kỳ response nào mà không lỗi đều coi là thành công
    successMessage.value = 'Xác thực OTP thành công!';
    
    // Tùy thuộc vào loại action, có thể có các xử lý khác nhau
    if (action.value === 'register') {
      // Đã xác thực OTP cho đăng ký
      const registrationData = getRegistrationData();
      console.log('Registration data:', registrationData);
      
      // Chuyển về trang đăng ký để hoàn tất với thông tin đã lưu
      setTimeout(() => {
        router.push({
          path: '/admin/register',
          query: { 
            email: email.value,
            verified: 'true'
          }
        });
      }, 1000);
    } else {
      // Các action khác (nếu có)
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    
    if (error.response) {
      console.log('OTP verification error response:', error.response);
      if (error.response.status === 400) {
        errorMessage.value = 'Mã OTP không hợp lệ hoặc đã hết hạn.';
      } else if (error.response.status === 429) {
        errorMessage.value = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      } else {
        errorMessage.value = 'Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.';
      }
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      errorMessage.value = 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      // Lỗi cấu hình request
      errorMessage.value = error.message || 'Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  console.log('VerifyOtp component mounted');
  console.log('Route query params:', route.query);
  
  if (route.query.email) {
    email.value = route.query.email;
    
    if (route.query.action) {
      action.value = route.query.action;
    }
    
    // Bắt đầu đếm ngược cho nút gửi lại
    startResendCountdown();
    
    // Focus vào ô đầu tiên
    nextTick(() => {
      if (otpInputs.value[0]) {
        otpInputs.value[0].focus();
      }
    });
    
    console.log('Email from query:', email.value);
    console.log('Action from query:', action.value);
  } else {
    // Không có email trong query, thử lấy từ sessionStorage
    const registrationData = getRegistrationData();
    if (registrationData && registrationData.email) {
      email.value = registrationData.email;
      console.log('Email from sessionStorage:', email.value);
      
      // Bắt đầu đếm ngược cho nút gửi lại
      startResendCountdown();
    } else {
      console.warn('No email found, redirecting to register page');
      router.push('/admin/register');
    }
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
/* Animation for messages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styling for OTP input fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style> 