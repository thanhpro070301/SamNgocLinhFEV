<template>
  <header class="glassmorphism-header sticky top-0 z-50 transition-all duration-300" :class="{'auth-header': isAuthRoute}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo section -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center group">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden mr-3 shadow-glass border border-white/30 transition duration-300 group-hover:shadow-glass-hover">
              <img src="/assets/images/products/sam-tuoi.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500">
            </div>
            <span class="text-xl font-medium text-slate-800 dark:text-white tracking-wide transition duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">Sâm Ngọc Linh</span>
          </router-link>
        </div>
        
        <!-- Centered Navigation -->
        <nav class="hidden lg:flex items-center justify-center">
          <div class="flex items-center space-x-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-1.5 shadow-glass border border-white/20">
            <router-link 
              v-for="item in mainMenu" 
              :key="item.path"
              :to="item.path"
              class="nav-link text-[15px] font-medium transition-all duration-300 relative px-4 py-2 rounded-full"
              :class="[
                isActive(item.path) 
                  ? 'text-green-600 dark:text-green-400 bg-white/50 dark:bg-white/10 shadow-sm' 
                  : 'text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/30 dark:hover:bg-white/5'
              ]"
            >
              {{ item.label }}
            </router-link>
          </div>
        </nav>
        
        <!-- Right actions group -->
        <div class="flex items-center space-x-4">
          <!-- User auth (desktop) -->
          <div class="hidden md:flex items-center">
            <button 
              @click="isAuthenticated ? toggleUserMenu() : router.push('/auth/login')"
              class="user-menu-button flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-all duration-300 shadow-sm"
            >
              <i class="fas" :class="isAuthenticated ? 'fa-user' : 'fa-sign-in-alt'"></i>
            </button>
            
            <!-- User dropdown menu - only show when authenticated and not on auth pages -->
            <div 
              v-if="isUserMenuOpen && isAuthenticated && !isAuthRoute" 
              class="user-menu absolute right-4 mt-16 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl py-2 z-40 border border-purple-200/50 dark:border-purple-800/30 transform origin-top-right transition-all duration-200 animate-dropdown"
            >
              <div class="px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <p class="text-sm font-medium text-slate-800 dark:text-white flex items-center">
                  <span class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400">
                    <i class="fas fa-user-circle"></i>
                  </span>
                  {{ userName }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-10">{{ userEmail }}</p>
              </div>
              <router-link 
                to="/profile"
                class="flex items-center px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <i class="fas fa-user mr-3 text-purple-400 dark:text-purple-500 w-5 text-center"></i>Tài khoản của tôi
              </router-link>
              <router-link 
                to="/orders"
                class="flex items-center px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <i class="fas fa-shopping-bag mr-3 text-purple-400 dark:text-purple-500 w-5 text-center"></i>Đơn hàng của tôi
              </router-link>
              <div class="border-t border-slate-200/50 dark:border-slate-700/50 my-1"></div>
              <button
                @click="logout"
                class="w-full flex items-center px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left"
              >
                <i class="fas fa-sign-out-alt mr-3 text-red-400 dark:text-red-500 w-5 text-center"></i>Đăng xuất
              </button>
            </div>
            
            <!-- Login/register dropdown menu -->
            <div 
              v-if="isUserMenuOpen && !isAuthenticated && !isAuthRoute" 
              class="user-menu absolute right-4 mt-16 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl py-2 z-40 border border-purple-200/50 dark:border-purple-800/30 transform origin-top-right transition-all duration-200 animate-dropdown"
            >
              <div class="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                <p class="text-sm font-medium text-slate-800 dark:text-white">Tài khoản</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Đăng nhập để truy cập tài khoản</p>
              </div>
              <router-link 
                to="/auth/login"
                class="flex items-center px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <i class="fas fa-sign-in-alt mr-3 text-purple-400 dark:text-purple-500 w-5 text-center"></i>Đăng nhập
              </router-link>
              <router-link 
                to="/auth/register"
                class="flex items-center px-5 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <i class="fas fa-user-plus mr-3 text-purple-400 dark:text-purple-500 w-5 text-center"></i>Đăng ký
              </router-link>
            </div>
          </div>
          
          <!-- Action icons -->
          <div class="flex items-center space-x-2">
            <!-- Cart -->
            <router-link to="/cart" class="glass-icon-btn relative" :class="{ 'animate-cart-bounce': showCartAnimation }">
              <i class="fas fa-shopping-cart"></i>
              <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm"
                    :class="{ 'animate-pulse': showCartAnimation }">
                {{ cartItemCount > 9 ? '9+' : cartItemCount }}
              </span>
            </router-link>
            
            <!-- Search -->
            <button @click="toggleSearch" class="glass-icon-btn">
              <i class="fas fa-search"></i>
            </button>
            
            <!-- Mobile menu -->
            <button @click="toggleMobileMenu" class="glass-icon-btn lg:hidden">
              <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search dropdown -->
    <div v-if="isSearchOpen" class="search-dropdown py-5 backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-t border-white/20 dark:border-slate-700/20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form @submit.prevent="submitSearch" class="flex">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            class="flex-grow px-5 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 focus:ring-green-500 focus:border-green-500 rounded-l-xl text-slate-800 dark:text-white placeholder-slate-400"
          >
          <button 
            type="submit" 
            class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-r-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <i class="fas fa-search"></i>
          </button>
        </form>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu lg:hidden backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-t border-white/20 dark:border-slate-700/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="space-y-2">
          <router-link 
            v-for="item in mainMenu" 
            :key="item.path"
            :to="item.path"
            class="block py-3 px-4 text-[15px] font-medium rounded-lg transition-all duration-300"
            :class="[
              isActive(item.path) 
                ? 'bg-green-50/70 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400'
            ]"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </router-link>
          
          <!-- Authentication links in mobile menu -->
          <div class="border-t border-slate-200/50 dark:border-slate-700/50 mt-3 pt-3">
            <div class="flex items-center px-4 py-2">
              <button 
                @click="isAuthenticated ? (router.push('/profile'), closeMobileMenu()) : (router.push('/auth/login'), closeMobileMenu())"
                class="flex items-center w-full text-[15px] font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg py-2"
              >
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-3">
                  <i class="fas fa-user text-sm"></i>
                </div>
                {{ isAuthenticated ? 'Tài khoản của tôi' : 'Đăng nhập / Đăng ký' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import cart from '@/store/cart'
import eventBus from '@/utils/eventBus'
import { useAuthStore } from '@/store/auth'
import { useNotificationService } from '@/composables/useNotificationService'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const notificationService = useNotificationService()

// State
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const searchQuery = ref('')
const cartItemCount = computed(() => cart.cartItemCount.value)
const showCartAnimation = ref(false)
const isScrolled = ref(false)

// Check if current route is an auth route
const isAuthRoute = computed(() => {
  return route.path.startsWith('/auth')
})

// Authentication
const isAuthenticated = computed(() => auth.isAuthenticated)
const user = computed(() => auth.user)
const userName = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
})
const userEmail = computed(() => user.value?.email || '')
const userInitials = computed(() => {
  if (!user.value) return ''
  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

// Menu chính
const mainMenu = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/products' },
  { label: 'Dịch vụ', path: '/services' },
  { label: 'Tin tức', path: '/news' },
  { label: 'Tra cứu đơn hàng', path: '/order-tracking' },
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
    isUserMenuOpen.value = false
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
    isUserMenuOpen.value = false
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

// Lắng nghe sự kiện khi sản phẩm được thêm vào giỏ hàng
function onProductAddedToCart() {
  showCartAnimation.value = true
  
  // Tắt animation sau 1.5 giây
  setTimeout(() => {
    showCartAnimation.value = false
  }, 1500)
}

// Toggle user menu
function toggleUserMenu() {
  // Don't show menu on auth pages
  if (isAuthRoute.value) {
    isUserMenuOpen.value = false;
    return;
  }
  
  // Toggle menu for other pages
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isSearchOpen.value = false;
    isMobileMenuOpen.value = false;
  }
}

// Listen for auth events
function setupAuthEventListeners() {
  // Listen for logout events
  document.addEventListener('auth:logout', () => {
    console.log('Auth:logout event received, closing user menu');
    isUserMenuOpen.value = false;
  });
  
  // Listen for auth data cleared events
  document.addEventListener('auth:dataCleared', () => {
    console.log('Auth data cleared event received, updating UI');
    isUserMenuOpen.value = false;
  });
  
  // Listen for storage events
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_event' && event.newValue === 'logging_out') {
      console.log('Logout storage event detected, closing user menu');
      isUserMenuOpen.value = false;
    }
    
    if (['authToken', 'isAuthenticated'].includes(event.key) && !event.newValue) {
      console.log('Auth token or state removed, closing user menu');
      isUserMenuOpen.value = false;
    }
  });
}

