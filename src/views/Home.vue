<template>
  <v-app>
    <!-- Hero Section -->
    <div class="hero-wrapper">
      <v-container fluid class="hero-section pa-0">
        <div class="hero-overlay"></div>
        <v-row no-gutters class="align-center">
          <v-col cols="12" md="6" class="pa-8 pa-md-16 hero-content">
            <v-card flat class="bg-transparent">
              <div class="logo-mark animate__animated animate__fadeIn animate__delay-1s">
                <div class="logo-circle">
                  <span>Sâm Ngọc Linh</span>
                </div>
              </div>
              <v-card-title class="text-h2 font-weight-bold text-primary mb-4 animate__animated animate__fadeInRight">
                Sâm Ngọc Linh<br>
                <span class="text-green">Chất Lượng Cao</span>
              </v-card-title>
              <v-card-text class="text-h6 text-grey-darken-1 mb-8 animate__animated animate__fadeInRight animate__delay-1s">
                Sản phẩm từ thiên nhiên, mang đến những dưỡng chất quý giá cho sức khỏe và sắc đẹp của bạn.
              </v-card-text>
              <v-card-actions class="gap-4 animate__animated animate__fadeInRight animate__delay-2s">
                <v-btn
                  to="/products"
                  color="primary"
                  size="x-large"
                  class="text-white hero-btn"
                  prepend-icon="mdi-shopping"
                  elevation="8"
                >
                  Xem sản phẩm
                </v-btn>
                <v-btn
                  to="/about"
                  variant="outlined"
                  color="primary"
                  size="x-large"
                  prepend-icon="mdi-information"
                  class="hero-btn-outline"
                >
                  Tìm hiểu thêm
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="pa-0">
            <div class="hero-image-container">
              <div class="hero-circle animate__animated animate__zoomIn"></div>
              <div class="hero-circle-2 animate__animated animate__zoomIn animate__delay-1s"></div>
              <v-img
                :src="samTuoiImage"
                cover
                height="100vh"
                class="animate__animated animate__fadeInLeft hero-image"
              >
                <div class="d-flex fill-height align-center justify-center">
                  <v-card
                    class="rounded-circle pa-4 bg-white animate__animated animate__pulse animate__infinite product-image-container"
                  >
                    <v-img
                      :src="samTuoiImage"
                      class="rounded-circle product-image"
                      cover
                    ></v-img>
                  </v-card>
                </div>
              </v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Benefits Section -->
    <v-container class="py-16 benefits-section">
      <v-row class="justify-center">
        <v-col
          v-for="(benefit, index) in benefits"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="animate__animated"
          :class="`animate__fadeInUp animate__delay-${index + 1}s`"
        >
          <v-card
            class="h-100 text-center pa-6 benefit-card"
            elevation="0"
            hover
          >
            <div class="benefit-icon-container mb-4">
              <v-icon
                :icon="benefit.icon"
                size="36"
                color="primary"
                class="benefit-icon"
              ></v-icon>
            </div>
            <v-card-title class="text-h6 font-weight-bold">
              {{ benefit.title }}
            </v-card-title>
            <v-card-text class="text-body-1 text-grey-darken-1">
              {{ benefit.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Products -->
    <div class="featured-products-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <div class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 animate__animated animate__fadeInDown">
              Sản phẩm đặc biệt
            </div>
            <div class="text-h3 font-weight-bold mb-4 animate__animated animate__fadeInDown animate__delay-1s">
              Sản Phẩm Nổi Bật
            </div>
            <div class="text-body-1 text-grey-darken-1 max-w-2xl mx-auto animate__animated animate__fadeInDown animate__delay-2s">
              Sâm Ngọc Linh được mệnh danh là "quốc bảo" của Việt Nam với nhiều công dụng quý giá cho sức khỏe.
            </div>
          </v-col>
        </v-row>

        <v-row v-if="isLoading" class="justify-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </v-row>

        <v-row v-else-if="error" class="justify-center">
          <v-col cols="12" class="text-center">
            <v-alert
              type="error"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
            <v-btn
              color="primary"
              @click="fetchFeaturedProducts"
            >
              Thử lại
            </v-btn>
          </v-col>
        </v-row>

        <div v-else class="swiper-container animate__animated animate__fadeIn">
          <swiper
            :modules="[Navigation, Pagination, Autoplay, EffectCoverflow]"
            :slides-per-view="1"
            :loop="true"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false
            }"
            :pagination="{ 
              clickable: true,
              dynamicBullets: true
            }"
            :navigation="true"
            :effect="'coverflow'"
            :breakpoints="{
              '640': {
                slidesPerView: 2,
                spaceBetween: 20
              },
              '1024': {
                slidesPerView: 3,
                spaceBetween: 30
              }
            }"
            :coverflow-effect="{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            }"
            class="featured-swiper"
          >
            <swiper-slide
              v-for="(product, index) in featuredProducts"
              :key="product.id"
              class="animate__animated animate__fadeInUp"
              :style="{ 'animation-delay': `${index * 0.2}s` }"
            >
              <v-card
                class="product-card h-100 overflow-hidden"
                elevation="4"
                hover
              >
                <div class="product-badge" v-if="index === 0">Hot</div>
                <div class="product-badge new" v-else-if="index === 1">Mới</div>
                <div class="product-badge sale" v-else-if="index === 2">Sale</div>
                
                <v-img
                  :src="product.image"
                  height="280"
                  cover
                  class="product-image"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-row>
                  </template>
                  <div class="product-overlay">
                    <v-btn
                      icon="mdi-eye"
                      color="white"
                      variant="text"
                      size="large"
                      :to="`/product/${product.id}`"
                      class="product-action-btn"
                    ></v-btn>
                    <v-btn
                      icon="mdi-cart"
                      color="white"
                      variant="text"
                      size="large"
                      @click="addToCart(product)"
                      class="product-action-btn"
                    ></v-btn>
                    <v-btn
                      icon="mdi-heart"
                      color="white"
                      variant="text"
                      size="large"
                      class="product-action-btn"
                    ></v-btn>
                  </div>
                </v-img>
                
                <v-card-text class="pa-6">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="text-subtitle-2 text-primary">Sâm Ngọc Linh</div>
                    <v-rating
                      :model-value="4.5"
                      color="amber"
                      density="compact"
                      half-increments
                      size="small"
                      readonly
                    ></v-rating>
                  </div>
                  
                  <h3 class="product-title text-h6 font-weight-bold mb-2 text-truncate">
                    {{ product.name }}
                  </h3>
                  
                  <p class="product-description text-body-2 text-grey-darken-1 mb-4 two-lines-ellipsis">
                    {{ product.description }}
                  </p>
                  
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-h5 font-weight-bold text-primary">
                      {{ formatPrice(product.price) }}
                    </span>
                    <v-btn
                      color="secondary"
                      variant="elevated"
                      @click="buyNow(product)"
                      class="buy-now-btn"
                    >
                      Mua ngay
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </swiper-slide>
          </swiper>
        </div>

        <v-row class="justify-center mt-12">
          <v-btn
            to="/products"
            color="primary"
            variant="outlined"
            size="large"
            class="rounded-pill px-8 py-3 animate__animated animate__fadeInUp view-all-btn"
          >
            Xem tất cả sản phẩm
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </div>

    <!-- Testimonials Section -->
    <div class="testimonials-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <div class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 animate__animated animate__fadeInDown">
              Khách hàng nói gì
            </div>
            <div class="text-h3 font-weight-bold mb-4 animate__animated animate__fadeInDown animate__delay-1s">
              Đánh Giá Từ Khách Hàng
            </div>
            <div class="text-body-1 text-grey-darken-1 max-w-2xl mx-auto animate__animated animate__fadeInDown animate__delay-2s">
              Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của chúng tôi.
            </div>
          </v-col>
        </v-row>

        <swiper
          :modules="[Navigation, Pagination, Autoplay]"
          :slides-per-view="1"
          :space-between="30"
          :loop="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false
          }"
          :pagination="{ 
            clickable: true,
            dynamicBullets: true
          }"
          :breakpoints="{
            '640': { slidesPerView: 2 },
            '1024': { slidesPerView: 3 }
          }"
          class="testimonials-swiper"
        >
          <swiper-slide
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="animate__animated animate__fadeInUp"
            :style="{ 'animation-delay': `${index * 0.2}s` }"
          >
            <v-card
              class="testimonial-card h-100 pa-6"
              elevation="3"
              hover
            >
              <div class="testimonial-quote-icon mb-4">
                <v-icon icon="mdi-format-quote-open" color="primary" size="36"></v-icon>
              </div>
              
              <p class="testimonial-text text-body-1 text-grey-darken-1 mb-6 font-italic">
                "{{ testimonial.comment }}"
              </p>
              
              <v-rating
                :model-value="testimonial.rating"
                color="amber"
                density="compact"
                half-increments
                readonly
                class="mb-4"
              ></v-rating>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="d-flex align-center">
                <v-avatar
                  color="primary"
                  size="56"
                  class="me-4 testimonial-avatar"
                >
                  <v-icon icon="mdi-account" color="white" size="28"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold testimonial-name">
                    {{ testimonial.name }}
                  </div>
                  <div class="text-caption text-grey testimonial-role">
                    {{ testimonial.role }}
                  </div>
                </div>
              </div>
            </v-card>
          </swiper-slide>
        </swiper>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import 'animate.css'
