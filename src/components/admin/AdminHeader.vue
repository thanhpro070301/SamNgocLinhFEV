<template>
  <header class="bg-white shadow-md">
    <div class="max-w-full mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo và tên admin panel -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-full overflow-hidden flex-shrink-0">
              <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
            <span class="text-lg font-bold text-gray-900 ml-3">Admin Panel</span>
          </div>
        </div>
        
        <!-- Menu items -->
        <div class="hidden lg:flex items-center space-x-1">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path" 
            class="px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors flex items-center"
            :class="[
              isActive(item.path) 
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-green-50'
            ]"
          >
            <i :class="[item.icon, 'mr-2 w-5 text-center']"></i>
            {{ item.name }}
          </router-link>
        </div>
        
        <!-- Các tính năng bên phải -->
        <div class="flex items-center">
          <!-- Thông báo -->
          <button class="p-2 rounded-full hover:bg-gray-100 relative">
            <i class="fas fa-bell text-gray-600"></i>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <!-- Dropdown người dùng -->
          <div class="ml-3 relative">
            <div>
              <button 
                @click="toggleUserMenu" 
                class="flex items-center text-sm rounded-full focus:outline-none"
              >
                <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  AD
                </div>
                <span class="ml-2 hidden md:block text-gray-700 font-medium">Admin <i class="fas fa-chevron-down ml-1 text-gray-500"></i></span>
              </button>
            </div>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="isUserMenuOpen" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
              <router-link 
                to="/admin/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-user mr-2"></i> Hồ sơ
              </router-link>
              <router-link 
                to="/admin/sessions" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-mobile-alt mr-2"></i> Phiên đăng nhập
              </router-link>
              <router-link 
                to="/admin/settings" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-cog mr-2"></i> Cài đặt
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button 
                @click="handleLogout" 
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
              </button>
            </div>
          </div>
          
          <!-- Menu bar cho điện thoại -->
          <div class="ml-3 flex items-center lg:hidden">
            <button 
              @click="toggleMobileMenu"
              class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Menu mobile -->
      <div v-if="isMobileMenuOpen" class="lg:hidden py-2 border-t border-gray-100">
        <div class="space-y-1">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="[
              isActive(item.path) 
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="closeMobileMenu"
          >
            <i :class="[item.icon, 'mr-2 w-5 text-center']"></i>
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Fix spacing between menu items */
@media (min-width: 1024px) {
  .hidden.lg\:flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Ensure mobile menu dropdown looks clean */
.mobile-menu {
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import auth from '@/store/auth'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const route = useRoute()
const router = useRouter()
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const currentUser = computed(() => auth.currentUser.value)

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'Sản phẩm', path: '/admin/products', icon: 'fas fa-box' },
  { name: 'Danh mục', path: '/admin/categories', icon: 'fas fa-folder' },
  { name: 'Dịch vụ', path: '/admin/services', icon: 'fas fa-spa' },
  { name: 'Người dùng', path: '/admin/users', icon: 'fas fa-users' },
  { name: 'Đơn hàng', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
  { name: 'Tin tức', path: '/admin/news', icon: 'fas fa-newspaper' },
  { name: 'Phiên đăng nhập', path: '/admin/sessions', icon: 'fas fa-mobile-alt' },
]

const isActive = (path) => {
  if (path === '/admin/dashboard') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/admin/login')
}

// Đóng dropdown khi click ra ngoài
const closeUserMenu = (e) => {
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// Lắng nghe sự kiện click trên toàn document để đóng menu
document.addEventListener('click', closeUserMenu)
</script> 