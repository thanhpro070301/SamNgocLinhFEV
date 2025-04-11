<template>
  <section class="hero-section relative overflow-hidden">
    <!-- Background effects - integrated with AuroraBackground -->
    <div class="absolute inset-0 z-0">
      <div class="hero-particles"></div>
    </div>
    
    <div class="container mx-auto px-4 py-16 md:py-28 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <!-- Hero Content -->
        <div 
          class="hero-content"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="1000"
        >
          <h1 class="text-4xl md:text-5xl xl:text-6xl font-bold mb-6">
            <span class="block text-gray-800 dark:text-white">Sâm Ngọc Linh</span>
            <span class="text-gradient bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Tinh hoa đất Việt
            </span>
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
            Kết tinh từ tinh túy thiên nhiên Tây Nguyên, mang đến sức khỏe và sự cân bằng cho cuộc sống hiện đại.
          </p>
          
          <div class="flex flex-wrap gap-5">
            <NeuButton 
              variant="primary" 
              size="lg"
              @click="navigateTo('/products')"
            >
              <template #icon-left>
                <i class="fas fa-leaf"></i>
              </template>
              Khám phá sản phẩm
            </NeuButton>
            
            <NeuButton 
              variant="secondary" 
              size="lg"
              @click="navigateTo('/about')"
            >
              <template #icon-left>
                <i class="fas fa-info-circle"></i>
              </template>
              Tìm hiểu thêm
            </NeuButton>
          </div>
          
          <!-- Trust badges -->
          <div class="trust-badges flex flex-wrap gap-4 mt-12">
            <div class="badge flex items-center gap-2 py-1 px-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <i class="fas fa-check-circle text-green-500"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Chứng nhận chất lượng</span>
            </div>
            <div class="badge flex items-center gap-2 py-1 px-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <i class="fas fa-truck text-green-500"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Giao hàng toàn quốc</span>
            </div>
            <div class="badge flex items-center gap-2 py-1 px-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <i class="fas fa-medal text-green-500"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">100% tự nhiên</span>
            </div>
          </div>
        </div>
        
        <!-- Hero Image -->
        <div 
          class="hero-image relative"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="1000"
        >
          <div class="clay-morph-container">
            <!-- Large glow background -->
            <div class="absolute inset-0 bg-gradient-radial from-green-200/50 to-transparent -z-10 blur-2xl"></div>
            
            <!-- 3D Hover Effect Container -->
            <div ref="tiltRef" class="tilt-container relative z-10">
              <!-- Clay-like morphism effect for main image -->
              <div class="clay-card relative bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-900/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-700/30">
                <div class="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    :src="samImageUrl" 
                    alt="Sâm Ngọc Linh" 
                    class="object-contain w-full h-full"
                  >
                  
                  <!-- Floating elements for parallax effect -->
                  <div class="absolute top-6 left-6 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full blur-xl opacity-60 floating-element"></div>
                  <div class="absolute bottom-10 right-10 w-16 h-16 bg-green-200 dark:bg-green-800/30 rounded-full blur-xl opacity-60 floating-element delay-2"></div>
                </div>
                
                <!-- Product name with glassmorphism -->
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md py-3 px-6 rounded-full border border-white/50 dark:border-slate-700/50">
                  <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">
                    Sâm Ngọc Linh Tự Nhiên
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NeuButton from './NeuButton.vue';

// Use the correct path to the sam image
const samImageUrl = ref('/assets/images/logo-sam.png');
const tiltRef = ref(null);
const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  // Simple Vanilla Tilt effect
  if (tiltRef.value && typeof window !== 'undefined') {
    // Check if VanillaTilt is available
    if (window.VanillaTilt) {
      window.VanillaTilt.init(tiltRef.value, {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        gyroscope: true
      });
    } else {
      // Create basic hover effect if VanillaTilt is not available
      const el = tiltRef.value;
      
      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);
        
        const tiltAmount = 5; // Max tilt in degrees
        el.style.transform = `perspective(1000px) rotateX(${-percentY * tiltAmount}deg) rotateY(${percentX * tiltAmount}deg) scale3d(1.02, 1.02, 1.02)`;
      };
      
      const handleMouseLeave = () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      };
      
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }
  }
});
</script>

<style scoped>
.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Clay-morphism styles */
.clay-morph-container {
  position: relative;
  padding: 1.5rem;
}

.clay-card {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.tilt-container {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

/* Floating elements animation */
.floating-element {
  animation: float 6s ease-in-out infinite;
}

.floating-element.delay-2 {
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Particles background */
.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 35%, rgba(134, 239, 172, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 75% 65%, rgba(187, 247, 208, 0.1) 0%, transparent 40%);
}

/* Responsive styles for mobile */
@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .clay-morph-container {
    padding: 0.75rem;
    margin-top: 2rem;
  }
}
</style> 