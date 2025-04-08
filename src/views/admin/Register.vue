<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <a href="#" class="font-medium text-green-600 hover:text-green-500">
            đăng nhập nếu bạn đã có tài khoản
          </a>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Họ và tên</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Họ và tên *"
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
              placeholder="Email *"
            >
          </div>
          <div>
            <label for="phone" class="sr-only">Số điện thoại</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              pattern="[0-9]{10,11}"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Số điện thoại *"
              @input="handlePhoneInput"
            >
          </div>
          <div class="relative">
            <label for="password" class="sr-only">Mật khẩu</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu *"
              @input="handlePasswordInput"
            >
            <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a7 7 0 00-7 7 7 7 0 0014 0 7 7 0 00-7-7zm0 12a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.172 3.172a4 4 0 015.656 0L10 4.343l1.172-1.171a4 4 0 115.656 5.656L10 15.657l-1.172-1.171a4 4 0 01-5.656-5.656L3.172 3.172zM10 12a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <div>
            <label for="password-confirm" class="sr-only">Xác nhận mật khẩu</label>
            <input
              id="password-confirm"
              v-model="form.passwordConfirm"
              name="password-confirm"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu *"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
});

const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = () => {
  // Handle form submission
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