// Improved logout function to ensure the menu is closed
async function logout() {
  try {
    isUserMenuOpen.value = false; // Close the menu immediately
    closeMobileMenu(); // Close mobile menu if open
    
    console.log('Initiating logout...');
    await auth.logout();
    
    notificationService.show('Đã đăng xuất thành công', {
      title: 'Đăng xuất',
      type: 'success'
    });
    
    // Redirect to home
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
    notificationService.showError('Đã xảy ra lỗi khi đăng xuất');
  }
}

// Handle scroll events
function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

// Close user menu when clicking outside
function handleClickOutside(event) {
  const target = event.target
  const userMenuButton = document.querySelector('.user-menu-button')
  const userMenu = document.querySelector('.user-menu')
  
  if (isUserMenuOpen.value && userMenu && !userMenu.contains(target) && userMenuButton && !userMenuButton.contains(target)) {
    isUserMenuOpen.value = false
  }
}

// Watch authentication state - close menu when logged out
watch(isAuthenticated, (newValue) => {
  if (!newValue) {
    isUserMenuOpen.value = false;
  }
});

// Add this watch to forcefully close the menu on route changes to auth pages
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/auth')) {
      isUserMenuOpen.value = false;
    }
  }
);

// Add event listeners on mount
onMounted(() => {
  eventBus.on('product-added-to-cart', onProductAddedToCart);
  
  // Add event listener for closing user menu when clicking outside
  document.addEventListener('click', handleClickOutside);
  
  // Add event listener for custom logout event
  document.addEventListener('auth:logout', () => {
    isUserMenuOpen.value = false;
  });
  
  // Setup auth event listeners
  setupAuthEventListeners();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  // Check initial scroll position
  handleScroll();
});

