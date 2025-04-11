<template>
  <aside 
    class="fixed inset-y-0 left-0 z-30 transition-all duration-300 transform"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      'w-64 lg:w-72'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Sidebar Header with Aurora Gradient -->
      <div class="aurora-bg h-40 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-aurora-blue via-aurora-purple to-aurora-pink opacity-90 dark:opacity-80 animate-aurora"></div>
        <div class="relative h-full flex flex-col justify-between p-6">
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white shadow-lg p-2 flex items-center justify-center">
              <img src="/assets/images/logo-sam.png" alt="Logo" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="text-white text-lg font-semibold">Sam Ngọc Linh</h3>
              <p class="text-white text-opacity-80 text-xs">Admin Panel</p>
            </div>
          </div>
          
          <!-- User Card -->
          <div class="glassmorphism-card bg-white/20 dark:bg-slate-900/20 rounded-lg p-3 mt-3">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-3 text-sm">
                <p class="text-white font-medium">{{ userName }}</p>
                <p class="text-white text-opacity-70 text-xs truncate max-w-[160px]">{{ userEmail }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto bg-white dark:bg-slate-900 py-6 px-4">
        <nav class="space-y-1.5">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="nav-link flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800"
            :class="[isActive(item.path) ? 'nav-link-active bg-green-50 dark:bg-green-900/20' : '']"
            active-class="nav-link-active"
          >
            <i :class="[item.icon, isActive(item.path) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400']" class="w-5 h-5 mr-3"></i>
            <span :class="[isActive(item.path) ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-700 dark:text-gray-200']">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
      
      <!-- Footer Actions -->
      <div class="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 p-4">
        <div class="space-y-3">
          <button 
            @click="toggleDarkMode"
            class="neumorph-btn w-full flex items-center px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span>{{ isDarkMode ? 'Chế độ sáng' : 'Chế độ tối' }}</span>
          </button>
          
          <button 
            @click="logout" 
            class="neumorph-btn w-full flex items-center px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const isDarkMode = ref(false);

// Menu items
const menuItems = [
  { 
    path: '/admin/dashboard', 
    name: 'Dashboard', 
    icon: 'fas fa-tachometer-alt',
    // Add additional paths that should be considered the same route
    alternativePaths: ['/admin']
  },
  { path: '/admin/products', name: 'Sản phẩm', icon: 'fas fa-box-open' },
  { path: '/admin/categories', name: 'Danh mục', icon: 'fas fa-tags' },
  { path: '/admin/services', name: 'Dịch vụ', icon: 'fas fa-concierge-bell' },
  { path: '/admin/orders', name: 'Đơn hàng', icon: 'fas fa-shopping-cart' },
  { path: '/admin/news', name: 'Tin tức', icon: 'fas fa-newspaper' },
  { path: '/admin/users', name: 'Người dùng', icon: 'fas fa-users' },
  { path: '/admin/sessions', name: 'Phiên đăng nhập', icon: 'fas fa-user-clock' }
];

// Check if route is active
const isActive = (path) => {
  // For dashboard, treat /admin and /admin/dashboard as the same
  if (path === '/admin/dashboard') {
    return route.path === '/admin' || route.path === '/admin/dashboard';
  }
  // For other routes, exact match
  return route.path === path;
};

// Computed properties for user info
const userName = computed(() => {
  const user = auth.user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user?.name || user?.email?.split('@')[0] || 'Admin';
});

const userEmail = computed(() => {
  const user = auth.user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user?.email || 'admin@example.com';
});

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
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

// Initialize dark mode on component mount
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    isDarkMode.value = savedMode === 'true';
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkMode.value = true;
    }
  }
  
  // Set initial state
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  }
});

// Close sidebar on route change in mobile view
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    emit('close');
  }
});
</script>

<style scoped>
.aurora-bg {
  position: relative;
  overflow: hidden;
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--tw-gradient-stops));
  --tw-gradient-from: #7DF9FF;
  --tw-gradient-to: #2CD9C5;
  --tw-gradient-stops: var(--tw-gradient-from), #B6A4FE, var(--tw-gradient-to);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  opacity: 0;
}

.nav-link:hover::after {
  transform: scaleX(0.3);
  opacity: 0.7;
}

.nav-link-active::after {
  transform: scaleX(1);
  opacity: 1;
}

.glassmorphism-card {
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.neumorph-btn {
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
  background: #f0f4f8;
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.neumorph-btn:hover {
  transform: translateY(-1px);
}

.neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
  transform: translateY(0);
}

.dark .neumorph-btn {
  box-shadow: 3px 3px 6px #151A23, -3px -3px 6px #242B38;
  background: #1e293b;
}

.dark .neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #151A23, inset -2px -2px 5px #242B38;
}
</style> 