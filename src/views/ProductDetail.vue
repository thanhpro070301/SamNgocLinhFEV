<template>
  <div class="product-detail">
    <!-- Loading state -->
    <div v-if="isLoading" class="container mx-auto px-4 py-20 flex justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="container mx-auto px-4 py-10">
      <div class="bg-red-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-red-700 mb-2">Lỗi</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <div class="flex space-x-4">
          <button 
            @click="fetchProduct" 
            class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Thử lại
          </button>
          <router-link 
            to="/products" 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Quay lại trang sản phẩm
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Product content -->
    <div v-else-if="product" class="container mx-auto px-4 py-10">
      <nav class="text-sm mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-green-600">Trang chủ</router-link>
          </li>
          <li>
            <span class="text-gray-500">/</span>
          </li>
          <li>
            <router-link to="/products" class="text-gray-500 hover:text-green-600">Sản phẩm</router-link>
          </li>
          <li>
            <span class="text-gray-500">/</span>
          </li>
          <li>
            <span class="text-gray-900 font-medium">{{ product.name }}</span>
          </li>
        </ol>
      </nav>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Product images -->
        <div data-aos="fade-right">
          <div class="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-auto object-contain"
              style="max-height: 500px;"
            >
          </div>
          
          <!-- Additional images or thumbnails would go here -->
          <div class="hidden mt-4 grid grid-cols-4 gap-2">
            <div class="cursor-pointer border rounded overflow-hidden">
              <img :src="product.image" alt="" class="w-full h-20 object-cover">
            </div>
          </div>
        </div>
        
        <!-- Product info -->
        <div data-aos="fade-left">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <span class="text-sm text-gray-500 ml-2">({{ product.rating || '4.5' }})</span>
            <span class="mx-4 text-gray-300">|</span>
            <span class="text-sm text-gray-500">Đã bán: {{ product.sold || '0' }}</span>
          </div>
          
          <div class="mb-6">
            <span class="text-3xl font-bold text-green-600">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="ml-3 text-lg text-gray-400 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
              {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% giảm
            </span>
          </div>
          
          <div class="border-t border-b py-6 my-6">
            <div class="mb-4">
              <h3 class="text-gray-700 font-medium mb-2">Mô tả sản phẩm</h3>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>
            
            <div class="flex flex-col space-y-4 mt-6">
              <div class="flex items-center">
                <span class="w-32 text-gray-700">Danh mục:</span>
                <span class="text-gray-600">{{ getCategoryName(product.categoryId) }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-32 text-gray-700">Trạng thái:</span>
                <span v-if="product.stock > 0" class="text-green-600">Còn hàng</span>
                <span v-else class="text-red-600">Hết hàng</span>
              </div>
              <div class="flex items-center">
                <span class="w-32 text-gray-700">Xuất xứ:</span>
                <span class="text-gray-600">Kon Tum, Việt Nam</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center mb-6">
            <div class="mr-5">
              <label for="quantity" class="text-gray-700 font-medium block mb-2">Số lượng</label>
              <div class="flex border rounded overflow-hidden">
                <button 
                  @click="decreaseQuantity" 
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  :disabled="quantity <= 1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <input 
                  id="quantity" 
                  v-model.number="quantity" 
                  type="number" 
                  min="1" 
                  max="99" 
                  class="w-16 text-center border-x focus:outline-none py-1"
                >
                <button 
                  @click="increaseQuantity" 
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  :disabled="product.stock === 0 || quantity >= product.stock"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div v-if="product.stock > 0" class="text-sm text-gray-500">
              Còn {{ product.stock }} sản phẩm
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button 
              @click="addToCart" 
              class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              :disabled="product.stock === 0"
              :class="{ 'opacity-50 cursor-not-allowed': product.stock === 0 }"
            >
              <i class="fas fa-shopping-cart mr-2"></i> Thêm vào giỏ hàng
            </button>
            <button 
              @click="buyNow"
              class="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
              :disabled="product.stock === 0"
              :class="{ 'opacity-50 cursor-not-allowed': product.stock === 0 }"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
      
      <!-- Product details tabs -->
      <div class="mt-16" data-aos="fade-up">
        <div class="border-b mb-6">
          <div class="flex space-x-8">
            <button 
              @click="activeTab = 'description'" 
              class="py-2 px-4 font-medium transition-colors border-b-2"
              :class="activeTab === 'description' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600'"
            >
              Chi tiết sản phẩm
            </button>
            <button 
              @click="activeTab = 'specification'" 
              class="py-2 px-4 font-medium transition-colors border-b-2"
              :class="activeTab === 'specification' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600'"
            >
              Thông số kỹ thuật
            </button>
            <button 
              @click="activeTab = 'reviews'" 
              class="py-2 px-4 font-medium transition-colors border-b-2"
              :class="activeTab === 'reviews' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-green-600'"
            >
              Đánh giá ({{ reviews.length }})
            </button>
          </div>
        </div>
        
        <div v-if="activeTab === 'description'" class="prose prose-green max-w-none">
          <div v-if="product.longDescription" v-html="product.longDescription"></div>
          <div v-else>
            <h3>Giới thiệu sản phẩm {{ product.name }}</h3>
            <p>{{ product.description }}</p>
            
            <h3 class="mt-8">Công dụng</h3>
            <p>Sâm Ngọc Linh có tác dụng bồi bổ cơ thể, tăng cường sức đề kháng, chống mệt mỏi, tăng cường hệ miễn dịch. Đây là một trong những loại dược liệu quý nhất của Việt Nam.</p>
            
            <h3 class="mt-8">Hướng dẫn sử dụng</h3>
            <ul>
              <li>Dùng trực tiếp: Có thể ngâm rượu hoặc ngâm mật ong để sử dụng</li>
              <li>Dùng để sắc thuốc: Kết hợp với các vị thuốc khác để sắc uống</li>
              <li>Liều dùng: Tùy theo thể trạng và mục đích sử dụng</li>
            </ul>
            
            <h3 class="mt-8">Bảo quản</h3>
            <p>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp và độ ẩm cao. Nhiệt độ bảo quản tốt nhất từ 15-25 độ C.</p>
          </div>
        </div>
        
        <div v-else-if="activeTab === 'specification'" class="bg-white p-6 rounded-lg shadow-sm">
          <table class="w-full">
            <tbody>
              <tr class="border-b">
                <td class="py-3 text-gray-600 w-1/3">Xuất xứ</td>
                <td class="py-3 font-medium">Kon Tum, Việt Nam</td>
              </tr>
              <tr class="border-b">
                <td class="py-3 text-gray-600">Thương hiệu</td>
                <td class="py-3 font-medium">Sâm Ngọc Linh Kon Tum</td>
              </tr>
              <tr class="border-b">
                <td class="py-3 text-gray-600">Loại sản phẩm</td>
                <td class="py-3 font-medium">{{ getCategoryName(product.categoryId) }}</td>
              </tr>
              <tr class="border-b">
                <td class="py-3 text-gray-600">Hạn sử dụng</td>
                <td class="py-3 font-medium">24 tháng kể từ ngày sản xuất</td>
              </tr>
              <tr class="border-b">
                <td class="py-3 text-gray-600">Trọng lượng</td>
                <td class="py-3 font-medium">{{ product.weight || '100g' }}</td>
              </tr>
              <tr>
                <td class="py-3 text-gray-600">Tiêu chuẩn</td>
                <td class="py-3 font-medium">Đạt tiêu chuẩn VSATTP</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else-if="activeTab === 'reviews'">
          <div v-if="reviews.length === 0" class="text-center py-10 bg-gray-50 rounded-lg">
            <i class="fas fa-comment-slash text-gray-400 text-4xl mb-4"></i>
            <h3 class="text-xl font-medium text-gray-700 mb-2">Chưa có đánh giá nào</h3>
            <p class="text-gray-500 mb-4">Hãy là người đầu tiên đánh giá sản phẩm này</p>
            <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Viết đánh giá
            </button>
          </div>
          
          <div v-else>
            <div v-for="review in reviews" :key="review.id" class="border-b py-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                    {{ review.userName.charAt(0) }}
                  </div>
                </div>
                <div class="flex-grow">
                  <h4 class="font-medium">{{ review.userName }}</h4>
                  <div class="flex text-yellow-400 text-sm mt-1">
                    <i v-for="i in 5" :key="i" 
                       :class="[i <= review.rating ? 'fas fa-star' : 'far fa-star']"></i>
                  </div>
                  <div class="mt-2 text-sm text-gray-500">
                    {{ new Date(review.date).toLocaleDateString('vi-VN') }}
                  </div>
                  <p class="mt-3 text-gray-700">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related products -->
      <div class="mt-16" data-aos="fade-up" data-aos-delay="200">
        <h2 class="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        
        <div v-if="isLoadingRelated" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
        
        <div v-else-if="relatedProducts.length === 0" class="text-center py-10 bg-gray-50 rounded-lg">
          <p class="text-gray-500">Không tìm thấy sản phẩm liên quan</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            class="group"
          >
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <router-link :to="`/product/${relatedProduct.id}`">
                <div class="h-48 overflow-hidden">
                  <img 
                    :src="relatedProduct.image" 
                    :alt="relatedProduct.name"
                    class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  >
                </div>
              </router-link>
              <div class="p-4">
                <router-link :to="`/product/${relatedProduct.id}`">
                  <h3 class="font-medium text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {{ relatedProduct.name }}
                  </h3>
                </router-link>
                <div class="text-green-600 font-bold">
                  {{ formatPrice(relatedProduct.price) }}
                </div>
                <button 
                  @click="addToCartQuick(relatedProduct)"
                  class="mt-3 w-full py-2 bg-gray-100 hover:bg-green-600 hover:text-white text-gray-700 rounded text-sm transition-colors"
                >
                  <i class="fas fa-cart-plus mr-1"></i> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import AOS from 'aos'

const route = useRoute()
const router = useRouter()

// Default image
const defaultImage = '/assets/images/products/sam-tuoi.png'

// State
const product = ref(null)
const isLoading = ref(true)
const error = ref(null)
const quantity = ref(1)
const activeTab = ref('description')

// Related products
const relatedProducts = ref([])
const isLoadingRelated = ref(false)

// Placeholder reviews (in a real app, you'd fetch these from an API)
const reviews = ref([
  {
    id: 1,
    userName: 'Nguyễn Văn A',
    rating: 5,
    date: '2023-05-15',
    comment: 'Sản phẩm chất lượng cao, đóng gói cẩn thận. Mình đã dùng được một tuần và cảm thấy rất tốt. Sẽ mua lại!'
  },
  {
    id: 2,
    userName: 'Trần Thị B',
    rating: 4,
    date: '2023-04-22',
    comment: 'Hàng đúng như mô tả, giao hàng nhanh. Đã mua nhiều lần và vẫn tin tưởng shop.'
  }
])

// Categories for matching category names
const categories = ref([
  { id: 1, name: 'Sâm tươi' },
  { id: 2, name: 'Cao sâm' },
  { id: 3, name: 'Rượu sâm' },
  { id: 4, name: 'Trà sâm' }
])

// Helper function to format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price).replace('₫', 'VNĐ')
}

// Get category name from id
function getCategoryName(categoryId) {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Sâm Ngọc Linh'
}

// Fetch product data
async function fetchProduct() {
  isLoading.value = true
  error.value = null
  
  try {
    const productId = route.params.id
    const response = await api.product.getProduct(productId)
    
    // Map API response to product object
    product.value = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      longDescription: response.data.longDescription,
      price: response.data.price,
      originalPrice: response.data.originalPrice,
      image: response.data.image || defaultImage,
      rating: response.data.rating || 4.5,
      sold: response.data.sold || 0,
      stock: response.data.stock || 10,
      categoryId: response.data.categoryId,
      weight: response.data.weight
    }
    
    // Also fetch categories if they haven't been fetched yet
    if (categories.value.length === 0) {
      fetchCategories()
    }
    
    // After successfully fetching the product, fetch related products
    fetchRelatedProducts(response.data.categoryId)
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.'
    
    // Fallback data for development
    product.value = {
      id: route.params.id,
      name: 'Sâm Ngọc Linh Tươi',
      description: 'Sâm ngọc linh tươi được thu hoạch từ vùng núi Ngọc Linh, có tuổi đời từ 10-15 năm.',
      price: 2500000,
      originalPrice: 3000000,
      image: defaultImage,
      rating: 4.5,
      sold: 124,
      stock: 10,
      categoryId: 1
    }
  } finally {
    isLoading.value = false
  }
}

