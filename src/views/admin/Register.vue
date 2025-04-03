<template>
  <div class="admin-register min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-green-100 rounded-full overflow-hidden flex-shrink-0">
            <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        <p class="mt-2 text-sm text-gray-600">
          Hoặc
          <router-link to="/admin/login" class="font-medium text-green-600 hover:text-green-500">
            đăng nhập nếu đã có tài khoản
          </router-link>
        </p>
      </div>
      
      <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{{ errorMessage }}</p>
      </div>
      
      <div v-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
        <p>{{ successMessage }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md -space-y-px">
          <div class="mb-4">
            <label for="fullname" class="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input 
              id="fullname" 
              v-model="fullname"
              name="fullname" 
              type="text" 
              autocomplete="name" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Nguyễn Văn A"
            >
          </div>
          
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              v-model="email"
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="admin@example.com"
            >
          </div>
          
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              id="password" 
              v-model="password"
              name="password" 
              type="password"
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input 
              id="confirmPassword" 
              v-model="confirmPassword"
              name="confirmPassword" 
              type="password"
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div>
          <div class="flex items-center">
            <input 
              id="agree-terms" 
              v-model="agreeTerms"
              name="agree-terms" 
              type="checkbox" 
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            >
            <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
              Tôi đồng ý với các <a href="#" class="text-green-600 hover:text-green-500">điều khoản và điều kiện</a>
            </label>
          </div>
        </div>

        <div>
          <button 
            type="submit"
            :disabled="isLoading || !passwordsMatch"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/store/auth'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const router = useRouter()
const fullname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const passwordsMatch = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const success = await auth.register({
      name: fullname.value,
      email: email.value,
      password: password.value
    })
    
    if (success) {
      successMessage.value = 'Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.'
      
      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } else {
      errorMessage.value = 'Email này đã được sử dụng'
    }
  } catch (error) {
    errorMessage.value = 'Đã xảy ra lỗi, vui lòng thử lại'
    console.error('Register error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 