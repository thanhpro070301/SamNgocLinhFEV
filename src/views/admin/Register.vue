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
      
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="rounded-md -space-y-px">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Họ tên</label>
            <input 
              id="name" 
              v-model="form.name"
              name="name" 
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
              v-model="form.email"
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="example@email.com"
            >
          </div>
          
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              id="password" 
              v-model="form.password"
              name="password" 
              type="password" 
              autocomplete="new-password" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
          
          <div>
            <label for="password_confirm" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input 
              id="password_confirm" 
              v-model="form.passwordConfirm"
              name="password_confirm" 
              type="password" 
              autocomplete="new-password" 
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
            :disabled="isLoading"
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import auth from '@/store/auth'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const agreeTerms = ref(false)

const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// Validate form
function validateForm() {
  if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin'
    return false
  }
  
  if (form.password !== form.passwordConfirm) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp'
    return false
  }
  
  if (form.password.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return false
  }
  
  return true
}

// Register function
async function register() {
  if (!validateForm()) return
  
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    // Gọi API đăng ký
    await api.auth.register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    
    // Chuyển hướng đến trang đăng nhập
    router.push({
      path: '/admin/login',
      query: { registered: 'success' }
    })
  } catch (error) {
    console.error('Register error:', error)
    
    // Hiển thị thông báo lỗi phù hợp
    if (error.response) {
      // Nếu server trả về lỗi
      switch (error.response.status) {
        case 409:
          errorMessage.value = 'Email đã được sử dụng, vui lòng chọn email khác'
          break
        case 400:
          errorMessage.value = 'Thông tin không hợp lệ, vui lòng kiểm tra lại'
          break
        default:
          errorMessage.value = 'Đã xảy ra lỗi, vui lòng thử lại sau'
      }
    } else {
      // Lỗi kết nối hoặc lỗi khác
      errorMessage.value = 'Không thể kết nối đến máy chủ, vui lòng thử lại sau'
    }
  } finally {
    isLoading.value = false
  }
}
</script> 