onUnmounted(() => {
  eventBus.off('product-added-to-cart', onProductAddedToCart);
  
  // Remove event listeners
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('auth:logout', () => {
    isUserMenuOpen.value = false;
  });
  document.removeEventListener('auth:dataCleared', () => {
    isUserMenuOpen.value = false;
  });
  window.removeEventListener('storage', () => {});
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.glassmorphism-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.auth-header {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

:deep(.dark) .glassmorphism-header {
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(30, 41, 59, 0.3);
}

:deep(.dark) .auth-header {
  background: rgba(15, 23, 42, 0.9);
}

.shadow-glass {
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 2px 3px rgba(255, 255, 255, 0.3);
}

.shadow-glass-hover {
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.12),
    inset 0 2px 5px rgba(255, 255, 255, 0.4);
}

.glass-icon-btn {
  @apply flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 transition-all duration-300 backdrop-blur-sm shadow-glass border border-white/20 dark:border-slate-700/30;
}

.glass-icon-btn:hover {
  @apply bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-glass-hover transform -translate-y-0.5;
}

.search-dropdown {
  animation: slide-down 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

.mobile-menu {
  animation: slide-down 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cart-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-4px) rotate(-10deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-2px) rotate(5deg);
  }
}

.animate-cart-bounce {
  animation: cart-bounce 0.8s ease;
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-dropdown {
  animation: fadeIn 0.2s ease-out forwards;
}

.user-menu {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.user-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 12px;
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  transform: rotate(45deg);
  border-left: 1px solid rgba(139, 92, 246, 0.1);
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.dark .user-menu::before {
  background-color: rgba(30, 41, 59, 0.9);
  border-left: 1px solid rgba(139, 92, 246, 0.2);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}
</style> 