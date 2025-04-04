<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo và tên hệ thống -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-full overflow-hidden mr-2">
              <img src="/assets/images/products/sam-tuoi.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
            <span class="text-xl font-semibold text-gray-900">Sâm Ngọc Linh</span>
          </router-link>
        </div>
        
        <!-- Menu chính -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link 
            v-for="item in mainMenu" 
            :key="item.path"
            :to="item.path"
            class="text-sm font-medium transition-colors"
            :class="[
              isActive(item.path) 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            {{ item.label }}
          </router-link>
        </nav>
        
        <!-- Giỏ hàng và tác vụ khác -->
        <div class="flex items-center space-x-4">
          <!-- Giỏ hàng -->
          <router-link to="/cart" class="p-2 text-gray-500 hover:text-gray-900 relative">
            <i class="fas fa-shopping-cart"></i>
            <span v-if="cartItemCount > 0" class="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>
          
          <!-- Tìm kiếm -->
          <button @click="toggleSearch" class="p-2 text-gray-500 hover:text-gray-900">
            <i class="fas fa-search"></i>
          </button>
          
          <!-- Menu mobile -->
          <button @click="toggleMobileMenu" class="p-2 text-gray-500 hover:text-gray-900 md:hidden">
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Thanh tìm kiếm -->
    <div v-if="isSearchOpen" class="border-t border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form @submit.prevent="submitSearch" class="flex">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            class="flex-grow px-4 py-2 border border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-l-md"
          >
          <button 
            type="submit" 
            class="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <i class="fas fa-search"></i>
          </button>
        </form>
      </div>
    </div>
    
    <!-- Menu mobile -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="space-y-1">
          <router-link 
            v-for="item in mainMenu" 
            :key="item.path"
            :to="item.path"
            class="block py-2 text-base font-medium transition-colors"
            :class="[
              isActive(item.path) 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-900'
            ]"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// State
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const cartItemCount = ref(0) // Giả lập số lượng sản phẩm trong giỏ hàng

// Menu chính
const mainMenu = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/products' },
  { label: 'Dịch vụ', path: '/services' },
  { label: 'Tin tức', path: '/news' },
  { label: 'Giới thiệu', path: '/about' },
  { label: 'Liên hệ', path: '/contact' }
]

// Kiểm tra route hiện tại
function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Mở/đóng menu mobile
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isSearchOpen.value = false
  }
}

// Đóng menu mobile
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// Mở/đóng thanh tìm kiếm
function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    isMobileMenuOpen.value = false
    // Focus vào input tìm kiếm
    setTimeout(() => {
      document.querySelector('input[type="text"]')?.focus()
    }, 100)
  }
}

// Xử lý tìm kiếm
function submitSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/products',
      query: { search: searchQuery.value }
    })
    isSearchOpen.value = false
  }
}
</script> 