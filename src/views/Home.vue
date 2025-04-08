<template>
  <div class="home">
    <!-- Hero Section with animation -->
    <div class="hero-section">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="hero-content" data-aos="fade-right">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Sâm Ngọc Linh<br><span class="text-green-600">Chất Lượng Cao</span></h1>
            <p class="text-lg text-gray-600 mb-8">
              Sản phẩm từ thiên nhiên, mang đến những dưỡng chất quý giá cho sức khỏe và sắc đẹp của bạn.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link 
                to="/products" 
                class="btn-primary px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <i class="fas fa-shopping-basket mr-2"></i> Xem sản phẩm
              </router-link>
              <router-link 
                to="/about" 
                class="btn-outline px-6 py-3 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-50 transition-all"
              >
                <i class="fas fa-info-circle mr-2"></i> Tìm hiểu thêm
              </router-link>
            </div>
          </div>
          <div class="hero-image" data-aos="fade-left" data-aos-delay="200">
            <div class="relative">
              <div class="absolute -inset-4 bg-green-100 rounded-full opacity-70 animate-pulse"></div>
              <div class="relative z-10 overflow-hidden rounded-full p-2 bg-white shadow-2xl">
                <img 
                  :src="samTuoiImage" 
                  alt="Sâm Ngọc Linh" 
                  class="w-full h-auto rounded-full object-cover transform hover:scale-105 transition-transform duration-500"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Benefit Pills -->
    <div class="benefits-section bg-gray-50 py-10">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-4 md:gap-8">
          <div class="benefit-pill" data-aos="zoom-in" data-aos-delay="100">
            <i class="fas fa-leaf text-green-500 mr-2"></i>
            <span>100% Tự Nhiên</span>
          </div>
          <div class="benefit-pill" data-aos="zoom-in" data-aos-delay="200">
            <i class="fas fa-medal text-green-500 mr-2"></i>
            <span>Chứng Nhận Chất Lượng</span>
          </div>
          <div class="benefit-pill" data-aos="zoom-in" data-aos-delay="300">
            <i class="fas fa-truck text-green-500 mr-2"></i>
            <span>Giao Hàng Toàn Quốc</span>
          </div>
          <div class="benefit-pill" data-aos="zoom-in" data-aos-delay="400">
            <i class="fas fa-shield-alt text-green-500 mr-2"></i>
            <span>Bảo Hành Sản Phẩm</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="featured-products py-16">
      <div class="container mx-auto px-4">
        <div class="section-header text-center mb-12" data-aos="fade-up">
          <span class="text-sm uppercase tracking-wider text-green-600 font-semibold">Sản phẩm đặc biệt</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">Sản Phẩm Nổi Bật</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Sâm Ngọc Linh được mệnh danh là "quốc bảo" của Việt Nam với nhiều công dụng quý giá cho sức khỏe.
          </p>
        </div>
        
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
        </div>
        
        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-500">{{ error }}</p>
          <button @click="fetchFeaturedProducts" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Thử lại
          </button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Sản phẩm với animation -->
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
        </div>
        
        <div class="text-center mt-12" data-aos="fade-up">
          <router-link 
            to="/products" 
            class="btn-view-all inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            Xem tất cả sản phẩm
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Why Choose Us -->
    <div class="features-section bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <div class="section-header text-center mb-12" data-aos="fade-up">
          <span class="text-sm uppercase tracking-wider text-green-600 font-semibold">Lý do chọn chúng tôi</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến những sản phẩm Sâm Ngọc Linh chất lượng cao nhất.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-item text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-leaf text-green-600 text-2xl"></i>
            </div>
            <h3 class="feature-title text-xl font-semibold mb-3">100% Tự nhiên</h3>
            <p class="feature-description text-gray-600">
              Sản phẩm được trồng và thu hoạch theo phương pháp tự nhiên, không chất bảo quản, đảm bảo an toàn cho sức khỏe người sử dụng.
            </p>
          </div>
          
          <div class="feature-item text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-certificate text-green-600 text-2xl"></i>
            </div>
            <h3 class="feature-title text-xl font-semibold mb-3">Chứng nhận chất lượng</h3>
            <p class="feature-description text-gray-600">
              Đạt tiêu chuẩn chất lượng và được cấp giấy chứng nhận từ các cơ quan chức năng, đảm bảo nguồn gốc xuất xứ rõ ràng.
            </p>
          </div>
          
          <div class="feature-item text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-shipping-fast text-green-600 text-2xl"></i>
            </div>
            <h3 class="feature-title text-xl font-semibold mb-3">Giao hàng nhanh chóng</h3>
            <p class="feature-description text-gray-600">
              Sản phẩm được đóng gói cẩn thận và giao hàng nhanh chóng đến tận tay khách hàng trên toàn quốc.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="testimonials-section py-16">
      <div class="container mx-auto px-4">
        <div class="section-header text-center mb-12" data-aos="fade-up">
          <span class="text-sm uppercase tracking-wider text-green-600 font-semibold">Khách hàng nói gì</span>
          <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">Đánh Giá Từ Khách Hàng</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của chúng tôi.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="testimonial-card p-6 bg-white rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="100">
            <div class="flex text-yellow-400 mb-4">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p class="text-gray-600 mb-4 italic">
              "Tôi đã sử dụng Sâm Ngọc Linh được 3 tháng và sức khỏe đã cải thiện đáng kể. Giấc ngủ sâu hơn và tinh thần luôn tỉnh táo."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                <i class="fas fa-user text-gray-400 flex items-center justify-center h-full"></i>
              </div>
              <div>
                <h4 class="font-semibold">Nguyễn Văn A</h4>
                <p class="text-sm text-gray-500">Khách hàng thân thiết</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card p-6 bg-white rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="200">
            <div class="flex text-yellow-400 mb-4">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p class="text-gray-600 mb-4 italic">
              "Sản phẩm chất lượng cao, đóng gói cẩn thận và giao hàng nhanh. Tôi rất hài lòng với dịch vụ và sẽ tiếp tục ủng hộ."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                <i class="fas fa-user text-gray-400 flex items-center justify-center h-full"></i>
              </div>
              <div>
                <h4 class="font-semibold">Trần Thị B</h4>
                <p class="text-sm text-gray-500">Khách hàng mới</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card p-6 bg-white rounded-xl shadow-md" data-aos="fade-up" data-aos-delay="300">
            <div class="flex text-yellow-400 mb-4">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <p class="text-gray-600 mb-4 italic">
              "Đã mua rượu sâm ngọc linh làm quà biếu và nhận được phản hồi rất tích cực. Giá cả hợp lý cho chất lượng sản phẩm."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                <i class="fas fa-user text-gray-400 flex items-center justify-center h-full"></i>
              </div>
              <div>
                <h4 class="font-semibold">Lê Văn C</h4>
                <p class="text-sm text-gray-500">Khách hàng VIP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AOS from 'aos'
