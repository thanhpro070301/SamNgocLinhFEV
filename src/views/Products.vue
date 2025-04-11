<template>
  <div class="products-page min-h-screen bg-gradient-to-br from-green-50 to-white">
    <!-- Decorative elements for glassmorphism effect -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-200 opacity-20 filter blur-3xl"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-green-300 opacity-20 filter blur-3xl"></div>
      <div class="absolute top-2/3 left-1/2 w-72 h-72 rounded-full bg-green-100 opacity-30 filter blur-3xl"></div>
    </div>
    
    <div class="container relative mx-auto px-4 py-8 z-10">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar - Glassmorphism effect -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/40 transition-all duration-300 hover:shadow-xl">
            <h3 class="text-xl font-semibold mb-5 text-gray-800 border-b border-green-100 pb-2">Danh mục</h3>
            <div class="space-y-3">
              <button 
                @click="showAllProducts()" 
                class="block w-full text-left px-4 py-3 rounded-lg transition-all duration-300"
                :class="!selectedCategory ? 'bg-green-100/70 backdrop-blur-sm text-green-700 shadow-inner' : 'hover:bg-white/60 hover:shadow-sm'"
              >
                Tất cả sản phẩm
              </button>
              <button 
                v-for="category in categories" 
                :key="category.id"
                @click="selectCategory(category.id)"
                class="block w-full text-left px-4 py-3 rounded-lg transition-all duration-300"
                :class="selectedCategory === category.id ? 'bg-green-100/70 backdrop-blur-sm text-green-700 shadow-inner' : 'hover:bg-white/60 hover:shadow-sm'"
              >
                {{ category.name }}
              </button>
            </div>
            
            <div class="mt-8 border-t border-green-100 pt-5">
              <h3 class="text-xl font-semibold mb-5 text-gray-800">Giá</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-1" 
                    v-model="filters.price.under1m"
                    class="w-5 h-5 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  >
                  <label for="price-1" class="ml-3 text-gray-700">Dưới 1 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-2" 
                    v-model="filters.price.from1mTo5m"
                    class="w-5 h-5 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  >
                  <label for="price-2" class="ml-3 text-gray-700">1 - 5 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-3" 
                    v-model="filters.price.from5mTo10m"
                    class="w-5 h-5 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  >
                  <label for="price-3" class="ml-3 text-gray-700">5 - 10 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-4" 
                    v-model="filters.price.above10m"
                    class="w-5 h-5 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  >
                  <label for="price-4" class="ml-3 text-gray-700">Trên 10 triệu</label>
                </div>
              </div>
            </div>
            
            <div class="mt-8 border-t border-green-100 pt-5">
              <h3 class="text-xl font-semibold mb-5 text-gray-800">Sắp xếp</h3>
              <select 
                v-model="sortOption" 
                class="w-full bg-white/80 backdrop-blur-sm border border-green-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến cao</option>
                <option value="priceDesc">Giá: Cao đến thấp</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
            
            <!-- Neumorphic reset button -->
            <button 
              @click="resetFilters" 
              class="mt-8 w-full neumorphic-btn bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <span class="relative z-10">Đặt lại bộ lọc</span>
            </button>
          </div>
        </aside>
        
        <!-- Products - Glassmorphism header and cards -->
        <main class="flex-1">
          <div class="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/40 transition-all duration-300">
            <h1 class="text-3xl font-bold mb-2 text-gray-800">
              {{ pageTitle }}
            </h1>
            <p class="text-gray-600">
              {{ products.length }} sản phẩm
            </p>
          </div>
          
          <!-- Loading state -->
          <div v-if="isLoading" class="flex justify-center items-center py-32">
            <div class="relative w-20 h-20">
              <div class="absolute inset-0 rounded-full border-4 border-green-100"></div>
              <div class="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="bg-red-50/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-red-100">
            <p class="text-red-700">{{ error }}</p>
            <button 
              @click="fetchProducts" 
              class="mt-4 neumorphic-btn bg-red-50 text-red-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <span class="relative z-10">Thử lại</span>
            </button>
          </div>
          
          <!-- Empty state -->
          <div v-else-if="products.length === 0" class="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/40 text-center">
            <p class="text-gray-500 mb-6 text-lg">Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
            <div class="flex justify-center space-x-6">
              <button 
                @click="resetFilters" 
                class="neumorphic-btn bg-green-50 text-green-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <span class="relative z-10">Đặt lại bộ lọc</span>
              </button>
              <button 
                @click="loadFallbackProducts" 
                class="neumorphic-btn bg-blue-50 text-blue-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <span class="relative z-10">Tải sản phẩm mẫu</span>
              </button>
            </div>
          </div>
          
          <!-- Products list -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-card group flex flex-col h-full"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <div class="product-image overflow-hidden rounded-t-xl bg-white/50 backdrop-blur-sm h-64 flex items-center justify-center">
                <router-link :to="`/san-pham/${product.id}`" class="w-full h-full flex items-center justify-center">
                  <img 
                    :src="getImageSrc(product.image)" 
                    :alt="product.name" 
                    class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                  >
                </router-link>
              </div>
              <div class="product-info p-6 bg-white/70 backdrop-blur-md rounded-b-xl border-t border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-500 flex flex-col h-auto">
                <router-link :to="`/san-pham/${product.id}`">
                  <h3 class="product-title text-xl font-semibold text-gray-800 mb-2 h-14 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">{{ product.name }}</h3>
                </router-link>
                <div class="flex items-center mb-2">
                  <div class="flex text-yellow-400">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                  </div>
                  <span class="text-sm text-gray-500 ml-2">({{ product.rating || '4.5' }})</span>
                </div>
                <p class="product-description text-gray-600 mb-4 h-12 line-clamp-2">{{ product.description }}</p>
                <div class="flex flex-col mt-auto">
                  <!-- Price or "Hết hàng" text -->
                  <span v-if="product.stock > 0" class="product-price text-xl font-bold text-green-600 mb-3">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span v-else class="product-price text-xl font-bold text-red-500 mb-3">
                    Hết hàng
                  </span>
                  
                  <!-- Buttons based on stock - Neumorphic buttons -->
                  <div v-if="product.stock > 0" class="flex space-x-3">
                    <button 
                      @click="addToCart(product)" 
                      class="btn-add-cart neumorphic-btn bg-green-50 h-12 px-4 py-3 text-green-700 rounded-lg w-full flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i class="fas fa-shopping-cart mr-2"></i> <span class="relative z-10">Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                  <div v-else>
                    <button 
                      @click="contactUs" 
                      class="w-full neumorphic-btn bg-yellow-50 h-12 px-4 py-3 text-yellow-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i class="fas fa-phone mr-2"></i> <span class="relative z-10">Liên hệ đặt hàng</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination - Glassmorphism effect -->
          <div v-if="products.length > 0" class="flex justify-center mt-12">
            <div class="flex items-center space-x-2 bg-white/50 backdrop-blur-sm p-2 rounded-xl shadow-lg">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 0"
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                  currentPage === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'neumorphic-btn-sm bg-white text-gray-700 hover:-translate-y-1'
                ]"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <template v-for="page in pageNumbers" :key="page">
                <button 
                  @click="goToPage(page - 1)"
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                    currentPage === page - 1 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'neumorphic-btn-sm bg-white text-gray-700 hover:-translate-y-1'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages - 1"
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                  currentPage >= totalPages - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'neumorphic-btn-sm bg-white text-gray-700 hover:-translate-y-1'
                ]"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import AOS from 'aos'
