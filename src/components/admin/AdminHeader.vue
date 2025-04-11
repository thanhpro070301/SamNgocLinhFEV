<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16">
        <!-- Desktop Navigation - Full Width Including Logo Area -->
        <nav class="hidden md:flex md:items-center md:flex-1 md:justify-between">
          <!-- Logo as first item but smaller -->
          <router-link to="/admin/dashboard" 
            class="flex-shrink-0 flex items-center px-2 transition-opacity duration-150 hover:opacity-85 mr-2"
          >
            <div class="w-8 h-8 bg-green-100 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
              <img src="/assets/images/products/sam-tuoi.png" alt="Logo" class="w-full h-full object-cover">
            </div>
          </router-link>
          
          <!-- Menu Items -->
          <div class="flex-1 flex justify-between">
            <router-link
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path" 
              custom
              v-slot="{ href, navigate, isActive: isRouteActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out justify-center flex-1 mx-1"
                :class="[
                  isRouteActive 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <i :class="['mr-2 w-5 text-center', item.icon]"></i>
                <span>{{ item.label }}</span>
              </a>
            </router-link>
          </div>
          
          <!-- Right side: API Status and User Dropdown -->
          <div class="flex items-center ml-4 flex-shrink-0">
            <!-- API Status -->
            <div class="hidden lg:flex items-center mr-4">
               <ApiStatus v-if="hasApiStatusComponent" />
               <span v-else class="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">API: Offline</span>
            </div>
            
            <!-- User dropdown -->
            <div class="relative user-dropdown">
              <div>
                <button 
                  @click="toggleUserMenu"
                  class="flex items-center text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 hover:opacity-90 transition-all duration-150"
                  aria-expanded="false" 
                  aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-1 ring-gray-300 shadow-sm">
                    <i class="fas fa-user text-green-700"></i>
                  </div>
                  <span class="ml-2 hidden lg:inline text-sm font-medium text-gray-700">{{ userName }}</span>
                  <i :class="[isUserMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down', 'fas ml-1 text-xs text-gray-400 hidden lg:inline transition-transform duration-200']"></i>
                </button>
              </div>
              
              <!-- Dropdown menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="isUserMenuOpen" 
                  class="absolute right-0 z-30 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-gray-100"
                  role="menu" 
                  aria-orientation="vertical" 
                  aria-labelledby="user-menu-button" 
                  tabindex="-1"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900" role="none">{{ userName }}</p>
                    <p class="text-xs text-gray-500 truncate" role="none">{{ userEmail }}</p>
                  </div>
                  <div class="py-1" role="none">
                    <router-link 
                      to="/admin/profile" 
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out" 
                      role="menuitem" 
                      tabindex="-1"
                      @click="isUserMenuOpen = false"
                    >
                      <i class="fas fa-user-circle mr-3 w-5 text-center text-gray-400"></i> Tài khoản
                    </router-link>
                     <router-link 
                      to="/admin/settings" 
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out" 
                      role="menuitem" 
                      tabindex="-1"
                      @click="isUserMenuOpen = false"
                    >
                      <i class="fas fa-cog mr-3 w-5 text-center text-gray-400"></i> Cài đặt
                    </router-link>
                    <router-link 
                      to="/admin/sessions" 
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out" 
                      role="menuitem" 
                      tabindex="-1"
                      @click="isUserMenuOpen = false"
                    >
                      <i class="fas fa-key mr-3 w-5 text-center text-gray-400"></i> Phiên đăng nhập
                    </router-link>
                  </div>
                  <div class="py-1 border-t border-gray-100" role="none">
                    <button 
                      @click="logout" 
                      class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 ease-in-out"
                      role="menuitem" 
                      tabindex="-1"
                    >
                      <i class="fas fa-sign-out-alt mr-3 w-5 text-center"></i> Đăng xuất
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </nav>

        <!-- Mobile view -->
        <div class="flex md:hidden items-center justify-between w-full">
          <!-- Mobile logo -->
          <router-link to="/admin/dashboard" class="flex items-center">
            <div class="w-8 h-8 bg-green-100 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
              <img src="/assets/images/products/sam-tuoi.png" alt="Logo" class="w-full h-full object-cover">
            </div>
            <span class="ml-2 text-base font-medium text-gray-900">Admin</span>
          </router-link>
          
          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu"
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="sr-only">Mở menu chính</span>
            <i v-if="!isMobileMenuOpen" class="fas fa-bars block h-6 w-6"></i>
            <i v-else class="fas fa-times block h-6 w-6"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state -->
    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 bg-gray-50" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path" 
            custom
            v-slot="{ href, navigate, isActive: isRouteActive }"
          >
            <a
              :href="href"
              @click="() => { navigate(); isMobileMenuOpen = false; }"
              class="flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
              :class="[
                isRouteActive 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900'
              ]"
            >
              <i :class="['mr-3 h-6 w-6 flex-shrink-0', item.icon]"></i>
              {{ item.label }}
            </a>
          </router-link>
        </div>
        <!-- Mobile User Options -->
        <div class="pt-4 pb-3 border-t border-gray-200 bg-white">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-1 ring-gray-300 shadow-sm">
                <i class="fas fa-user text-green-700"></i>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userName }}</div>
              <div class="text-sm font-medium text-gray-500 truncate max-w-[200px]">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link to="/admin/profile" @click="isMobileMenuOpen = false" class="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              <i class="fas fa-user-circle mr-3 w-5 text-center text-gray-400"></i>Tài khoản
            </router-link>
            <router-link to="/admin/settings" @click="isMobileMenuOpen = false" class="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              <i class="fas fa-cog mr-3 w-5 text-center text-gray-400"></i>Cài đặt
            </router-link>
             <router-link to="/admin/sessions" @click="isMobileMenuOpen = false" class="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              <i class="fas fa-key mr-3 w-5 text-center text-gray-400"></i>Phiên đăng nhập
            </router-link>
            <button @click="logout" class="flex items-center w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150">
              <i class="fas fa-sign-out-alt mr-3 w-5 text-center"></i>Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'
