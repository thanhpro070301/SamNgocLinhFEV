<template>
  <v-app>
    <!-- Hero Section -->
    <v-container fluid class="hero-section pa-0">
      <v-row no-gutters class="align-center">
        <v-col cols="12" md="6" class="pa-8 pa-md-16">
          <v-card flat class="bg-transparent">
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
                class="text-white"
                prepend-icon="mdi-shopping"
              >
                Xem sản phẩm
              </v-btn>
              <v-btn
                to="/about"
                variant="outlined"
                color="primary"
                size="x-large"
                prepend-icon="mdi-information"
              >
                Tìm hiểu thêm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="pa-0">
          <v-img
            :src="samTuoiImage"
            cover
            height="100vh"
            class="animate__animated animate__fadeInLeft"
          >
            <div class="d-flex fill-height align-center justify-center">
              <v-card
                class="rounded-circle pa-4 bg-white animate__animated animate__pulse animate__infinite"
                style="max-width: 400px; max-height: 400px;"
              >
                <v-img
                  :src="samTuoiImage"
                  class="rounded-circle"
                  cover
                ></v-img>
              </v-card>
            </div>
          </v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- Benefits Section -->
    <v-container class="py-16">
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
            class="h-100 text-center pa-6"
            elevation="2"
            hover
          >
            <v-icon
              :icon="benefit.icon"
              size="64"
              color="primary"
              class="mb-4"
            ></v-icon>
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
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" class="text-center mb-12">
          <div class="text-h4 font-weight-bold mb-4 animate__animated animate__fadeInDown">
            Sản Phẩm Nổi Bật
          </div>
          <div class="text-body-1 text-grey-darken-1 max-w-2xl mx-auto animate__animated animate__fadeInDown animate__delay-1s">
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

      <v-row v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(product, index) in featuredProducts" 
          :key="product.id" 
          class="product-card group flex flex-col h-full"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="product-image overflow-hidden rounded-t-lg bg-gray-100 h-64 flex items-center justify-center">
            <router-link :to="`/product/${product.id}`" class="w-full h-full flex items-center justify-center">
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
              >
            </router-link>
          </div>
          <div class="product-info p-6 bg-white rounded-b-lg shadow-md group-hover:shadow-xl transition-shadow flex flex-col h-60">
            <router-link :to="`/product/${product.id}`">
              <h3 class="product-title text-xl font-semibold text-gray-800 mb-2 h-14 line-clamp-2">{{ product.name }}</h3>
            </router-link>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
              <span class="text-sm text-gray-500 ml-2">(4.5)</span>
            </div>
            <p class="product-description text-gray-600 mb-4 h-12 line-clamp-2">{{ product.description }}</p>
            <div class="flex flex-col mt-auto">
              <span class="product-price text-xl font-bold text-green-600 mb-2">{{ formatPrice(product.price) }}</span>
              <div class="flex space-x-2">
                <button 
                  @click="addToCart(product)" 
                  class="btn-add-cart h-10 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex-1 text-center flex items-center justify-center"
                >
                  <i class="fas fa-shopping-cart mr-1"></i> Thêm
                </button>
                <button 
                  @click="buyNow(product)" 
                  class="btn-buy-now h-10 px-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap flex-1 text-center flex items-center justify-center"
                >
                  <i class="fas fa-bolt mr-1"></i> Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </v-row>
      
      <div class="text-center mt-12" data-aos="fade-up">
        <router-link 
          to="/products" 
          class="btn-view-all inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          Xem tất cả sản phẩm
          <i class="fas fa-arrow-right ml-2"></i>
        </router-link>
      </div>
    </v-container>

    <!-- Testimonials Section -->
    <v-container class="py-16">
      <v-row>
        <v-col cols="12" class="text-center mb-12">
          <div class="text-h4 font-weight-bold mb-4 animate__animated animate__fadeInDown">
            Đánh Giá Từ Khách Hàng
          </div>
          <div class="text-body-1 text-grey-darken-1 max-w-2xl mx-auto animate__animated animate__fadeInDown animate__delay-1s">
            Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của chúng tôi.
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(testimonial, index) in testimonials"
          :key="index"
          cols="12"
          md="4"
          class="animate__animated"
          :class="`animate__fadeInUp animate__delay-${index + 1}s`"
        >
          <v-card
            class="h-100 pa-6"
            elevation="2"
            hover
          >
            <v-rating
              :model-value="testimonial.rating"
              color="amber"
              density="compact"
              half-increments
              readonly
              class="mb-4"
            ></v-rating>
            <p class="text-body-1 text-grey-darken-1 mb-4 font-italic">
              "{{ testimonial.comment }}"
            </p>
            <div class="d-flex align-center">
              <v-avatar
                color="primary"
                size="48"
                class="me-4"
              >
                <v-icon icon="mdi-account" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ testimonial.name }}
                </div>
                <div class="text-caption text-grey">
                  {{ testimonial.role }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'animate.css'
import api from '@/api'
import cart from '@/store/cart'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const modules = [Navigation, Pagination]

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
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.swiper {
  padding: 20px 0;
}

.swiper-slide {
  height: auto;
}
</style> 