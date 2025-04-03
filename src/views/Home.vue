<template>
  <div class="home">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <Sidebar class="order-2 md:order-1" />
        
        <!-- Main Content -->
        <main class="flex-1 order-1 md:order-2">
          <!-- Hero Section -->
          <section class="hero relative overflow-hidden rounded-3xl mb-12">
            <!-- Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-700 to-green-600"></div>

            <div class="container mx-auto px-8 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <!-- Left Content -->
                <div class="hero-content text-white py-7" data-aos="fade-right">
                  <!-- Title -->
                  <h1 class="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                    Sâm Ngọc<br/>
                    <span class="text-green-300">Linh</span>
                  </h1>

                  <!-- Description -->
                  <p class="text-xl text-green-100 leading-relaxed mb-10 max-w-xl">
                    Chuyên cung cấp các sản phẩm sâm Ngọc Linh chất lượng cao, được trồng và chăm sóc theo tiêu chuẩn nghiêm ngặt.
                  </p>

                  <!-- Buttons -->
                  <div class="flex flex-wrap gap-4 mb-12">
                    <router-link 
                      to="/products" 
                      class="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-medium hover:bg-green-50 transition-all"
                    >
                      Xem sản phẩm
                      <i class="fas fa-arrow-right"></i>
                    </router-link>
                    <router-link 
                      to="/contact" 
                      class="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                      Liên hệ ngay
                      <i class="fas fa-headset"></i>
                    </router-link>
                  </div>

                  <!-- Trust Badges -->
                  <div class="flex flex-wrap items-center gap-8 mt-12">
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <i class="fas fa-check-circle text-green-300 text-xl"></i>
                      </div>
                      <span class="text-green-100">100% Tự nhiên</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <i class="fas fa-award text-green-300 text-xl"></i>
                      </div>
                      <span class="text-green-100">Chứng nhận ATTP</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <i class="fas fa-truck text-green-300 text-xl"></i>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-green-100">Giao hàng</span>
                        <span class="text-sm text-green-200">Miễn phí toàn quốc</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Content -->
                <div class="relative" data-aos="fade-left">
                  <!-- Main Image -->
                  <div class="relative z-10">
                    <img 
                      :src="samTuoiImage" 
                      alt="Sâm Ngọc Linh" 
                      class="w-full h-auto"
                    >
                  </div>

                  <!-- Rating Card -->
                  <div class="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
                    <h4 class="text-green-700 font-medium mb-1">Đánh giá</h4>
                    <div class="flex items-center gap-1 text-yellow-400 mb-1">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <p class="text-sm text-gray-600">1,234+ đánh giá</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Featured Products -->
          <section class="featured-products bg-gray-50 rounded-2xl mb-12">
            <div class="container mx-auto px-4 py-12">
              <div class="text-center mb-10">
                <h2 class="text-3xl font-bold mb-4">Sản Phẩm Bán Chạy</h2>
                <div class="w-24 h-1 bg-green-600 mx-auto"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard 
                  v-for="product in featuredProducts" 
                  :key="product.id" 
                  :product="product"
                  @add-to-cart="addToCart"
                />
              </div>
            </div>
          </section>

          <!-- Why Choose Us -->
          <section class="why-choose-us py-12 bg-white rounded-2xl mb-12">
            <div class="container mx-auto px-4">
              <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-4xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
                <div class="w-24 h-1 bg-green-600 mx-auto"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="feature-card text-center" data-aos="fade-up" data-aos-delay="100">
                  <div class="icon-wrapper mb-6">
                    <i class="fas fa-certificate text-5xl text-green-600"></i>
                  </div>
                  <h3 class="text-2xl font-semibold mb-4">Chất lượng đảm bảo</h3>
                  <p class="text-gray-600 leading-relaxed">Sản phẩm được kiểm định chất lượng nghiêm ngặt, đạt tiêu chuẩn cao nhất</p>
                </div>
                <div class="feature-card text-center" data-aos="fade-up" data-aos-delay="200">
                  <div class="icon-wrapper mb-6">
                    <i class="fas fa-shipping-fast text-5xl text-green-600"></i>
                  </div>
                  <h3 class="text-2xl font-semibold mb-4">Giao hàng nhanh chóng</h3>
                  <p class="text-gray-600 leading-relaxed">Dịch vụ vận chuyển toàn quốc, đảm bảo thời gian và chất lượng</p>
                </div>
                <div class="feature-card text-center" data-aos="fade-up" data-aos-delay="300">
                  <div class="icon-wrapper mb-6">
                    <i class="fas fa-headset text-5xl text-green-600"></i>
                  </div>
                  <h3 class="text-2xl font-semibold mb-4">Hỗ trợ 24/7</h3>
                  <p class="text-gray-600 leading-relaxed">Đội ngũ tư vấn chuyên nghiệp, nhiệt tình hỗ trợ mọi lúc</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Call to Action -->
          <section class="cta bg-green-700 text-white py-16 rounded-2xl" data-aos="fade-up">
            <div class="container mx-auto px-4 text-center">
              <h2 class="text-4xl font-bold mb-6">Bắt đầu trải nghiệm ngay hôm nay</h2>
              <p class="text-xl mb-8 text-green-100">Khám phá bộ sưu tập sản phẩm sâm Ngọc Linh chất lượng cao của chúng tôi</p>
              <router-link 
                to="/products" 
                class="inline-block bg-white text-green-700 px-10 py-4 rounded-lg font-semibold hover:bg-green-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Xem tất cả sản phẩm
              </router-link>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/products/ProductCard.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Import images
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'
import patternImage from '@/assets/images/patterns/pattern.jpg'

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 50
  })
})

const featuredProducts = ref([
  {
    id: 1,
    name: 'Sâm Ngọc Linh Tươi 10 Năm Tuổi',
    image: samTuoiImage,
    price: 15000000,
    originalPrice: 18000000,
    rating: 5,
    reviews: 124,
    discount: 15
  },
  {
    id: 2,
    name: 'Cao Sâm Ngọc Linh',
    image: samTuoiImage, // Temporarily using same image
    price: 8000000,
    rating: 4,
    reviews: 89
  },
  {
    id: 3,
    name: 'Rượu Sâm Ngọc Linh',
    image: samTuoiImage, // Temporarily using same image
    price: 5000000,
    originalPrice: 6000000,
    rating: 5,
    reviews: 156,
    discount: 10
  }
])

const addToCart = (product) => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product)
}
</script>

<style lang="scss" scoped>
.hero {
  min-height: 15vh;
  background-color: #065f46;
  
  @media (max-width: 768px) {
    min-height: auto;
  }
}

.feature-card {
  padding: 2.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  &:hover .icon-wrapper {
    background: rgba(16, 185, 129, 0.2);
    transform: scale(1.1);
  }
}

.cta {
  background-image: linear-gradient(135deg, #047857 0%, #059669 100%);
}
</style> 