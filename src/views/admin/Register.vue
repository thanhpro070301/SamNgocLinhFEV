<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div class="text-center">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full overflow-hidden flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
              <img src="@/assets/images/sam-tuoi.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
          <p class="mt-2 text-sm text-gray-600">
            Hoặc
            <router-link to="/admin/login" class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
              đăng nhập nếu đã có tài khoản
            </router-link>
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md space-y-4">
            <!-- Name Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Họ và tên *"
              >
            </div>

            <!-- Email Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Email *"
              >
            </div>

            <!-- Phone Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                required
                pattern="[0-9]{10,11}"
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Số điện thoại *"
                @input="handlePhoneInput"
              >
              <div v-if="isTypingPhone" class="mt-1 text-xs">
                <p v-if="!form.phone" class="text-red-500">Vui lòng nhập số điện thoại</p>
                <p v-else-if="!/^\d{10,11}$/.test(form.phone)" class="text-red-500">Số điện thoại phải có 10-11 chữ số</p>
                <p v-else class="text-green-500">Số điện thoại hợp lệ</p>
              </div>
            </div>

            <!-- Password Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Mật khẩu *"
                @input="handlePasswordInput"
              >
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg v-if="showPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </button>
              <div v-if="isTypingPassword" class="mt-1">
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

            <!-- Confirm Password Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="password-confirm"
                v-model="form.passwordConfirm"
                name="password-confirm"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Xác nhận mật khẩu *"
              >
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
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với <a href="#" class="text-green-600 hover:text-green-500">điều khoản sử dụng</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
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
              {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();
const isLoading = ref(false);
const agreeTerms = ref(false);
const showPassword = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
});

// Form validation
const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.email &&
         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email) &&
         form.value.password.length >= 6 &&
         /[A-Z]/.test(form.value.password) &&
         /[a-z]/.test(form.value.password) &&
         /[0-9]/.test(form.value.password) &&
         form.value.password === form.value.passwordConfirm &&
         form.value.phone &&
         /^\d{10,11}$/.test(form.value.phone) &&
         agreeTerms.value;
});

// Password strength indicator
const passwordStrength = computed(() => {
  if (!form.value.password) return 0;
  let strength = 0;
  if (form.value.password.length >= 8) strength++;
  if (/[A-Z]/.test(form.value.password)) strength++;
  if (/[a-z]/.test(form.value.password)) strength++;
  if (/[0-9]/.test(form.value.password)) strength++;
  if (/[^A-Za-z0-9]/.test(form.value.password)) strength++;
  return strength;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const isTypingPassword = ref(false);
let typingTimeout = null;
const handlePasswordInput = () => {
  isTypingPassword.value = true;
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTypingPassword.value = false;
  }, 3000);
};

const isTypingPhone = ref(false);
let phoneTypingTimeout = null;
const handlePhoneInput = () => {
  isTypingPhone.value = true;
  if (phoneTypingTimeout) clearTimeout(phoneTypingTimeout);
  phoneTypingTimeout = setTimeout(() => {
    isTypingPhone.value = false;
  }, 3000);
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  isLoading.value = true;
  try {
    const success = await auth.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone
    });
    
    if (success) {
      router.push('/admin/dashboard');
    }
  } catch (error) {
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout);
  if (phoneTypingTimeout) clearTimeout(phoneTypingTimeout);
});
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style> 