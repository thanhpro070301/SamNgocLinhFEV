<template>
  <section class="why-choose-us-section py-20 relative z-10">
    <div class="container mx-auto px-4">
      <!-- Glass container for entire section -->
      <div class="glass-container p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border border-white/30 dark:border-slate-800/30 shadow-xl">
        <!-- Section header -->
        <div 
          class="section-header text-center mb-16" 
          data-aos="fade-up"
        >
          <span class="inline-block py-1 px-4 rounded-full text-sm font-medium text-green-700 dark:text-green-400 bg-green-100/70 dark:bg-green-900/30 backdrop-blur-sm">
            Lý do chọn chúng tôi
          </span>
          <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800 dark:text-white">
            Tại Sao Chọn Sâm Ngọc Linh Của Chúng Tôi?
          </h2>
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến những sản phẩm Sâm Ngọc Linh chất lượng cao nhất với quy trình sản xuất nghiêm ngặt.
          </p>
        </div>
        
        <!-- Features grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-leaf"></i>
              </div>
              <h3 class="feature-title">
                100% Tự Nhiên
              </h3>
              <p class="feature-desc">
                Sản phẩm được trồng và thu hoạch theo phương pháp tự nhiên, không chất bảo quản, đảm bảo an toàn cho sức khỏe người sử dụng.
              </p>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-certificate"></i>
              </div>
              <h3 class="feature-title">
                Chứng Nhận Chất Lượng
              </h3>
              <p class="feature-desc">
                Đạt tiêu chuẩn chất lượng và được cấp giấy chứng nhận từ các cơ quan chức năng, đảm bảo nguồn gốc xuất xứ rõ ràng.
              </p>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-shipping-fast"></i>
              </div>
              <h3 class="feature-title">
                Giao Hàng Nhanh Chóng
              </h3>
              <p class="feature-desc">
                Sản phẩm được đóng gói cẩn thận và giao hàng nhanh chóng đến tận tay khách hàng trên toàn quốc.
              </p>
            </div>
          </div>
          
          <!-- Feature 4 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="400"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-mountain"></i>
              </div>
              <h3 class="feature-title">
                Trồng Ở Độ Cao Lý Tưởng
              </h3>
              <p class="feature-desc">
                Sâm được trồng ở độ cao từ 1.200-2.000m so với mực nước biển, trong điều kiện khí hậu đặc thù của vùng núi Ngọc Linh.
              </p>
            </div>
          </div>
          
          <!-- Feature 5 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="500"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-flask"></i>
              </div>
              <h3 class="feature-title">
                Kiểm Nghiệm Khoa Học
              </h3>
              <p class="feature-desc">
                Sản phẩm được kiểm nghiệm nghiêm ngặt bởi các cơ quan khoa học hàng đầu, đảm bảo đúng hàm lượng saponin và dưỡng chất.
              </p>
            </div>
          </div>
          
          <!-- Feature 6 -->
          <div 
            class="feature-card" 
            data-aos="fade-up" 
            data-aos-delay="600"
          >
            <div class="feature-inner">
              <div class="feature-icon">
                <i class="fas fa-seedling"></i>
              </div>
              <h3 class="feature-title">
                Bền Vững Với Môi Trường
              </h3>
              <p class="feature-desc">
                Quy trình sản xuất của chúng tôi tuân thủ các tiêu chuẩn về bảo vệ môi trường và phát triển bền vững.
              </p>
            </div>
          </div>
        </div>
        
        <!-- CTA button -->
        <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="700">
          <NeuButton 
            variant="accent" 
            size="lg"
            @click="navigateTo('/about')"
          >
            <template #icon-left>
              <i class="fas fa-info-circle"></i>
            </template>
            Tìm hiểu thêm về chúng tôi
          </NeuButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import NeuButton from './NeuButton.vue';

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.glass-container {
  position: relative;
  overflow: hidden;
}

/* Glass-like decoration elements */
.glass-container::before,
.glass-container::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(59, 130, 246, 0.15));
  filter: blur(40px);
  z-index: -1;
}

.glass-container::before {
  top: -100px;
  left: -100px;
}

.glass-container::after {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(220, 252, 231, 0.15));
}

.feature-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.feature-inner {
  height: 100%;
  padding: 2rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

:global(.dark) .feature-inner {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(30, 41, 59, 0.3);
}

.feature-card:hover .feature-inner {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

:global(.dark) .feature-card:hover .feature-inner {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #16a34a;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

:global(.dark) .feature-icon {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
  color: #6ee7b7;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

:global(.dark) .feature-title {
  color: #f3f4f6;
}

.feature-desc {
  color: #666;
  line-height: 1.6;
}

:global(.dark) .feature-desc {
  color: #d1d5db;
}
</style> 