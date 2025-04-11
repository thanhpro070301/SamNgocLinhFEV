<template>
  <div class="services-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Page Header -->
      <section class="page-header py-20 relative">
        <div class="container mx-auto px-4">
          <div class="text-center" data-aos="fade-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="block text-gray-800 dark:text-white">Dịch Vụ</span>
              <span class="text-gradient bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Cam Kết Chất Lượng
              </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-8">
              Các dịch vụ chuyên nghiệp về Sâm Ngọc Linh từ tư vấn đến giao hàng tận nơi
            </p>
          </div>
        </div>
      </section>
      
      <!-- Services Section -->
      <section class="services-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div 
              v-for="(service, index) in services" 
              :key="service.id"
              class="service-card"
              data-aos="fade-up"
              :data-aos-delay="index * 200"
            >
              <div class="clay-card h-full bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30 shadow-xl transition-all duration-500">
                <div class="service-image relative h-64 overflow-hidden">
                  <img 
                    :src="service.image" 
                    :alt="service.title" 
                    class="w-full h-full object-cover"
                  >
                  <!-- Overlay with gradient and icon -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                    <div class="p-6 w-full">
                      <div class="service-icon-container inline-flex items-center justify-center">
                        <div class="service-icon w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 shadow-lg">
                          <i :class="service.icon + ' text-2xl'"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-8">
                  <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ service.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-6">{{ service.description }}</p>
                  
                  <div class="glass-features-list p-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl mb-6 border border-white/30 dark:border-slate-700/30">
                    <ul class="space-y-3">
                      <li 
                        v-for="(feature, featureIndex) in service.features" 
                        :key="featureIndex" 
                        class="flex items-start"
                      >
                        <span class="feature-bullet w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mr-3 flex-shrink-0">
                          <i class="fas fa-check text-xs"></i>
                        </span>
                        <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="mt-auto">
                    <NeuButton 
                      @click="contactUs(service)"
                      variant="primary" 
                      size="lg"
                      :fullWidth="true"
                    >
                      <template #icon-left>
                        <i class="fas fa-headset"></i>
                      </template>
                      Liên hệ tư vấn
                    </NeuButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- More Services Section -->
      <section class="more-services-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16" data-aos="fade-up">
            <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 dark:text-green-400 bg-green-100/70 dark:bg-green-900/30 backdrop-blur-sm">
              Cam kết của chúng tôi
            </span>
            <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800 dark:text-white">Dịch Vụ Đi Kèm</h2>
            <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ngoài các dịch vụ chính, chúng tôi còn cung cấp các dịch vụ đi kèm để đảm bảo trải nghiệm tốt nhất cho khách hàng
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(additionalService, index) in additionalServices" 
              :key="index"
              data-aos="fade-up" 
              :data-aos-delay="index * 100"
              class="glass-card"
            >
              <div class="p-8 h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="service-mini-icon w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                  <i :class="additionalService.icon + ' text-2xl'"></i>
                </div>
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">{{ additionalService.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ additionalService.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="cta-section py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="clay-container bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/30 dark:border-slate-700/30 shadow-xl text-center" data-aos="fade-up">
            <div class="relative z-10">
              <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                Bạn Có Câu Hỏi Về Dịch Vụ?
              </h2>
              <p class="text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto text-lg">
                Đội ngũ tư vấn của chúng tôi luôn sẵn sàng trả lời mọi thắc mắc và giúp bạn tìm hiểu thêm về các sản phẩm Sâm Ngọc Linh.
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
                  Gửi Yêu Cầu Tư Vấn
                </NeuButton>
                
                <NeuButton 
                  @click="navigateTo('/products')" 
                  variant="secondary"
                  size="lg"
                >
                  <template #icon-left>
                    <i class="fas fa-shopping-cart"></i>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';

const router = useRouter();

