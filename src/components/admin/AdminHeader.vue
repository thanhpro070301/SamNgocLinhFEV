<template>
  <header class="bg-white shadow-md mb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo và tên hệ thống -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/admin/dashboard" class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full overflow-hidden mr-2">
                <img src="/assets/images/products/sam-tuoi.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
              </div>
              <span class="text-xl font-semibold text-gray-900">Admin</span>
            </router-link>
          </div>
          
          <!-- Desktop menu -->
          <nav class="hidden md:ml-6 md:flex md:space-x-6">
            <router-link
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[
                isActive(item.path) 
                  ? 'border-green-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              <i :class="['mr-1', item.icon]"></i>
              {{ item.label }}
            </router-link>
          </nav>
        </div>
        
        <!-- API Status -->
        <div class="hidden md:flex items-center">
          <ApiStatus :show-details="isUserMenuOpen" />
        </div>
        
        <!-- User dropdown -->
        <div class="flex items-center h-full relative ml-3 user-dropdown">
          <div>
            <button 
              @click="toggleUserMenu"
              class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 rounded-full hover:bg-gray-100 p-1 transition-colors"
            >
              <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <i class="fas fa-user text-green-700"></i>
              </div>
              <span class="ml-2 hidden md:block">{{ userName }}</span>
              <i :class="[isUserMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'fas ml-1 text-xs']"></i>
            </button>
          </div>
          
          <!-- Dropdown menu -->
          <div 
            v-if="isUserMenuOpen" 
            class="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200"
            style="top: 100%; right: -22px;"
          >
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
            </div>
            <router-link 
              to="/admin/profile" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isUserMenuOpen = false"
            >
              <i class="fas fa-user-circle mr-2 w-5 text-center text-gray-500"></i> Tài khoản cá nhân
            </router-link>
            <router-link 
              to="/admin/settings" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isUserMenuOpen = false"
            >
              <i class="fas fa-cog mr-2 w-5 text-center text-gray-500"></i> Cài đặt hệ thống
            </router-link>
            <router-link 
              to="/admin/sessions" 
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="isUserMenuOpen = false"
            >
              <i class="fas fa-key mr-2 w-5 text-center text-gray-500"></i> Quản lý phiên
            </router-link>
            <div class="border-t border-gray-100 my-1"></div>
            <button 
              @click="logout" 
              class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <i class="fas fa-sign-out-alt mr-2 w-5 text-center"></i> Đăng xuất
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="ml-2 -mr-2 flex items-center md:hidden">
          <button 
            @click="toggleMobileMenu"
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
            <span class="sr-only">Open main menu</span>
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[
            isActive(item.path) 
              ? 'bg-green-50 border-green-500 text-green-700' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
          ]"
          @click="isMobileMenuOpen = false"
        >
          <i :class="['mr-2', item.icon]"></i>
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'
import notificationService from '@/utils/notificationService'
import ApiStatus from '@/components/ApiStatus.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Menu items
const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Sản phẩm', path: '/admin/products', icon: 'fas fa-box' },
  { label: 'Danh mục', path: '/admin/categories', icon: 'fas fa-tags' },
  { label: 'Dịch vụ', path: '/admin/services', icon: 'fas fa-cogs' },
  { label: 'Đơn hàng', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
  { label: 'Tin tức', path: '/admin/news', icon: 'fas fa-newspaper' },
  { label: 'Người dùng', path: '/admin/users', icon: 'fas fa-users' },
  { label: 'API', path: '/admin/api-config', icon: 'fas fa-server' }
]

// Get user info from auth store
const userName = computed(() => auth.currentUser?.value?.name || 'Admin')
const userEmail = computed(() => auth.currentUser?.value?.email || 'admin@example.com')
const userInitials = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

// Toggle mobile menu
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// Toggle user menu
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Check if route is active
function isActive(path) {
  return route.path.startsWith(path)
}

// Đóng dropdown khi click ra ngoài
function closeDropdownOnOutsideClick(event) {
  if (isUserMenuOpen.value && !event.target.closest('.user-dropdown')) {
    isUserMenuOpen.value = false
  }
}

// Đăng xuất
async function logout() {
  try {
    isUserMenuOpen.value = false
    
    const token = localStorage.getItem('admin_current_token')
    if (!token) {
      handleLogoutSuccess()
      return
    }
    
    // Gọi API đăng xuất sử dụng API client
    try {
      const { authApi } = await import('@/api');
      await authApi.logout();
      console.log('Đăng xuất thành công từ API')
    } catch (error) {
      console.error('Không thể gọi API đăng xuất:', error)
    }
    
    // Xử lý đăng xuất ở client
    handleLogoutSuccess()
    
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error)
    notificationService.show('Đã xảy ra lỗi khi đăng xuất', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Xử lý sau khi đăng xuất
function handleLogoutSuccess() {
  // Xóa token
  localStorage.removeItem('admin_current_token')
  
  // Đặt lại trạng thái xác thực
  auth.isAuthenticated.value = false
  auth.currentUser.value = null
  
  // Xóa session token
  sessionToken.resetAll()
  
  // Thông báo
  notificationService.show('Đăng xuất thành công', {
    title: 'Đăng xuất',
    type: 'success'
  })
  
  // Chuyển hướng về trang đăng nhập
  router.push('/admin/login')
}

// Lắng nghe sự kiện click để đóng dropdown
onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick)
})
</script> 