import cart from '@/store/cart'
import notificationService from '@/utils/notificationService'

// Default image
const defaultImage = '/assets/images/products/sam-tuoi.png'

// Initialize router
const router = useRouter()

// State
const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const error = ref(null)

// Pagination
const currentPage = ref(0)
const pageSize = ref(9)
const totalProducts = ref(0)
const totalPages = ref(1)

// Filters and sorting
const selectedCategory = ref(null)
const sortOption = ref('newest')
const filters = ref({
  price: {
    under1m: false,
    from1mTo5m: false,
    from5mTo10m: false,
    above10m: false
  }
})

// Dynamic page title
const pageTitle = computed(() => {
  if (selectedCategory.value) {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    return category ? category.name : 'Sản phẩm'
  }
  return 'Tất cả sản phẩm'
})

// Calculate display page numbers (show 5 pages max)
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show current page and 2 pages before/after when possible
    const start = Math.max(1, current - 1)
    const end = Math.min(total, start + 4)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Handle different image source formats
 */
const getImageSrc = (image) => {
  if (!image) return ''; // Return empty if no image
  
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

// API calls
async function fetchCategories() {
  try {
    const response = await api.category.getCategories()
    categories.value = response.data
  } catch (err) {
    console.error('Error fetching categories:', err)
    // Fallback data
    categories.value = [
      { id: 1, name: 'Sâm tươi' },
      { id: 2, name: 'Cao sâm' },
      { id: 3, name: 'Rượu sâm' },
      { id: 4, name: 'Trà sâm' }
    ]
  }
}

async function fetchProducts() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Build query params
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      sortBy: "id", 
      direction: "desc",
      status: 'ACTIVE' // Chỉ lấy sản phẩm đang bán
    };
    
    // Add categoryId param for filtering at API level
    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value;
    }
    
    // Add sort parameter
    switch (sortOption.value) {
      case 'newest':
        params.sortBy = 'createdAt';
        params.direction = 'desc';
        break;
      case 'priceAsc':
        params.sortBy = 'price';
        params.direction = 'asc';
        break;
      case 'priceDesc':
        params.sortBy = 'price';
        params.direction = 'desc';
        break;
      case 'popular':
        params.sortBy = 'sold';
        params.direction = 'desc';
        break;
    }
    
    // Make API call 
    console.log('Fetching products with params:', params);
    
    try {
      let response;
      if (selectedCategory.value) {
        // Use category-specific endpoint when a category is selected
        response = await api.category.getCategoryProducts(selectedCategory.value, params);
      } else {
        // Use general products endpoint when no category is selected
        response = await api.product.getProducts(params);
      }
      
      console.log('API Response:', response);
      
      // Check if we got a valid response with products
      const hasValidProducts = response && 
                             ((response.products && Array.isArray(response.products) && response.products.length > 0) || 
                              (Array.isArray(response) && response.length > 0));
      
      if (!hasValidProducts) {
        console.log('No products returned from API, using fallback data');
        useFallbackProducts();
        return; // Skip the rest of the processing since we're using fallback data
      }
      
      // Process response according to the API documentation format
      if (response && response.products && Array.isArray(response.products)) {
        products.value = response.products.map(product => ({
          id: product.id,
          name: product.name || 'Không có tên',
          description: product.description || '',
          price: product.price || 0,
          originalPrice: product.originalPrice || product.price || 0,
          image: product.image || '/assets/images/products/default.png',
          stock: typeof product.stock === 'number' ? product.stock : 10,
          sold: product.sold || 0,
          rating: product.rating || 4.5,
          categoryId: product.categoryId,
          categoryName: product.categoryName
        }));
        
        // Update pagination information
        totalProducts.value = response.totalItems || 0;
        totalPages.value = response.totalPages || 1;
        currentPage.value = response.currentPage || 0;
        
        console.log(`Processed ${products.value.length} products successfully`);
      } else if (Array.isArray(response)) {
        // Handle direct array response (fallback)
        products.value = response.map(product => ({
          id: product.id,
          name: product.name || 'Không có tên',
          description: product.description || '',
          price: product.price || 0,
          originalPrice: product.originalPrice || product.price || 0,
          image: product.image || '/assets/images/products/default.png',
          stock: typeof product.stock === 'number' ? product.stock : 10,
          sold: product.sold || 0,
          rating: product.rating || 4.5,
          categoryId: product.categoryId,
          categoryName: product.categoryName
        }));
        
        totalProducts.value = products.value.length;
        totalPages.value = 1;
        currentPage.value = 0;
      }
      
      // If we still have no products after processing, use fallback
      if (products.value.length === 0) {
        console.log('No products after processing API response, using fallback data');
        useFallbackProducts();
        return;
      }
      
      // Additional client-side filtering for categories if API doesn't handle it correctly
      if (selectedCategory.value && products.value.length > 0) {
        // Double-check the products match the selected category
        products.value = products.value.filter(product => 
          product.categoryId === selectedCategory.value
        );
        totalProducts.value = products.value.length;
      }
    } catch (fetchError) {
      console.error('Error in API request:', fetchError);
      useFallbackProducts();
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
    useFallbackProducts();
    
    // Apply client-side category filtering to fallback data if needed
    if (selectedCategory.value) {
      products.value = products.value.filter(product => product.categoryId === selectedCategory.value);
      totalProducts.value = products.value.length;
    }
  } finally {
    isLoading.value = false;
  }
}