// Main services
const services = ref([
  {
    id: 1,
    title: 'Tư Vấn Sản Phẩm',
    description: 'Đội ngũ chuyên gia của chúng tôi sẽ tư vấn cho bạn lựa chọn sản phẩm Sâm Ngọc Linh phù hợp nhất với nhu cầu sức khỏe.',
    icon: 'far fa-comments',
    image: '/images/services/consultation.jpg',
    features: [
      'Tư vấn miễn phí',
      'Đội ngũ chuyên nghiệp',
      'Hỗ trợ 24/7',
      'Giải đáp mọi thắc mắc'
    ]
  },
  {
    id: 2,
    title: 'Giao Hàng Toàn Quốc',
    description: 'Chúng tôi cung cấp dịch vụ giao hàng đến tận nhà trên toàn quốc với đội ngũ nhân viên chuyên nghiệp.',
    icon: 'fas fa-truck',
    image: '/images/services/delivery.jpg',
    features: [
      'Giao hàng tận nơi',
      'Đóng gói cẩn thận',
      'Theo dõi đơn hàng',
      'Bảo quản sản phẩm tốt'
    ]
  },
  {
    id: 3,
    title: 'Chứng Nhận Sản Phẩm',
    description: 'Dịch vụ cấp chứng nhận về nguồn gốc xuất xứ và chất lượng sản phẩm Sâm Ngọc Linh cho khách hàng mua số lượng lớn.',
    icon: 'fas fa-certificate',
    image: '/images/services/certification.jpg',
    features: [
      'Chứng nhận chất lượng',
      'Giấy tờ nguồn gốc',
      'Hồ sơ sản phẩm đầy đủ',
      'Đảm bảo uy tín'
    ]
  },
  {
    id: 4,
    title: 'Thiết Kế Quà Tặng',
    description: 'Dịch vụ thiết kế hộp quà sang trọng, phù hợp cho biếu tặng hoặc sự kiện quan trọng với sản phẩm Sâm Ngọc Linh.',
    icon: 'fas fa-gift',
    image: '/images/services/gift.jpg',
    features: [
      'Thiết kế theo yêu cầu',
      'Hộp quà sang trọng',
      'Gói quà tinh tế',
      'Tùy chỉnh thông điệp'
    ]
  }
]);

// Additional services
const additionalServices = [
  {
    title: 'Bảo Hành Sản Phẩm',
    description: 'Cam kết bảo hành sản phẩm và hoàn tiền 100% nếu phát hiện sản phẩm không đúng chất lượng cam kết.',
    icon: 'fas fa-shield-alt'
  },
  {
    title: 'Kiểm Định Chất Lượng',
    description: 'Mỗi sản phẩm đều được kiểm định nghiêm ngặt bởi các chuyên gia hàng đầu trước khi đến tay khách hàng.',
    icon: 'fas fa-microscope'
  },
  {
    title: 'Tư Vấn Y Khoa',
    description: 'Đội ngũ y bác sĩ chuyên môn cao sẽ tư vấn cách sử dụng sản phẩm hiệu quả nhất cho sức khỏe.',
    icon: 'fas fa-stethoscope'
  },
  {
    title: 'Chăm Sóc Khách Hàng',
    description: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp, luôn sẵn sàng hỗ trợ mọi thắc mắc và yêu cầu.',
    icon: 'fas fa-headset'
  },
  {
    title: 'Cập Nhật Thông Tin',
    description: 'Cung cấp thông tin mới nhất về sản phẩm, khuyến mãi và các tin tức liên quan đến Sâm Ngọc Linh.',
    icon: 'fas fa-newspaper'
  },
  {
    title: 'Hỗ Trợ Doanh Nghiệp',
    description: 'Dịch vụ đặc biệt dành cho doanh nghiệp cần mua số lượng lớn làm quà tặng hoặc đối tác.',
    icon: 'fas fa-handshake'
  }
];

// Navigate to contact page with service info
const contactUs = (service) => {
  router.push({
    path: '/contact',
    query: { service: service.title }
  });
};

// General navigation
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

.service-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.clay-card {
  transform: translateZ(0);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, box-shadow;
}

.service-card:hover .clay-card {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.1),
    0 10px 15px -5px rgba(0, 0, 0, 0.05);
}

:global(.dark) .service-card:hover .clay-card {
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.5),
    0 10px 15px -5px rgba(0, 0, 0, 0.2);
}

.service-icon-container {
  transform: translateY(50%);
}

.glass-card {
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
}

.clay-container {
  position: relative;
  overflow: hidden;
}

/* Glass-like decoration elements */
.clay-container::before,
.clay-container::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(59, 130, 246, 0.15));
  filter: blur(40px);
  z-index: -1;
}

.clay-container::before {
  top: -100px;
  left: -100px;
}

.clay-container::after {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(220, 252, 231, 0.15));
}
</style> 