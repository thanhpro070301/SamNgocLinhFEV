<template>
  <div class="product-detail min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Loading state -->
      <div v-if="isLoading" class="container mx-auto px-4 py-20 flex justify-center">
        <div class="relative">
          <div class="w-20 h-20 border-4 border-green-100 rounded-full"></div>
          <div class="absolute top-0 left-0 w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="container mx-auto px-4 py-10">
        <div class="error-container bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-red-100 text-center py-16">
          <div class="mb-6 w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Lỗi kết nối</h3>
          <p class="text-red-600 mb-6 max-w-md mx-auto">{{ error }}</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NeuButton 
              @click="fetchProduct" 
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
              Quay lại trang sản phẩm
            </NeuButton>
          </div>
        </div>
      </div>
      
      <!-- Product content -->
      <div v-else-if="product" class="container mx-auto px-4 py-10">
        <nav class="text-sm mb-6" aria-label="Breadcrumb" data-aos="fade-down">
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
            <div class="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/30">
              <img 
                :src="getImageSrc(product.image)" 
                :alt="product.name" 
                class="w-full h-auto object-contain"
                style="max-height: 500px;"
                @error="$event.target.src = defaultImage"
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
            
            <div class="border-t border-b py-6 my-6 border-white/20">
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
                <div class="flex items-center">
                <div class="flex border rounded-full overflow-hidden bg-white/70 backdrop-blur-sm">
                  <button 
                    @click="decreaseQuantity" 
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                    :disabled="quantity <= 1"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    id="quantity" 
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                      :max="product.stock" 
                    class="w-16 text-center border-x focus:outline-none py-1 bg-transparent"
                      @input="validateQuantity"
                  >
                  <button 
                    @click="increaseQuantity" 
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                    :disabled="product.stock === 0 || quantity >= product.stock"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                  <div v-if="product.stock > 0" class="ml-4 text-sm text-gray-500">
                    Còn {{ product.stock }} sản phẩm
                  </div>
              </div>
              </div>
            </div>
            
            <div class="flex space-x-4">
              <NeuButton 
                @click="addToCart" 
                variant="secondary"
                :disabled="product.stock === 0"
              >
                <template #icon-left>
                  <i class="fas fa-shopping-cart"></i>
                </template>
                Thêm vào giỏ hàng
              </NeuButton>
              <NeuButton 
                @click="buyNow"
                variant="primary"
                :disabled="product.stock === 0"
              >
                Mua ngay
              </NeuButton>
            </div>
          </div>
        </div>
        
        <!-- Product details tabs -->
        <div class="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-lg" data-aos="fade-up">
          <div class="border-b mb-6 border-gray-100">
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
          
          <div v-else-if="activeTab === 'specification'" class="bg-white/80 rounded-lg">
            <table class="w-full">
              <tbody>
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-600 w-1/3">Xuất xứ</td>
                  <td class="py-3 font-medium">Kon Tum, Việt Nam</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-600">Thương hiệu</td>
                  <td class="py-3 font-medium">Sâm Ngọc Linh Kon Tum</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-600">Loại sản phẩm</td>
                  <td class="py-3 font-medium">{{ getCategoryName(product.categoryId) }}</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-600">Hạn sử dụng</td>
                  <td class="py-3 font-medium">24 tháng kể từ ngày sản xuất</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-600">Trọng lượng</td>
                  <td class="py-3 font-medium">{{ product.weight || '100g' }}</td>
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
        
        <!-- Related Products Section -->
        <div class="related-products py-20 relative z-10" data-aos="fade-up">
          <div class="container mx-auto">
            <!-- Section Header -->
            <div class="section-header text-center mb-16">
              <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 bg-green-100/70 backdrop-blur-sm">
                Sản phẩm liên quan
              </span>
              <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-800">Có Thể Bạn Cũng Thích</h2>
              <p class="text-gray-600 max-w-2xl mx-auto">
                Các sản phẩm tương tự có thể phù hợp với nhu cầu của bạn.
              </p>
            </div>
            
            <!-- Product Grid -->
            <div v-if="relatedProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div 
                v-for="(relatedProduct, index) in relatedProducts" 
                :key="relatedProduct.id"
                data-aos="fade-up"
                :data-aos-delay="index * 100"
              >
                <ProductCard :product="relatedProduct" @add-to-cart="handleAddToCart" />
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500">
              Không có sản phẩm liên quan.
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
import notificationService from '@/utils/notificationService'
import cart from '@/store/cart'
import AuroraBackground from '@/components/AuroraBackground.vue'
import ProductCard from '@/components/ProductCard.vue'
import NeuButton from '@/components/NeuButton.vue'