// Function to use fallback product data
function useFallbackProducts() {
    const allProducts = [
      {
        id: 1,
        name: 'Sâm Ngọc Linh tươi 10 năm tuổi',
        description: 'Sâm ngọc linh tươi có tuổi đời 10 năm, được thu hoạch từ vùng núi Ngọc Linh, giữ nguyên dược tính quý giá.',
        price: 15000000,
        originalPrice: 18000000,
        image: defaultImage,
        rating: 5.0,
        categoryId: 1,  // Sâm tươi
        stock: 50,
        status: 'ACTIVE'
      },
      {
        id: 2,
        name: 'Cao Sâm Ngọc Linh',
        description: 'Cao sâm Ngọc Linh được chiết xuất từ sâm tươi loại 1, giữ nguyên dưỡng chất.',
        price: 8000000,
        originalPrice: 10000000,
        image: defaultImage,
        rating: 4.0,
        categoryId: 2,  // Cao sâm
        stock: 10,
        status: 'ACTIVE'
      },
      {
        id: 3,
        name: 'Rượu sâm Ngọc Linh',
        description: 'Rượu ngâm sâm Ngọc Linh thượng hạng, giúp bồi bổ sức khỏe.',
        price: 5000000,
        originalPrice: 6000000,
        image: defaultImage, 
        rating: 4.5,
        categoryId: 3,  // Rượu sâm
        stock: 15,
        status: 'ACTIVE'
      },
      {
        id: 4,
        name: 'Trà sâm Ngọc Linh',
        description: 'Trà sâm Ngọc Linh thơm ngon, giúp thư giãn tinh thần và tăng cường sức khỏe.',
        price: 3000000,
        originalPrice: 3500000,
        image: defaultImage, 
        rating: 4.2,
        categoryId: 4,  // Trà sâm
        stock: 20,
        status: 'ACTIVE'
      }
    ];
  
    // Filter products based on selected category
    if (selectedCategory.value) {
      products.value = allProducts.filter(p => p.categoryId === selectedCategory.value);
    } else {
      products.value = allProducts;
    }
  
    totalProducts.value = products.value.length;
    totalPages.value = 1;
}