import notificationService from '@/utils/notificationService'

// Dynamically import ApiStatus to handle potential non-existence gracefully
const ApiStatus = defineAsyncComponent(() => 
  import('@/components/ApiStatus.vue').catch(err => {
    console.warn('ApiStatus component failed to load:', err);
    return { render: () => null }; 
  })
);

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const hasApiStatusComponent = ref(true); 

// Menu items using Font Awesome icons
const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Sản phẩm', path: '/admin/products', icon: 'fas fa-box-open' },
  { label: 'Danh mục', path: '/admin/categories', icon: 'fas fa-tags' },
  { label: 'Dịch vụ', path: '/admin/services', icon: 'fas fa-concierge-bell' },
  { label: 'Đơn hàng', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
  { label: 'Tin tức', path: '/admin/news', icon: 'fas fa-newspaper' },
  { label: 'Người dùng', path: '/admin/users', icon: 'fas fa-users' },
]

// Computed properties for user info
const userName = computed(() => {
  const user = auth.user
  return user?.name || user?.email?.split('@')[0] || 'Admin'
})
const userEmail = computed(() => {
  const user = auth.user
  return user?.email || 'admin@example.com'
})

// Toggle functions
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) isUserMenuOpen.value = false
}
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) isMobileMenuOpen.value = false
}

// Click outside handler
function closeDropdownOnOutsideClick(event) {
  const userDropdown = document.querySelector('.user-dropdown')
  if (isUserMenuOpen.value && userDropdown && !userDropdown.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

// Logout function
async function logout() {
  try {
    isUserMenuOpen.value = false
    isMobileMenuOpen.value = false
    await auth.logout()
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error)
    notificationService.showError('Đã xảy ra lỗi khi đăng xuất')
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick)
  document.addEventListener('keydown', handleKeyPress)
  
  // Check if ApiStatus component actually loaded
  if (!ApiStatus) {
    hasApiStatusComponent.value = false;
  }
})

function handleKeyPress(e) {
  if (e.key === 'Escape') {
    isUserMenuOpen.value = false
    isMobileMenuOpen.value = false
  }
}

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick)
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
/* Improved transitions */
.user-dropdown button:focus {
  box-shadow: none;
}

/* Subtle hover effect for menu items */
nav a:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Đảm bảo tất cả menu items có kích thước đồng nhất */
nav a {
  text-align: center;
  display: flex;
  align-items: center;
  min-width: 0; /* Allow items to shrink when needed */
}
</style> 