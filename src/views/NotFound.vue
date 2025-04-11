<template>
  <div class="not-found-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-32">
        <div class="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <!-- 404 Number -->
          <div 
            class="text-8xl md:text-9xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text mb-6"
            data-aos="zoom-in"
          >
            404
          </div>
          
          <!-- Error Message -->
          <h1 
            class="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Trang không tồn tại
          </h1>
          
          <p 
            class="text-lg text-gray-600 mb-10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Rất tiếc, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm. Trang này có thể đã bị xóa hoặc đường dẫn không chính xác.
          </p>
          
          <!-- Clay card with suggestions -->
          <div 
            class="bg-white/70 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-8 mb-10 w-full"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h2 class="text-xl font-bold text-gray-800 mb-4">
              Bạn có thể thử những trang sau:
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div 
                v-for="(link, index) in recommendedLinks" 
                :key="index"
                class="transform transition-all duration-300 hover:-translate-y-1"
              >
                <button 
                  @click="navigateTo(link.path)"
                  class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-white/60 to-white/40 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex items-center"
                >
                  <i :class="`fas ${link.icon} text-green-500 mr-3 text-xl`"></i>
                  <span class="text-gray-800 font-medium">{{ link.name }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Home Button -->
          <NeuButton 
            @click="navigateTo('/')" 
            variant="primary"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <template #icon-left>
              <i class="fas fa-home"></i>
            </template>
            Quay lại trang chủ
          </NeuButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// Recommended links
const recommendedLinks = ref([
  { name: 'Trang chủ', path: '/', icon: 'fa-home' },
  { name: 'Sản phẩm', path: '/products', icon: 'fa-leaf' },
  { name: 'Tin tức', path: '/news', icon: 'fa-newspaper' },
  { name: 'Liên hệ', path: '/contact', icon: 'fa-envelope' }
]);

onMounted(() => {
  // Check if this is a login redirect gone wrong
  const referer = document.referrer;
  const isFromLogin = referer.includes('/login') || referer.includes('/auth/login');
  
  // If user is authenticated and coming from login, redirect to appropriate dashboard
  if (auth.isAuthenticated && isFromLogin) {
    console.log('User authenticated but received 404 after login, redirecting to appropriate page');
    
    if (auth.isAdmin) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/profile');
    }
  }
});

function goHome() {
  router.push('/');
}

function goBack() {
  router.back();
}

// Navigate to a specific path
const navigateTo = (path) => {
  router.push(path);
};

// Initialize AOS on mount
if (typeof window !== 'undefined' && window.AOS) {
  window.AOS.refresh();
}
</script>

<style scoped>
.not-found-page {
  overflow-x: hidden;
}
</style> 