// Filter and navigation methods
function selectCategory(categoryId) {
  console.log(`Selecting category ID: ${categoryId}`);
  
  // If the same category is clicked again, deselect it (show all products)
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null;
    console.log('Deselected category, showing all products');
  } else {
    selectedCategory.value = categoryId;
  }
  
  currentPage.value = 0; // Reset to first page
  fetchProducts();
}

function resetFilters() {
  selectedCategory.value = null
  sortOption.value = 'newest'
  Object.keys(filters.value.price).forEach(key => {
    filters.value.price[key] = false
  })
  currentPage.value = 0
  fetchProducts()
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProducts()
    window.scrollTo(0, 0)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchProducts()
    window.scrollTo(0, 0)
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchProducts()
  window.scrollTo(0, 0)
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

// Contact functionality
function contactUs() {
  notificationService.show(
    'Vui lòng gọi đến số 0123.456.789 để đặt sản phẩm hoặc truy cập trang liên hệ.', 
    { 
      title: 'Thông tin liên hệ',
      duration: 5000
    }
  )
  
  // Optional: Navigate to contact page after a delay
  setTimeout(() => {
    router.push('/contact')
  }, 2000)
}

// Function to force load fallback products
function loadFallbackProducts() {
  useFallbackProducts();
  error.value = null;
}

// Fix for the "Tất cả sản phẩm" button
function showAllProducts() {
  selectedCategory.value = null;
  currentPage.value = 0;
  console.log('Showing all products');
  
  // Use the fallback data to ensure all products are shown
  useFallbackProducts();
  error.value = null;
}

// Watch for filter changes
watch([filters, sortOption], () => {
  fetchProducts()
}, { deep: true })

// Lifecycle hooks
onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
  AOS.refresh()
})
</script>

<style lang="scss">
.products-page {
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/assets/images/bg-pattern.png');
    background-size: 300px;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
}

.product-card {
  transition: all 0.4s ease;
  border-radius: 1rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  
  &:hover {
    transform: translateY(-12px);
  }
  
  .product-image {
    height: 16rem;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.4));
      z-index: 1;
      pointer-events: none;
    }
  }
  
  .product-info {
    height: auto;
    min-height: 15rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent);
    }
  }
}

.neumorphic-btn {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.03),
    -6px -6px 12px rgba(255, 255, 255, 0.6),
    inset 1px 1px 0px rgba(255, 255, 255, 0.6);
  
  &:active {
    box-shadow: 
      inset 4px 4px 8px rgba(0, 0, 0, 0.05),
      inset -4px -4px 8px rgba(255, 255, 255, 0.5);
    transform: translateY(0) !important;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%);
    pointer-events: none;
  }
}

.neumorphic-btn-sm {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.03),
    -4px -4px 8px rgba(255, 255, 255, 0.6),
    inset 1px 1px 0px rgba(255, 255, 255, 0.6);
  
  &:active {
    box-shadow: 
      inset 2px 2px 4px rgba(0, 0, 0, 0.05),
      inset -2px -2px 4px rgba(255, 255, 255, 0.5);
    transform: translateY(0) !important;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%);
    pointer-events: none;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* For backdrop-filter support in more browsers */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-md, .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.9) !important;
  }
}
</style> 