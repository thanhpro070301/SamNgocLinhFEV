<template>
  <div class="admin-login min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-green-100 rounded-full overflow-hidden flex-shrink-0">
            <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Đăng nhập quản trị</h2>
        <p class="mt-2 text-sm text-gray-600">
          Hoặc 
          <router-link to="/admin/register" class="font-medium text-green-600 hover:text-green-500">
            đăng ký tài khoản mới
          </router-link>
        </p>
      </div>
      
      <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{{ errorMessage }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md -space-y-px">
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
              placeholder="admin@example.com"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              id="password" 
              v-model="form.password"
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe"
              name="remember-me" 
              type="checkbox" 
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-green-600 hover:text-green-500">
              Quên mật khẩu?
            </a>
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
              <i class="fas fa-sign-in-alt"></i>
            </span>
            {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
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
import sessionToken from '@/store/sessionToken'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)
const rememberMe = ref(false)

// Form data
const form = reactive({
  email: '',
  password: ''
})

const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// Validate form
function validateForm() {
  if (!form.email || !form.password) {
    errorMessage.value = 'Vui lòng nhập email và mật khẩu'
    return false
  }
  return true
}

// Login function
async function login() {
  if (!validateForm()) return
  
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    // Demo credentials - sử dụng mock data thay vì gọi API thực
    const demoAccounts = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        id: 1,
        name: 'Admin',
        role: 'admin'
      },
      {
        email: 'samngoclinh@gmail.com',
        password: 'sam123',
        id: 2,
        name: 'Quản lý Sâm Ngọc Linh',
        role: 'admin'
      }
    ]
    
    // Kiểm tra đăng nhập với tài khoản demo
    const foundUser = demoAccounts.find(
      account => account.email === form.email && account.password === form.password
    )
    
    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      }
      
      // Lưu thông tin đăng nhập
      auth.currentUser.value = userInfo
      auth.isAuthenticated.value = true
      
      // Tạo token session
      const tokenId = sessionToken.createToken(userInfo, rememberMe.value)
      
      // Chuyển hướng đến trang dashboard
      router.push('/admin/dashboard')
    } else {
      errorMessage.value = 'Email hoặc mật khẩu không đúng'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Đã xảy ra lỗi, vui lòng thử lại sau'
  } finally {
    isLoading.value = false
  }
}
</script> 