// Fetch categories (could be moved to a global store in a real app)
async function fetchCategories() {
  try {
    const response = await api.category.getCategories()
    categories.value = response.data
  } catch (err) {
    console.error('Error fetching categories:', err)
    // We already have fallback categories defined
  }
}

// Fetch related products
async function fetchRelatedProducts(categoryId) {
  if (!categoryId) return
  
  isLoadingRelated.value = true
  
  try {
    // Get products from the same category, limit to 4
    const params = {
      page: 0,
      size: 4
    }
    
    const response = await api.category.getCategoryProducts(categoryId, params)
    
    // Map and filter out the current product
    relatedProducts.value = response.data.products
      .filter(p => p.id !== product.value.id)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image || defaultImage
      }))
      .slice(0, 4) // Ensure we only have 4 products max
      
    // If we don't have enough related products, get some from any category
    if (relatedProducts.value.length < 4) {
      const moreParams = {
        page: 0,
        size: 4 - relatedProducts.value.length
      }
      
      const moreResponse = await api.product.getProducts(moreParams)
      
      const moreProducts = moreResponse.data.products
        .filter(p => p.id !== product.value.id && !relatedProducts.value.some(rp => rp.id === p.id))
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || defaultImage
        }))
        
      relatedProducts.value = [...relatedProducts.value, ...moreProducts]
    }
  } catch (err) {
    console.error('Error fetching related products:', err)
    
    // Fallback data
    relatedProducts.value = [
      {
        id: 2,
        name: 'Cao Sâm Ngọc Linh',
        price: 1800000,
        image: defaultImage
      },
      {
        id: 3,
        name: 'Rượu Sâm Ngọc Linh',
        price: 1500000,
        image: defaultImage
      },
      {
        id: 4,
        name: 'Trà Sâm Ngọc Linh',
        price: 800000,
        image: defaultImage
      }
    ]
  } finally {
    isLoadingRelated.value = false
  }
}

// Quantity management
function increaseQuantity() {
  if (product.value && product.value.stock > quantity.value) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Cart functions
function addToCart() {
  if (!product.value) return
  
  // In a real app, this would call a store method to add to cart
  alert(`Đã thêm ${quantity.value} sản phẩm "${product.value.name}" vào giỏ hàng!`)
}

function addToCartQuick(relatedProduct) {
  // In a real app, this would call a store method to add to cart
  alert(`Đã thêm sản phẩm "${relatedProduct.name}" vào giỏ hàng!`)
}

function buyNow() {
  if (!product.value) return
  
  // In a real app, this would add to cart then redirect to checkout
  alert(`Đang chuyển đến trang thanh toán cho ${quantity.value} sản phẩm "${product.value.name}"`)
  // router.push('/checkout')
}

// Watch for route changes to reload the product when navigating between product pages
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    fetchProduct()
    window.scrollTo(0, 0)
  }
})

// Lifecycle
onMounted(() => {
  fetchProduct()
  AOS.refresh()
})
</script>

<style lang="scss">
.prose {
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    
    li {
      margin-bottom: 0.5rem;
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