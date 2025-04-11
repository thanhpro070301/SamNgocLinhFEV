<template>
  <div class="home min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Trust Pill Pills - Floating badges for key features -->
      <div class="trust-pills py-10 relative z-10">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center gap-4 md:gap-6">
            <div 
              v-for="(pill, index) in trustPills" 
              :key="index" 
              class="neu-pill bg-white/70 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30 shadow-lg flex items-center gap-3"
              data-aos="zoom-in" 
              :data-aos-delay="100 + (index * 100)"
            >
              <div class="pill-icon w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <i :class="pill.icon"></i>
              </div>
              <span class="text-gray-700 font-medium">{{ pill.text }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Featured Products Section -->
      <div class="featured-products py-20 relative z-10">
        <div class="container mx-auto px-4">
          <!-- Section Header -->
          <div class="section-header text-center mb-16" data-aos="fade-up">
            <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 bg-green-100/70 backdrop-blur-sm">
              Sản phẩm đặc biệt
            </span>
            <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800">Sản Phẩm Nổi Bật</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Sâm Ngọc Linh được mệnh danh là "quốc bảo" của Việt Nam với nhiều công dụng quý giá cho sức khỏe.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="isLoading && featuredProducts.length === 0" class="flex justify-center items-center py-32">
            <div class="relative">
              <div class="w-20 h-20 border-4 border-green-100 rounded-full"></div>
              <div class="absolute top-0 left-0 w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="error-container bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-red-100 text-center py-16">
            <div class="mb-6 w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Lỗi kết nối</h3>
            <p class="text-red-600 mb-6 max-w-md mx-auto">{{ error }}</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <NeuButton 
                @click="fetchFeaturedProducts" 
                variant="secondary"
              >
                <template #icon-left>
                  <i class="fas fa-sync-alt"></i>
                </template>
                Thử lại
              </NeuButton>
              <NeuButton 
                @click="navigateTo('/products')" 
                variant="primary"
              >
                <template #icon-left>
                  <i class="fas fa-th-large"></i>
                </template>
                Xem tất cả sản phẩm
              </NeuButton>
            </div>
          </div>
          
          <!-- Products Grid with Loading Overlay -->
          <div v-else-if="featuredProducts.length > 0" class="relative">
            <!-- Loading Overlay -->
            <div v-if="isLoading" class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
              <div class="flex flex-col items-center">
                <div class="relative mb-3">
                  <div class="w-12 h-12 border-3 border-green-100 rounded-full"></div>
                  <div class="absolute top-0 left-0 w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p class="text-sm text-gray-600">Đang cập nhật...</p>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mx-auto max-w-6xl">
              <div 
                v-for="(product, index) in featuredProducts" 
                :key="product.id"
                data-aos="fade-up"
                :data-aos-delay="index * 100 + 100"
                data-aos-duration="800"
                class="w-full"
              >
                <ProductCard :product="product" @add-to-cart="handleAddToCart" />
              </div>
            </div>
          </div>
          
          <!-- View All Products Button -->
          <div class="text-center mt-16" data-aos="fade-up">
            <NeuButton 
              @click="navigateTo('/products')" 
              variant="secondary"
              size="lg"
            >
              <template #icon-left>
                <i class="fas fa-th-large"></i>
              </template>
              Xem tất cả sản phẩm
              <template #icon-right>
                <i class="fas fa-arrow-right"></i>
              </template>
            </NeuButton>
          </div>
        </div>
      </div>
      
      <!-- Why Choose Us Section -->
      <WhyChooseUs />
      
      <!-- Testimonials Section -->
      <div class="testimonials-section py-20 relative z-10">
        <div class="container mx-auto px-4">
          <!-- Section Header -->
          <div class="section-header text-center mb-16" data-aos="fade-up">
            <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 bg-green-100/70 backdrop-blur-sm">
              Khách hàng nói gì
            </span>
            <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800">Đánh Giá Từ Khách Hàng</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của chúng tôi.
            </p>
          </div>
          
          <!-- Testimonials Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="(testimonial, index) in testimonials" 
              :key="index"
              data-aos="fade-up" 
              :data-aos-delay="index * 100 + 100"
            >
              <Testimonial 
                :testimonial="testimonial" 
                :highlight="true"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section with Claymorphism -->
      <div class="cta-section py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="clay-container bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/30 shadow-xl text-center"
            data-aos="fade-up"
          >
            <!-- Decorative elements -->
            <div class="absolute inset-0 overflow-hidden rounded-3xl">
              <div class="absolute top-0 right-0 w-full h-full bg-gradient-radial from-green-200/20 to-transparent"></div>
            </div>
            
            <div class="relative z-10">
              <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Khám Phá Sức Mạnh Thiên Nhiên Cùng Sâm Ngọc Linh
              </h2>
              <p class="text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
                Trải nghiệm những sản phẩm chất lượng cao từ "quốc bảo" Việt Nam. Chúng tôi cam kết mang đến những sản phẩm tự nhiên, an toàn và hiệu quả.
              </p>
              
              <div class="flex flex-wrap justify-center gap-6">
                <NeuButton 
                  @click="navigateTo('/products')" 
                  variant="primary"
                  size="lg"
                >
                  <template #icon-left>
                    <i class="fas fa-shopping-cart"></i>
                  </template>
                  Mua Ngay
                </NeuButton>
                
                <NeuButton 
                  @click="navigateTo('/contact')" 
                  variant="secondary"
                  size="lg"
                >
                  <template #icon-left>
                    <i class="fas fa-headset"></i>
                  </template>
                  Liên Hệ Tư Vấn
                </NeuButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import AuroraBackground from '@/components/AuroraBackground.vue';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/ProductCard.vue';
import WhyChooseUs from '@/components/WhyChooseUs.vue';
import Testimonial from '@/components/Testimonial.vue';
import NeuButton from '@/components/NeuButton.vue';
import { productApi } from '@/api'; // Import the API

// Router
const router = useRouter();

// Featured Products Data
const featuredProducts = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Trust Pills Data
const trustPills = [
  { icon: 'fas fa-leaf', text: '100% Tự Nhiên' },
  { icon: 'fas fa-medal', text: 'Chứng Nhận Chất Lượng' },
  { icon: 'fas fa-shipping-fast', text: 'Giao Hàng Toàn Quốc' },
  { icon: 'fas fa-shield-alt', text: 'Bảo Hành Sản Phẩm' }
];

// Testimonials Data
const testimonials = [
  {
    name: 'Nguyễn Văn A',
    title: 'Khách hàng thân thiết',
    text: 'Tôi đã sử dụng Sâm Ngọc Linh được 3 tháng và sức khỏe đã cải thiện đáng kể. Giấc ngủ sâu hơn và tinh thần luôn tỉnh táo.',
    rating: 5,
    avatar: '/images/avatars/user1.jpg'
  },
  {
    name: 'Trần Thị B',
    title: 'Giám đốc công ty ABC',
    text: 'Sâm Ngọc Linh thực sự là sản phẩm tuyệt vời! Tôi cảm thấy năng lượng dồi dào hơn, tập trung tốt hơn và làm việc hiệu quả hơn.',
    rating: 5,
    avatar: '/images/avatars/user2.jpg'
  },
  {
    name: 'Lê Văn C',
    title: 'Bác sĩ y khoa',
    text: 'Với kinh nghiệm làm việc trong ngành y, tôi đánh giá cao chất lượng và độ tinh khiết của Sâm Ngọc Linh. Đây là sản phẩm tôi thường xuyên giới thiệu cho bệnh nhân.',
    rating: 5,
    avatar: '/images/avatars/user3.jpg'
  }
];

// Methods
const navigateTo = (path) => {
  router.push(path);
};

const fetchFeaturedProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching featured products...');
    // Using the productApi.getFeaturedProducts() method
    const response = await productApi.getFeaturedProducts();
    console.log('API Response:', response);
    
    // Check if the response is successful based on the API documentation
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to fetch products');
    }
    
    // Extract products from the response based on API documentation
    let products = [];
    
    // Handle the specific response format we received
    if (response && response.products && Array.isArray(response.products)) {
      products = response.products;
      console.log('Found products array in response:', products.length);
    } else if (Array.isArray(response)) {
      products = response;
      console.log('Response is directly an array:', products.length);
    } else {
      console.error('Unexpected API response format:', response);
      throw new Error('Unexpected API response format');
    }
    
    // Filter only ACTIVE products
    products = products.filter(product => product.status === 'ACTIVE');
    console.log('After filtering for ACTIVE status:', products.length);
    
    // If we have products from the API, update the view
    if (products.length > 0) {
      // Map the API response to match the expected format for ProductCard component
      // Limit to exactly 3 products
      featuredProducts.value = products.slice(0, 3).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice || null,
        image: product.image || '/images/products/placeholder.png',
        rating: product.rating || 0,
        sold: product.sold || 0,
        stock: typeof product.stock === 'number' ? product.stock : 10,
        slug: product.slug || ''
      }));
    } else {
      // If no products were returned, keep using the fallback data
      console.log('No active products found, keeping fallback data');
    }
    
    console.log('Processed products:', featuredProducts.value);
    
  } catch (err) {
    console.error('Error fetching products:', err);
    
    // More specific error messages based on error type
    if (err.message && err.message.includes('network')) {
      error.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
    } else if (err.message && err.message.includes('timeout')) {
      error.value = 'Kết nối đến máy chủ quá lâu. Vui lòng thử lại sau.';
    } else {
      error.value = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
    }
    
    // We're already using fallback data, so no need to set it again here
  } finally {
    isLoading.value = false;
  }
};

