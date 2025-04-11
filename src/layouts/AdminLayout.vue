<template>
  <div class="admin-layout min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Admin Layout -->
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
      
      <!-- Main Content -->
      <div class="w-full lg:pl-72">
        <!-- Topbar -->
        <Topbar 
          :notification-count="notificationCount" 
          @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        >
          <template #api-status>
            <ApiStatus />
          </template>
        </Topbar>
        
        <!-- Page Content -->
        <main class="p-4 sm:p-6 lg:p-8">
          <!-- Aurora Gradient Background Accent -->
          <div class="fixed top-0 right-0 -z-10 transform translate-x-1/3 -translate-y-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-aurora-blue via-aurora-purple to-aurora-pink opacity-10 dark:opacity-5 blur-3xl animate-aurora"></div>
          
          <!-- Router View -->
          <router-view></router-view>
        </main>
      </div>
    </div>
    
    <!-- Overlay for sidebar on mobile -->
    <div v-if="isSidebarOpen" 
       @click="isSidebarOpen = false"
       class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden">
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Import components
import Sidebar from '@/components/admin/Sidebar.vue';
import Topbar from '@/components/admin/Topbar.vue';
import ApiStatus from '@/components/ApiStatus.vue';

// State
const isSidebarOpen = ref(false);
const notificationCount = ref(3); // This could be dynamic based on API data
const route = useRoute();
const auth = useAuthStore();

// Check if user is in admin area
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin');
});

// Close sidebar on route change
onMounted(() => {
  // Listen for route changes to close the sidebar on mobile
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
  
  // Ensure consistency between /admin and /admin/dashboard
  if (route.path === '/admin' && route.name === 'Admin') {
    console.log('On admin root path, rendering dashboard');
  }
});
</script>

<style scoped>
/* Custom animations and styling */
</style> 