const route = useRoute()
const router = useRouter()

// Navigation helper
const navigateTo = (path) => {
  router.push(path)
}

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
  isLoading.value = true;
  error.value = null;
  
  try {
    const productId = route.params.id;
    const response = await api.product.getProduct(productId);
    
    console.log('Product API Response:', response);
    
    // Check if the response is valid
    if (!response) {
      throw new Error('No data received from API');
    }
    
    // Try to extract product data from different response formats
    let productData = null;
    
    // Handle various response formats
    if (response.data) {
      // Most common format: { data: { product details } }
      productData = response.data;
    } else if (response.id !== undefined && response.name) {
      // Direct product object in response
      productData = response;
    } else if (typeof response === 'object') {
      // Look for product-like properties in response
      const possibleProductProps = ['product', 'item', 'result'];
      
      for (const prop of possibleProductProps) {
        if (response[prop] && typeof response[prop] === 'object' && response[prop].id !== undefined) {
          productData = response[prop];
          break;
        }
      }
      
      // Last resort: check if any property is an object with product-like properties
      if (!productData) {
        for (const key of Object.keys(response)) {
          const value = response[key];
          if (value && typeof value === 'object' && value.id !== undefined && value.name && value.price !== undefined) {
            productData = value;
            break;
          }
        }
      }
    }
    
    // If we still couldn't find product data, throw an error
    if (!productData) {
      console.error('Could not extract product data from response:', response);
      throw new Error('Invalid product data format');
    }
    
    // Map API response to product object with defaults for missing properties
    product.value = {
      id: productData.id,
      name: productData.name || 'Sản phẩm Sâm Ngọc Linh',
      description: productData.description || 'Mô tả đang được cập nhật',
      longDescription: productData.longDescription || productData.description || 'Mô tả chi tiết đang được cập nhật',
      price: typeof productData.price === 'number' ? productData.price : (typeof productData.price === 'string' ? parseFloat(productData.price) : 0),
      originalPrice: productData.originalPrice || productData.price || 0,
      image: productData.image 
        ? (productData.image.startsWith('http') 
          ? productData.image 
          : `${import.meta.env.VITE_API_URL || ''}${productData.image}`) 
        : defaultImage,
      rating: productData.rating || 4.5,
      sold: productData.sold || 0,
      stock: typeof productData.stock === 'number' ? productData.stock : (typeof productData.stock === 'string' ? parseInt(productData.stock) : 10),
      categoryId: productData.categoryId || 1,
      weight: productData.weight || '100g'
    };
    
    console.log('Processed product data:', product.value);
    
    // Also fetch categories if they haven't been fetched yet
    if (categories.value.length === 0) {
      fetchCategories();
    }
    
    // After successfully fetching the product, fetch related products
    fetchRelatedProducts(product.value.categoryId);
    
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
    
    // Use fallback data
    useFallbackProduct();
  } finally {
    isLoading.value = false;
  }
}