import api from '@/api'
import cart from '@/store/cart'
import { useRouter } from 'vue-router'

// Initialize router
const router = useRouter()

// Fix image path by using public path instead of relative import
const samTuoiImage = '/assets/images/products/sam-tuoi.png'

// State for products
const featuredProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

// Format giá tiền
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'VNĐ')
}

// Fetch featured products from API
async function fetchFeaturedProducts() {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch products with limit=3 to get only featured ones
    const response = await api.product.getProducts({
      page: 0,
      size: 3,
      sort: 'sold',
      direction: 'desc'
    })
    
    console.log('API Response in Home.vue:', response.data);
    
    // Kiểm tra cấu trúc phản hồi API
    let productsData = [];
    
    if (response.data && typeof response.data === 'object') {
      if (response.data.products && Array.isArray(response.data.products)) {
        // Cấu trúc { products: [...], totalItems, totalPages }
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        // Cấu trúc mảng trực tiếp
        productsData = response.data;
      }
    }
    
    // Kiểm tra nếu có data
    if (productsData && productsData.length > 0) {
      // Map API response to our format
      featuredProducts.value = productsData.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.image ? (product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}${product.image}`) : samTuoiImage,
        slug: product.slug || ''
      }));
    } else {
      // Nếu không có sản phẩm nào, sử dụng dữ liệu mẫu
      console.warn('Không có sản phẩm nào được trả về từ API');
      useDefaultProducts();
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
      
      // Kiểm tra nếu response là HTML (không phải JSON)
      if (typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
        console.error('API đang trả về HTML thay vì JSON. Có thể có vấn đề với cấu hình CORS hoặc API endpoint');
      }
    }
    
    error.value = 'Không thể tải sản phẩm. Vui lòng thử lại sau.';
    
    // Sử dụng dữ liệu mẫu khi API bị lỗi
    useDefaultProducts();
  } finally {
    isLoading.value = false
  }
}

// Function để sử dụng dữ liệu mẫu
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

// Handle add to cart functionality
function addToCart(product) {
  cart.addToCart(product, 1)
  alert(`Đã thêm ${product.name} vào giỏ hàng!`)
}

// Handle buy now functionality
function buyNow(product) {
  cart.addToCart(product, 1)
  alert(`Đang chuyển đến trang thanh toán cho sản phẩm: ${product.name}`)
  router.push('/checkout')
}

// Fetch data and initialize AOS on component mount
onMounted(() => {
  fetchFeaturedProducts()
  AOS.refresh()
})
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;

// Custom styles for benefit pills
.benefit-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: #374151;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

// Add animations
.hero-section {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    background-color: rgba(220, 252, 231, 0.3); // green-100 with opacity
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    z-index: 0;
  }
}

// Custom animation for product cards
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.product-card {
  transition: all 0.3s ease;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .product-image {
    height: 16rem;
    background-color: #f9fafb;
  }
  
  .product-info {
    height: auto;
    min-height: 15rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .btn-add-cart, .btn-buy-now {
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  .btn-add-cart {
    background-color: #16a34a;
    &:hover {
      background-color: #15803d;
    }
  }
  
  .btn-buy-now {
    background-color: #f97316;
    &:hover {
      background-color: #ea580c;
    }
  }
}

// Using @apply for utility classes
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 