<template>
  <header class="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">
      <!-- Left: Menu Toggle & Search -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button -->
        <button 
          @click="$emit('toggle-sidebar')" 
          class="lg:hidden neumorph-btn-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Search bar -->
        <div class="relative hidden md:block">
          <input 
            type="text" 
            class="search-input w-72 pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 text-gray-700 dark:text-gray-200 transition-all duration-200"
            placeholder="Tìm kiếm..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Current Page Title - Mobile Only -->
        <h1 class="md:hidden text-lg font-semibold text-gray-800 dark:text-white">{{ pageTitle }}</h1>
      </div>
      
      <!-- Center: Page Title - Desktop Only -->
      <h1 class="hidden md:block text-xl font-semibold text-gray-800 dark:text-white">{{ pageTitle }}</h1>
      
      <!-- Right: Actions -->
      <div class="flex items-center space-x-3">
        <!-- Mobile search button -->
        <button 
          @click="toggleMobileSearch" 
          class="md:hidden neumorph-btn-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
          aria-label="Search"
        >
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <!-- API Status -->
        <slot name="api-status"></slot>
        
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />
        
        <!-- Notifications -->
        <button class="neumorph-btn-sm relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="notificationCount > 0" class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white font-medium">
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>
        
        <!-- User Menu -->
        <div class="relative">
          <button 
            @click="toggleUserMenu" 
            class="neumorph-btn-sm flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
            ref="userMenuButton"
          >
            <div class="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <span class="text-xs font-semibold">{{ userInitials }}</span>
            </div>
          </button>
          
          <!-- Dropdown menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="isUserMenuOpen" 
                 class="glassmorphism-dropdown absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-40 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                 ref="userMenuDropdown"
            >
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
              </div>
              
              <div class="py-1">
                <router-link to="/admin/profile" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                           @click="isUserMenuOpen = false">
                  <svg class="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tài khoản
                </router-link>
                
                <router-link to="/admin/settings" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                           @click="isUserMenuOpen = false">
                  <svg class="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt
                </router-link>
              </div>
              
              <div class="py-1 border-t border-gray-100 dark:border-gray-700">
                <button @click="logout" 
                        class="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700/50">
                  <svg class="mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    
    <!-- Mobile Search overlay -->
    <div v-if="isMobileSearchOpen" class="md:hidden p-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
      <div class="relative">
        <input 
          type="text" 
          class="search-input w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 text-gray-700 dark:text-gray-200"
          placeholder="Tìm kiếm..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          ref="mobileSearchInput"
        >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          @click="isMobileSearchOpen = false" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import DarkModeToggle from '@/components/DarkModeToggle.vue';

const emit = defineEmits(['toggle-sidebar']);
const props = defineProps({
  notificationCount: {
    type: Number,
    default: 0
  }
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isUserMenuOpen = ref(false);
const isMobileSearchOpen = ref(false);
const searchQuery = ref('');
const userMenuButton = ref(null);
const userMenuDropdown = ref(null);
const mobileSearchInput = ref(null);

// Get page title based on current route
const pageTitle = computed(() => {
  switch (route.path) {
    case '/admin/dashboard': return 'Dashboard';
    case '/admin/products': return 'Quản lý sản phẩm';
    case '/admin/categories': return 'Danh mục sản phẩm';
    case '/admin/services': return 'Dịch vụ';
    case '/admin/orders': return 'Đơn hàng';
    case '/admin/news': return 'Tin tức';
    case '/admin/users': return 'Người dùng';
    default: return 'Admin Panel';
  }
});

// User info computed properties
const userName = computed(() => {
  const user = auth.user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user?.name || user?.email?.split('@')[0] || 'Admin';
});

const userEmail = computed(() => {
  const user = auth.user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user?.email || 'admin@example.com';
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return 'A';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

// Toggle user menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Toggle mobile search
const toggleMobileSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value;
  
  if (isMobileSearchOpen.value) {
    // Focus the search input after the search bar is shown
    nextTick(() => {
      if (mobileSearchInput.value) {
        mobileSearchInput.value.focus();
      }
    });
  }
};

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search functionality based on your requirements
    console.log('Searching for:', searchQuery.value);
    
    // Close mobile search after search
    isMobileSearchOpen.value = false;
    
    // Example: Navigate to search results
    // router.push({ path: '/admin/search', query: { q: searchQuery.value } });
  }
};

// Close user menu when clicking outside
const closeUserMenuOnClickOutside = (event) => {
  if (isUserMenuOpen.value && 
      userMenuDropdown.value && 
      userMenuButton.value && 
      !userMenuDropdown.value.contains(event.target) && 
      !userMenuButton.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

// Logout
const logout = async () => {
  try {
    await auth.logout();
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Add event listener for outside clicks
onMounted(() => {
  document.addEventListener('click', closeUserMenuOnClickOutside);
});

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', closeUserMenuOnClickOutside);
});
</script>

<style scoped>
.neumorph-btn-sm {
  box-shadow: 2px 2px 5px #d1d9e6, -2px -2px 5px #ffffff;
  background: #f0f4f8;
  border: none;
  transition: all 0.2s ease;
}

.neumorph-btn-sm:active {
  box-shadow: inset 1px 1px 3px #d1d9e6, inset -1px -1px 3px #ffffff;
  transform: scale(0.98);
}

.dark .neumorph-btn-sm {
  box-shadow: 2px 2px 5px #151A23, -2px -2px 5px #242B38;
  background: #1e293b;
}

.dark .neumorph-btn-sm:active {
  box-shadow: inset 1px 1px 3px #151A23, inset -1px -1px 3px #242B38;
}

.search-input {
  transition: all 0.3s ease;
}

.search-input:focus {
  width: 100%;
  max-width: 320px;
}

.glassmorphism-dropdown {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dark .glassmorphism-dropdown {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(30, 41, 59, 0.2);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style> 