// Function to use fallback product data
function useFallbackProduct() {
    product.value = {
      id: route.params.id,
      name: 'Sâm Ngọc Linh Tươi',
      description: 'Sâm ngọc linh tươi được thu hoạch từ vùng núi Ngọc Linh, có tuổi đời từ 10-15 năm.',
    longDescription: '<h3>Sâm Ngọc Linh Tươi</h3><p>Sâm ngọc linh tươi được thu hoạch từ vùng núi Ngọc Linh, có tuổi đời từ 10-15 năm. Đây là loại thảo dược quý hiếm được công nhận là một trong những dược liệu quý của Việt Nam.</p>',
      price: 2500000,
      originalPrice: 3000000,
      image: defaultImage,
      rating: 4.5,
      sold: 124,
      stock: 10,
    categoryId: 1,
    weight: '100g'
  };
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

// Fetch related products based on category
async function fetchRelatedProducts(categoryId) {
  isLoadingRelated.value = true;
  
  try {
    const response = await api.product.getProducts({ categoryId });
    console.log('Related products API response:', response);
    
    // Handle different response formats
    let productsData = [];
    
    if (response && response.content && Array.isArray(response.content)) {
      // Spring Data format: { content: [...] }
      productsData = response.content;
    } else if (response && response.data && Array.isArray(response.data)) {
      // Format: { data: [...] }
      productsData = response.data;
    } else if (response && Array.isArray(response)) {
      // Direct array format
      productsData = response;
    } else if (response && response.products && Array.isArray(response.products)) {
      // Format: { products: [...] }
      productsData = response.products;
    } else {
      console.error('Unknown related products response format:', response);
      throw new Error('Invalid related products data format');
    }
    
    // Process and standardize each product
    relatedProducts.value = productsData
      .filter(item => item.id.toString() !== route.params.id.toString()) // Exclude current product
      .slice(0, 3) // Limit to 3 related products
      .map(item => ({
        id: item.id,
        name: item.name || 'Sản phẩm Sâm Ngọc Linh',
        price: typeof item.price === 'number' ? item.price : (typeof item.price === 'string' ? parseFloat(item.price) : 0),
        originalPrice: item.originalPrice || item.price || 0,
        image: item.image 
          ? (item.image.startsWith('http') 
            ? item.image 
            : `${import.meta.env.VITE_API_URL || ''}${item.image}`) 
          : defaultImage,
        categoryId: item.categoryId || categoryId || 1,
        stock: typeof item.stock === 'number' ? item.stock : (typeof item.stock === 'string' ? parseInt(item.stock) : 10)
      }));
      
    console.log('Processed related products:', relatedProducts.value);
    
    // If we have fewer than 3 related products, add some fallback products
    if (relatedProducts.value.length < 3) {
      const additionalNeeded = 3 - relatedProducts.value.length;
      const fallbackProducts = getFallbackRelatedProducts(additionalNeeded, categoryId);
      relatedProducts.value = [...relatedProducts.value, ...fallbackProducts];
    }
    
  } catch (err) {
    console.error('Error fetching related products:', err);
    
    // Use fallback data
    relatedProducts.value = getFallbackRelatedProducts(3, categoryId);
  } finally {
    isLoadingRelated.value = false;
  }
}

// Generate fallback related products
function getFallbackRelatedProducts(count, categoryId) {
  const fallbackProducts = [];
  
  for (let i = 0; i < count; i++) {
    fallbackProducts.push({
      id: 100 + i,
      name: `Sản phẩm Sâm Ngọc Linh ${i + 1}`,
      price: 1500000 + (i * 500000),
      originalPrice: 2000000 + (i * 500000),
      image: defaultImage,
      categoryId: categoryId || 1,
      stock: 10
    });
  }
  
  return fallbackProducts;
}

// Quantity management
function validateQuantity() {
  // Ensure quantity is a number
  if (isNaN(quantity.value) || quantity.value < 1) {
    quantity.value = 1
  }
  
  // Ensure quantity doesn't exceed stock
  if (product.value && quantity.value > product.value.stock) {
    quantity.value = product.value.stock
  }
}

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
  
  // Add to cart and show notification
  cart.addToCart(product.value, quantity.value)
  notificationService.cart(product.value, quantity.value)
}

function addToCartQuick(relatedProduct) {
  // Add to cart and show notification
  cart.addToCart(relatedProduct, 1)
  notificationService.cart(relatedProduct)
}

function buyNow() {
  if (!product.value) return
  
  // Add to cart and redirect to checkout
  cart.addToCart(product.value, quantity.value)
  notificationService.show(`Đang chuyển đến trang thanh toán cho ${quantity.value} sản phẩm "${product.value.name}"`, {
    title: 'Thanh toán ngay'
  })
  
  // Delay navigation slightly to allow notification to show
  setTimeout(() => {
    router.push('/checkout')
  }, 800)
}

// Function to handle contact button
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

// Watch for route changes to reload the product when navigating between product pages
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    fetchProduct()
    window.scrollTo(0, 0)
  }
})

// Watch for product changes to reset quantity
watch(product, (newProduct) => {
  if (newProduct && newProduct.stock > 0) {
    // Reset quantity to 1 or max stock if stock is less than 1
    quantity.value = newProduct.stock < 1 ? newProduct.stock : 1
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  fetchProduct()
  AOS.refresh()
})

// Add to cart from related products
const handleAddToCart = (product) => {
  addToCartQuick(product);
};

/**
 * Handle different image source formats
 */
const getImageSrc = (image) => {
  if (!image) return defaultImage;
  
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