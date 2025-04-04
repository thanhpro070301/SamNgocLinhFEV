<template>
  <header class="bg-white shadow">
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
        
        <!-- User dropdown -->
        <div class="ml-6 flex items-center">
          <div class="relative">
            <div>
              <button 
                @click="toggleUserMenu" 
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-700 font-semibold text-sm">
                    {{ userInitials }}
                  </span>
                </div>
              </button>
            </div>
            
            <!-- Dropdown menu -->
            <div 
              v-if="isUserMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div>{{ userName }}</div>
                <div class="text-xs text-gray-500">{{ userEmail }}</div>
              </div>
              <router-link
                to="/admin/sessions"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-shield-alt mr-2"></i>
                Phiên đăng nhập
              </router-link>
              <a 
                href="#" 
                @click.prevent="logout"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
              </a>
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import auth from '@/store/auth'

const router = useRouter()
const route = useRoute()

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Menu items
const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Sản phẩm', path: '/admin/products', icon: 'fas fa-box' },
  { label: 'Danh mục', path: '/admin/categories', icon: 'fas fa-tags' },
  { label: 'Đơn hàng', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
  { label: 'Tin tức', path: '/admin/news', icon: 'fas fa-newspaper' },
  { label: 'Người dùng', path: '/admin/users', icon: 'fas fa-users' }
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
}

// Check if route is active
function isActive(path) {
  return route.path.startsWith(path)
}

// Logout function
async function logout() {
  try {
    await auth.logout()
    router.push('/admin/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

// Close user menu when clicking outside
window.addEventListener('click', (event) => {
  if (isUserMenuOpen.value && !event.target.closest('.relative')) {
    isUserMenuOpen.value = false
  }
})
</script> 