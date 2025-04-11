<template>
  <div class="about-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Page Header -->
      <section class="page-header py-20 relative">
        <div class="container mx-auto px-4">
          <div class="text-center" data-aos="fade-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="block text-gray-800">Về Chúng Tôi</span>
              <span class="text-gradient bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                Câu Chuyện Sâm Ngọc Linh
              </span>
            </h1>
            <p class="text-gray-600 max-w-3xl mx-auto text-lg mb-8">
              Hành trình của chúng tôi trong việc bảo tồn và phát triển cây sâm quý hiếm của Việt Nam
            </p>
          </div>
        </div>
      </section>
      
      <!-- Company Story Section -->
      <section class="story-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="glass-container p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <!-- Content -->
              <div class="story-content" data-aos="fade-right">
                <h2 class="text-3xl font-bold mb-6 text-gray-800">Khởi Nguồn</h2>
                <div class="space-y-4 text-gray-600">
                  <p>
                    Sâm Ngọc Linh - "Quốc bảo" của Việt Nam, được phát hiện năm 1973 ở vùng núi Ngọc Linh thuộc Kon Tum và Quảng Nam. Với giá trị dược liệu quý báu, Sâm Ngọc Linh được công nhận là loài sâm quý hiếm bậc nhất.
                  </p>
                  <p>
                    Công ty chúng tôi được thành lập với sứ mệnh bảo tồn và phát triển nguồn gen quý hiếm này, đồng thời mang lại giá trị kinh tế bền vững cho đồng bào dân tộc vùng núi Tây Nguyên.
                  </p>
                </div>
              </div>
              
              <!-- Image -->
              <div class="story-image relative" data-aos="fade-left" data-aos-delay="200">
                <div class="clay-morph-container">
                  <div class="clay-card relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20">
                    <div class="relative overflow-hidden rounded-2xl">
                      <img 
                        :src="samTuoiImage" 
                        alt="Sâm Ngọc Linh" 
                        class="w-full h-auto object-cover aspect-[4/3]"
                      >
                      <!-- Floating elements -->
                      <div class="absolute top-6 left-6 w-20 h-20 bg-green-100 rounded-full blur-xl opacity-60 floating-element"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Our Mission Section -->
      <section class="mission-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="glass-container p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <!-- Image (reverse order on desktop) -->
              <div class="mission-image relative order-2 lg:order-1" data-aos="fade-right">
                <div class="clay-morph-container">
                  <div class="clay-card relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20">
                    <div class="relative overflow-hidden rounded-2xl">
                      <img 
                        :src="samTuoiImage" 
                        alt="Vườn Sâm Ngọc Linh" 
                        class="w-full h-auto object-cover aspect-[4/3]"
                      >
                      <!-- Floating elements -->
                      <div class="absolute bottom-6 right-6 w-20 h-20 bg-green-200 rounded-full blur-xl opacity-60 floating-element delay-2"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Content -->
              <div class="mission-content order-1 lg:order-2" data-aos="fade-left" data-aos-delay="200">
                <h2 class="text-3xl font-bold mb-6 text-gray-800">Sứ Mệnh & Tầm Nhìn</h2>
                <div class="space-y-4 text-gray-600">
                  <p>
                    <strong class="text-green-600">Sứ mệnh:</strong> Bảo tồn và phát triển nguồn gen Sâm Ngọc Linh, mang đến những sản phẩm tự nhiên, chất lượng cao cho sức khỏe cộng đồng.
                  </p>
                  <p>
                    <strong class="text-green-600">Tầm nhìn:</strong> Trở thành doanh nghiệp hàng đầu trong lĩnh vực phát triển bền vững, nghiên cứu và phân phối sản phẩm từ Sâm Ngọc Linh, đưa "Quốc bảo" Việt Nam ra thị trường quốc tế.
                  </p>
                  <p>
                    Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất với quy trình nghiêm ngặt từ trồng trọt, thu hoạch đến chế biến, giữ trọn tinh túy từ thiên nhiên.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Core Values Section -->
      <section class="values-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16" data-aos="fade-up">
            <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 bg-green-100/70 backdrop-blur-sm">
              Giá trị cốt lõi
            </span>
            <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800">Nguyên Tắc Của Chúng Tôi</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động và sản phẩm của chúng tôi
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Value 1 -->
            <div class="value-card" data-aos="fade-up" data-aos-delay="100">
              <div class="clay-inner bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-8 h-full relative overflow-hidden border border-white/30 shadow-xl">
                <div class="value-icon w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                  <i class="fas fa-leaf text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-800">Tự Nhiên</h3>
                <p class="text-gray-600">
                  Chúng tôi tôn trọng thiên nhiên và cam kết sử dụng nguyên liệu 100% tự nhiên, không chất bảo quản hay chất độc hại.
                </p>
              </div>
            </div>
            
            <!-- Value 2 -->
            <div class="value-card" data-aos="fade-up" data-aos-delay="200">
              <div class="clay-inner bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-8 h-full relative overflow-hidden border border-white/30 shadow-xl">
                <div class="value-icon w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                  <i class="fas fa-certificate text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-800">Chất Lượng</h3>
                <p class="text-gray-600">
                  Mỗi sản phẩm đều được kiểm soát nghiêm ngặt, đạt tiêu chuẩn chất lượng cao và đảm bảo tính an toàn cho người sử dụng.
                </p>
              </div>
            </div>
            
            <!-- Value 3 -->
            <div class="value-card" data-aos="fade-up" data-aos-delay="300">
              <div class="clay-inner bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-8 h-full relative overflow-hidden border border-white/30 shadow-xl">
                <div class="value-icon w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                  <i class="fas fa-hands-helping text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-800">Cộng Đồng</h3>
                <p class="text-gray-600">
                  Chúng tôi hỗ trợ cộng đồng địa phương bằng cách tạo việc làm, đào tạo kỹ năng và đóng góp vào sự phát triển kinh tế của vùng Tây Nguyên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="clay-container bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/30 shadow-xl text-center" data-aos="fade-up">
            <div class="relative z-10">
              <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Hợp Tác Cùng Chúng Tôi
              </h2>
              <p class="text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
                Chúng tôi luôn tìm kiếm đối tác để cùng phát triển và đưa sản phẩm Sâm Ngọc Linh đến với nhiều người hơn.
              </p>
              
              <div class="flex flex-wrap justify-center gap-6">
                <NeuButton 
                  @click="navigateTo('/contact')" 
                  variant="primary"
                  size="lg"
                >
                  <template #icon-left>
                    <i class="fas fa-envelope"></i>
                  </template>
                  Liên Hệ Ngay
                </NeuButton>
                
                <NeuButton 
                  @click="navigateTo('/products')" 
                  variant="secondary"
                  size="lg"
                >
                  <template #icon-left>
                    <i class="fas fa-leaf"></i>
                  </template>
                  Xem Sản Phẩm
                </NeuButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';
import samTuoiImage from '@/assets/images/products/sam-tuoi.png';

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

// Initialize AOS on mount
if (typeof window !== 'undefined' && window.AOS) {
  window.AOS.refresh();
}
</script>

<style scoped>
.about-page {
  overflow-x: hidden;
}

.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Clay card styles */
.clay-inner {
  transition: transform 0.3s, box-shadow 0.3s;
}

.clay-inner:hover {
  transform: translateY(-5px);
  /* Adjusted dark mode hover shadow for subtlety */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

/* Floating animation */
.floating-element {
  animation: float 6s ease-in-out infinite;
}

.floating-element.delay-2 {
  animation-delay: 2s;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Removed unused Neu-input styles as they are not present in the current template */
</style> 