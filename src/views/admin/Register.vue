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
      
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="rounded-md -space-y-px">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ tên</label>
            <input 
              id="name" 
              v-model="form.name"
              name="name" 
              type="text" 
              autocomplete="name" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
              placeholder="Nguyễn Văn A"
              @input="validateName"
            >
            <p v-if="nameError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ nameError }}</p>
          </div>
          
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
                autocomplete="new-password" 
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
          
          <div class="mb-4">
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
            <div class="relative">
              <input 
                id="passwordConfirm" 
                v-model="form.passwordConfirm"
                name="passwordConfirm" 
                :type="showPasswordConfirm ? 'text' : 'password'" 
                autocomplete="new-password" 
                required 
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
                placeholder="••••••••"
                @input="validatePasswordConfirm"
              >
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPasswordConfirm = !showPasswordConfirm"
              >
                <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <p v-if="passwordConfirmError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ passwordConfirmError }}</p>
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
            {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
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

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const agreeTerms = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Form validation errors
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const passwordConfirmError = ref('')

const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// Computed property for form validation
const isFormValid = computed(() => {
  return form.name && 
         form.email && 
         form.password && 
         form.passwordConfirm && 
         !nameError.value && 
         !emailError.value && 
         !passwordError.value && 
         !passwordConfirmError.value &&
         agreeTerms.value
})

// Validation functions
function validateName() {
  if (!form.name) {
    nameError.value = 'Vui lòng nhập họ tên'
  } else if (form.name.length < 2) {
    nameError.value = 'Họ tên phải có ít nhất 2 ký tự'
  } else {
    nameError.value = ''
  }
}

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
  } else if (form.password.length < 6) {
    passwordError.value = 'Mật khẩu phải có ít nhất 6 ký tự'
  } else {
    passwordError.value = ''
    validatePasswordConfirm()
  }
}

function validatePasswordConfirm() {
  if (!form.passwordConfirm) {
    passwordConfirmError.value = 'Vui lòng xác nhận mật khẩu'
  } else if (form.password !== form.passwordConfirm) {
    passwordConfirmError.value = 'Mật khẩu xác nhận không khớp'
  } else {
    passwordConfirmError.value = ''
  }
}

// Register function
async function register() {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const success = await auth.register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    
    if (success) {
      successMessage.value = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
      // Reset form
      form.name = ''
      form.email = ''
      form.password = ''
      form.passwordConfirm = ''
      agreeTerms.value = false
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/admin/login')
      }, 3000)
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