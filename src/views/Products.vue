<template>
  <div class="products-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Danh mục</h3>
            <div class="space-y-2">
              <button 
                @click="selectedCategory = null" 
                class="block w-full text-left px-3 py-2 rounded-md transition-colors"
                :class="!selectedCategory ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'"
              >
                Tất cả sản phẩm
              </button>
              <button 
                v-for="category in categories" 
                :key="category.id"
                @click="selectCategory(category.id)"
                class="block w-full text-left px-3 py-2 rounded-md transition-colors"
                :class="selectedCategory === category.id ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'"
              >
                {{ category.name }}
              </button>
            </div>
            
            <div class="mt-6 border-t pt-4">
              <h3 class="text-lg font-semibold mb-4">Giá</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-1" 
                    v-model="filters.price.under1m"
                    class="rounded text-green-600 focus:ring-green-500"
                  >
                  <label for="price-1" class="ml-2">Dưới 1 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-2" 
                    v-model="filters.price.from1mTo5m"
                    class="rounded text-green-600 focus:ring-green-500"
                  >
                  <label for="price-2" class="ml-2">1 - 5 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-3" 
                    v-model="filters.price.from5mTo10m"
                    class="rounded text-green-600 focus:ring-green-500"
                  >
                  <label for="price-3" class="ml-2">5 - 10 triệu</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="price-4" 
                    v-model="filters.price.above10m"
                    class="rounded text-green-600 focus:ring-green-500"
                  >
                  <label for="price-4" class="ml-2">Trên 10 triệu</label>
                </div>
              </div>
            </div>
            
            <div class="mt-6 border-t pt-4">
              <h3 class="text-lg font-semibold mb-4">Sắp xếp</h3>
              <select 
                v-model="sortOption" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến cao</option>
                <option value="priceDesc">Giá: Cao đến thấp</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
            
            <button 
              @click="resetFilters" 
              class="mt-6 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </aside>
        
        <!-- Products -->
        <main class="flex-1">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">
              {{ pageTitle }}
            </h1>
            <p class="text-gray-600">
              {{ products.length }} sản phẩm
            </p>
          </div>
          
          <!-- Loading state -->
          <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
            <p class="text-red-700">{{ error }}</p>
            <button 
              @click="fetchProducts" 
              class="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200"
            >
              Thử lại
            </button>
          </div>
          
          <!-- Empty state -->
          <div v-else-if="products.length === 0" class="bg-gray-50 p-8 rounded-md text-center">
            <p class="text-gray-500 mb-4">Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
            <button 
              @click="resetFilters" 
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Đặt lại bộ lọc
            </button>
          </div>
          
          <!-- Products list -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-card group flex flex-col h-full"
              data-aos="fade-up"
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
                  <span class="text-sm text-gray-500 ml-2">({{ product.rating || '4.5' }})</span>
                </div>
                <p class="product-description text-gray-600 mb-4 h-12 line-clamp-2">{{ product.description }}</p>
                <div class="flex flex-col mt-auto">
                  <!-- Price or "Hết hàng" text -->
                  <span v-if="product.stock > 0" class="product-price text-xl font-bold text-green-600 mb-2">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span v-else class="product-price text-xl font-bold text-red-500 mb-2">
                    Hết hàng
                  </span>
                  
                  <!-- Buttons based on stock -->
                  <div v-if="product.stock > 0" class="flex space-x-2">
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
                  <div v-else>
                    <button 
                      @click="contactUs" 
                      class="w-full h-10 px-2 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
                    >
                      <i class="fas fa-phone mr-1"></i> Liên hệ đặt hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div v-if="products.length > 0" class="flex justify-center mt-12">
            <div class="flex items-center space-x-1">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 0"
                :class="[
                  'px-3 py-1 rounded-md',
                  currentPage === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <template v-for="page in pageNumbers" :key="page">
                <button 
                  @click="goToPage(page - 1)"
                  :class="[
                    'px-3 py-1 rounded-md',
                    currentPage === page - 1 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages - 1"
                :class="[
                  'px-3 py-1 rounded-md',
                  currentPage >= totalPages - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'VNĐ')
}

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
  isLoading.value = true
  error.value = null
  
  try {
    // Build query params
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      status: 'ACTIVE' // Chỉ lấy sản phẩm đang bán
    }
    
    // Add sort parameter
    switch (sortOption.value) {
      case 'newest':
        params.sort = 'createdAt'
        params.direction = 'desc'
        break
      case 'priceAsc':
        params.sort = 'price'
        params.direction = 'asc'
        break
      case 'priceDesc':
        params.sort = 'price'
        params.direction = 'desc'
        break
      case 'popular':
        params.sort = 'sold'
        params.direction = 'desc'
        break
    }
    
    // Handle API call based on category filter
    let response
    
    try {
      if (selectedCategory.value) {
        response = await api.category.getCategoryProducts(selectedCategory.value, params)
      } else {
        response = await api.product.getProducts(params)
      }
      
      // Extract pagination info from the actual API response structure
      totalProducts.value = response.data.totalItems || 0
      totalPages.value = response.data.totalPages || 1
      currentPage.value = response.data.currentPage || 0
      
      // Map products using the actual API response structure
      const fetchedProducts = response.data.products || []
      
      // Apply price filters (client-side)
      let filteredProducts = fetchedProducts
      
      if (filters.value.price.under1m || 
          filters.value.price.from1mTo5m || 
          filters.value.price.from5mTo10m || 
          filters.value.price.above10m) {
        
        filteredProducts = fetchedProducts.filter(p => {
          if (filters.value.price.under1m && p.price < 1000000) return true
          if (filters.value.price.from1mTo5m && p.price >= 1000000 && p.price < 5000000) return true
          if (filters.value.price.from5mTo10m && p.price >= 5000000 && p.price < 10000000) return true
          if (filters.value.price.above10m && p.price >= 10000000) return true
          return false
        })
      }
      
      products.value = filteredProducts
        .filter(p => p.status === 'ACTIVE') // Đảm bảo chỉ hiển thị sản phẩm đang bán
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image ? (p.image.startsWith('http') ? p.image : `${import.meta.env.VITE_API_URL}${p.image}`) : defaultImage,
          rating: p.rating,
          slug: p.slug,
          categoryId: p.categoryId,
          stock: p.stock || 0,
          status: p.status
        }))
    } catch (e) {
      console.error('Error with main API endpoint, trying fallback:', e)
      // Try fallback with direct URL
      throw e
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Không thể tải sản phẩm. Vui lòng thử lại sau.'
    
    // Fallback data - chỉ hiển thị sản phẩm đang bán
    products.value = [
      {
        id: 1,
        name: 'Sâm Ngọc Linh tươi 10 năm tuổi',
        description: 'Sâm ngọc linh tươi có tuổi đời 10 năm, được thu hoạch từ vùng núi Ngọc Linh, giữ nguyên dược tính quý giá.',
        price: 15000000,
        originalPrice: 18000000,
        image: defaultImage,
        rating: 5.0,
        categoryId: 1,
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
        categoryId: 2,
        stock: 10,
        status: 'ACTIVE'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Filter and navigation methods
function selectCategory(categoryId) {
  selectedCategory.value = categoryId
  currentPage.value = 0 // Reset to first page
  fetchProducts()
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 