const handleAddToCart = (product) => {
  // Additional custom handling if needed
  console.log('Product added to cart:', product);
};

// Helper functions
const getImageSrc = (image) => {
  if (!image) return ''; 
  
  // Check if it's already a base64 image
  if (image.startsWith('data:image')) {
    return image;
  }
  
  // Check if it's a relative path that needs the base URL
  if (image.startsWith('images/')) {
    return `/${image}`;
  }
  
  // Otherwise return as is
  return image;
};

// Lifecycle hooks
onMounted(() => {
  // Initialize with fallback data immediately to avoid empty state
  setFallbackProducts();
  
  // Then attempt to fetch from API
  fetchFeaturedProducts();
  
  // Initialize AOS animation library if it exists
  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      easing: 'ease-out',
      once: true
    });
  }
});

// Set fallback products to avoid empty state
const setFallbackProducts = () => {
  featuredProducts.value = [
    {
      id: 1,
      name: 'Sâm Ngọc Linh Tươi Premium',
      description: 'Sâm Ngọc Linh tươi nguyên củ, được thu hoạch và bảo quản theo tiêu chuẩn cao cấp.',
      price: 12000000,
      originalPrice: 15000000,
      image: '/images/products/sam-ngoc-linh-tuoi.png',
      rating: 5,
      sold: 42,
      stock: 10
    },
    {
      id: 2,
      name: 'Rượu Sâm Ngọc Linh 10 Năm',
      description: 'Rượu sâm được ngâm từ củ sâm Ngọc Linh 10 năm tuổi, mang đến hương vị đặc trưng.',
      price: 5000000,
      originalPrice: null,
      image: '/images/products/ruou-sam-ngoc-linh.png',
      rating: 4,
      sold: 68,
      stock: 25
    },
    {
      id: 3,
      name: 'Trà Sâm Ngọc Linh Hòa Tan',
      description: 'Trà hòa tan từ chiết xuất sâm Ngọc Linh, tiện lợi sử dụng hàng ngày.',
      price: 800000,
      originalPrice: 1000000,
      image: '/images/products/tra-sam-ngoc-linh.png',
      rating: 4,
      sold: 120,
      stock: 0
    }
  ];
};
</script>

<style scoped>
/* Neumorphic pill styling */
.neu-pill {
  transition: all 0.3s ease;
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.05),
    -4px -4px 8px rgba(255, 255, 255, 0.6);
}

.neu-pill:hover {
  transform: translateY(-2px);
  box-shadow: 
    6px 6px 10px rgba(0, 0, 0, 0.06),
    -6px -6px 10px rgba(255, 255, 255, 0.8);
}

/* Clay container styling for CTA */
.clay-container {
  position: relative;
  overflow: hidden;
}

/* Radial gradient for background */
.bg-gradient-radial {
  background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
}
</style> 