import api from '@/api'
import cart from '@/store/cart'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const modules = [Navigation, Pagination, Autoplay, EffectCoverflow]

// Fix image path
const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// State for products
const featuredProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

// Benefits data
const benefits = [
  {
    icon: 'mdi-leaf',
    title: '100% Tự Nhiên',
    description: 'Sản phẩm được trồng và thu hoạch theo phương pháp tự nhiên, không chất bảo quản.'
  },
  {
    icon: 'mdi-certificate',
    title: 'Chứng Nhận Chất Lượng',
    description: 'Đạt tiêu chuẩn chất lượng và được cấp giấy chứng nhận từ các cơ quan chức năng.'
  },
  {
    icon: 'mdi-truck-fast',
    title: 'Giao Hàng Toàn Quốc',
    description: 'Sản phẩm được đóng gói cẩn thận và giao hàng nhanh chóng đến tận tay khách hàng.'
  },
  {
    icon: 'mdi-shield-check',
    title: 'Bảo Hành Sản Phẩm',
    description: 'Cam kết chất lượng sản phẩm và chính sách bảo hành uy tín.'
  }
]

// Testimonials data
const testimonials = [
  {
    rating: 5,
    comment: 'Tôi đã sử dụng Sâm Ngọc Linh được 3 tháng và sức khỏe đã cải thiện đáng kể. Giấc ngủ sâu hơn và tinh thần luôn tỉnh táo.',
    name: 'Nguyễn Văn A',
    role: 'Khách hàng thân thiết'
  },
  {
    rating: 5,
    comment: 'Sản phẩm chất lượng cao, đóng gói cẩn thận và giao hàng nhanh. Tôi rất hài lòng với dịch vụ và sẽ tiếp tục ủng hộ.',
    name: 'Trần Thị B',
    role: 'Khách hàng mới'
  },
  {
    rating: 4.5,
    comment: 'Đã mua rượu sâm ngọc linh làm quà biếu và nhận được phản hồi rất tích cực. Giá cả hợp lý cho chất lượng sản phẩm.',
    name: 'Lê Văn C',
    role: 'Khách hàng VIP'
  }
]

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'VNĐ')
}

// Fetch featured products
async function fetchFeaturedProducts() {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await api.product.getFeaturedProducts()
    
    let productsData = []
    
    if (response && typeof response === 'object') {
      if (response.products && Array.isArray(response.products)) {
        productsData = response.products
      } else if (Array.isArray(response)) {
        productsData = response
      }
    }
    
    if (productsData && productsData.length > 0) {
      featuredProducts.value = productsData.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.image ? (product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}${product.image}`) : samTuoiImage,
        slug: product.slug || ''
      }))
    } else {
      useDefaultProducts()
    }
  } catch (err) {
    console.error('Error fetching featured products:', err)
    error.value = 'Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.'
    useDefaultProducts()
  } finally {
    isLoading.value = false
  }
}

// Default products
function useDefaultProducts() {
  featuredProducts.value = [
    {
      id: 1,
      name: 'Sâm Ngọc Linh tươi 10 năm tuổi',
      description: 'Sâm ngọc linh tươi có tuổi đời 10 năm, được thu hoạch từ vùng núi Ngọc Linh, giữ nguyên dược tính quý giá.',
      price: 2500000,
      image: samTuoiImage,
      slug: 'sam-ngoc-linh-tuoi-10-nam-tuoi'
    },
    {
      id: 2,
      name: 'Cao Sâm Ngọc Linh',
      description: 'Cao sâm ngọc linh nguyên chất, tinh khiết, giúp bồi bổ sức khỏe hiệu quả, tăng cường hệ miễn dịch.',
      price: 1800000,
      image: samTuoiImage,
      slug: 'cao-sam-ngoc-linh'
    },
    {
      id: 3,
      name: 'Rượu Sâm Ngọc Linh',
      description: 'Rượu ngâm sâm ngọc linh, giúp tăng cường sinh lực và bồi bổ cơ thể, phù hợp cho người lớn tuổi.',
      price: 1500000,
      image: samTuoiImage,
      slug: 'ruou-sam-ngoc-linh'
    }
  ]
}

// Cart functionality
function addToCart(product) {
  cart.addToCart(product, 1)
  notificationService.cart(product)
}

// Buy now functionality
function buyNow(product) {
  cart.addToCart(product, 1)
  notificationService.show(`Đang chuyển đến trang thanh toán cho sản phẩm: ${product.name}`, {
    title: 'Thanh toán ngay'
  })
  
  setTimeout(() => {
    router.push('/checkout')
  }, 800)
}

// Initialize on mount
onMounted(() => {
  fetchFeaturedProducts()
})
</script>

<style>
.hero-wrapper {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/images/pattern.png') repeat;
  opacity: 0.05;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(22, 163, 74, 0.1);
  border-radius: 50%;
  top: 20%;
  right: 10%;
  z-index: 0;
}

.hero-circle-2 {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(249, 115, 22, 0.1);
  border-radius: 50%;
  bottom: 15%;
  right: 25%;
  z-index: 0;
}

.hero-btn {
  border-radius: 30px !important;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
}

.hero-btn-outline {
  border-radius: 30px !important;
  border-width: 2px !important;
  transition: all 0.3s ease;
}

.hero-btn:hover, .hero-btn-outline:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(22, 163, 74, 0.2);
}

.product-image-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  max-height: 400px;
  z-index: 2;
}

.logo-mark {
  position: absolute;
  top: 20px;
  left: 20px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: #16a34a;
  text-align: center;
  text-transform: uppercase;
  line-height: 1;
  padding: 4px;
}

.benefit-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  margin: 0 auto;
  box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.2);
}

.benefit-card {
  border-radius: 16px;
  border: 1px solid rgba(22, 163, 74, 0.1);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-10px);
  border-color: rgba(22, 163, 74, 0.3);
  box-shadow: 0 20px 25px -5px rgba(22, 163, 74, 0.1), 0 10px 10px -5px rgba(22, 163, 74, 0.04) !important;
}

.featured-products-section {
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.featured-products-section::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background-color: rgba(22, 163, 74, 0.05);
  border-radius: 50%;
  top: -150px;
  left: -150px;
}

.featured-products-section::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background-color: rgba(249, 115, 22, 0.05);
  border-radius: 50%;
  bottom: -150px;
  right: -150px;
}

.section-subtitle {
  font-size: 0.875rem;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
}

.section-subtitle::before, .section-subtitle::after {
  content: '';
  position: absolute;
  height: 1px;
  background-color: #16a34a;
  top: 50%;
  width: 30px;
}

.section-subtitle::before {
  left: -40px;
}

.section-subtitle::after {
  right: -40px;
}

.product-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #16a34a;
  color: white;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.product-badge.new {
  background-color: #3b82f6;
}

.product-badge.sale {
  background-color: #f97316;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-action-btn {
  transform: translateY(20px);
  transition: all 0.3s ease;
  opacity: 0;
}

.product-card:hover .product-action-btn {
  transform: translateY(0);
  opacity: 1;
}

.product-card:hover .product-action-btn:nth-child(2) {
  transition-delay: 0.1s;
}

.product-card:hover .product-action-btn:nth-child(3) {
  transition-delay: 0.2s;
}

.product-title {
  transition: all 0.3s ease;
}

.product-card:hover .product-title {
  color: #16a34a;
}

.buy-now-btn {
  border-radius: 30px !important;
  transition: all 0.3s ease;
}

.buy-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
}

.view-all-btn {
  transition: all 0.3s ease;
  border-width: 2px !important;
}

.view-all-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.2);
}

.two-lines-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:root {
  --swiper-theme-color: #16a34a !important;
  --swiper-navigation-size: 30px !important;
}

.featured-swiper {
  padding: 30px 10px !important;
  overflow: visible;
}

.swiper-pagination {
  position: relative;
  margin-top: 20px;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}

.swiper-pagination-bullet-active {
  width: 20px;
  border-radius: 5px;
}

.testimonials-section {
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background-color: rgba(22, 163, 74, 0.05);
  border-radius: 50%;
  top: -200px;
  right: -200px;
  z-index: 0;
}

.testimonials-section::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background-color: rgba(249, 115, 22, 0.05);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
  z-index: 0;
}

.testimonial-card {
  border-radius: 16px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(22, 163, 74, 0.1);
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border-color: rgba(22, 163, 74, 0.2);
}

.testimonial-quote-icon {
  display: inline-block;
  background-color: rgba(22, 163, 74, 0.1);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-text {
  min-height: 120px;
  font-size: 1rem;
  line-height: 1.6;
}

.testimonial-avatar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
}

.testimonial-name {
  transition: all 0.3s ease;
}

.testimonial-card:hover .testimonial-name {
  color: #16a34a;
}

.testimonials-swiper {
  padding: 30px 10px !important;
  overflow: visible;
}
</style> 