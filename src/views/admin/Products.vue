<template>
  <div class="admin-products min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Products title and actions -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">QUẢN LÝ SẢN PHẨM</h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                placeholder="Tìm kiếm sản phẩm..."
                class="px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
                @keyup.enter="handleSearch"
              >
              <button @click="handleSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i class="fas fa-search"></i>
              </button>
            </div>
            
            <div class="relative w-full sm:w-auto">
              <select 
                v-model="selectedCategory" 
                @change="handleCategoryChange"
                class="appearance-none px-4 py-2 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <button 
              @click="openProductModal(null)" 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <i class="fas fa-plus"></i>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium">{{ error }}</p>
            </div>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow p-8 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
        
        <!-- Products table -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in products" :key="product.id">
                  <!-- Product name and image -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        <img :src="product.image" :alt="product.name" class="h-full w-full object-cover object-center">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ product.name }}</div>
                        <div class="text-xs text-gray-500">ID: {{ product.id }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ getCategoryName(product.categoryId) }}</div>
                  </td>
                  
                  <!-- Price -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatPrice(product.price) }}đ</div>
                    <div v-if="product.originalPrice" class="text-xs text-gray-500 line-through">
                      {{ formatPrice(product.originalPrice) }}đ
                    </div>
                  </td>
                  
                  <!-- Stock -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ product.stock }}</div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': getProductStatus(product.stock) === 'Còn hàng',
                        'bg-yellow-100 text-yellow-800': getProductStatus(product.stock) === 'Sắp hết',
                        'bg-red-100 text-red-800': getProductStatus(product.stock) === 'Hết hàng'
                      }"
                    >
                      {{ getProductStatus(product.stock) }}
                    </span>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="openProductModal(product)"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Chỉnh sửa"
                        type="button"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        @click="confirmDelete(product)"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Xóa"
                        type="button"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                
                <!-- Empty state -->
                <tr v-if="products.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center">
                    <div class="text-gray-500">
                      <i class="fas fa-box mb-3 text-2xl"></i>
                      <p>Không tìm thấy sản phẩm nào.</p>
                      <button 
                        @click="resetFilters"
                        class="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <i class="fas fa-sync-alt mr-2"></i> Đặt lại bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="products.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị <span class="font-medium">{{ currentPage * itemsPerPage + 1 }}</span> đến <span class="font-medium">{{ Math.min((currentPage + 1) * itemsPerPage, totalProducts) }}</span> trên tổng số <span class="font-medium">{{ totalProducts }}</span> sản phẩm
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 0"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="goToPage(page - 1)"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                    :class="[
                      page - 1 === currentPage 
                        ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages - 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Product Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
                </h3>
                
                <form @submit.prevent="saveProduct">
                  <!-- Product name -->
                  <div class="mb-4">
                    <label for="product-name" class="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                    <input
                      id="product-name"
                      v-model="productForm.name"
                      type="text"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                  </div>
                  
                  <!-- Category -->
                  <div class="mb-4">
                    <label for="product-category" class="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select
                      id="product-category"
                      v-model="productForm.categoryId"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <!-- Price and Original Price -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label for="product-price" class="block text-sm font-medium text-gray-700">Giá bán</label>
                      <input
                        id="product-price"
                        v-model="productForm.price"
                        type="number"
                        min="0"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        required
                      >
                    </div>
                    <div>
                      <label for="product-original-price" class="block text-sm font-medium text-gray-700">Giá gốc (tùy chọn)</label>
                      <input
                        id="product-original-price"
                        v-model="productForm.originalPrice"
                        type="number"
                        min="0"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                    </div>
                  </div>
                  
                  <!-- Stock -->
                  <div class="mb-4">
                    <label for="product-stock" class="block text-sm font-medium text-gray-700">Tồn kho</label>
                    <input
                      id="product-stock"
                      v-model="productForm.stock"
                      type="number"
                      min="0"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                  </div>
                  
                  <!-- Description -->
                  <div class="mb-4">
                    <label for="product-description" class="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      id="product-description"
                      v-model="productForm.description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    ></textarea>
                  </div>
                  
                  <!-- Image URL -->
                  <div class="mb-4">
                    <label for="product-image" class="block text-sm font-medium text-gray-700">URL hình ảnh</label>
                    <input
                      id="product-image"
                      v-model="productForm.image"
                      type="text"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="saveProduct" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ currentProduct ? 'Cập nhật' : 'Thêm mới' }}
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isSubmitting"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import api from '@/api'
import notificationService from '@/utils/notificationService'

// Products state
const products = ref([])
const isLoading = ref(true)
const error = ref(null)

// Categories state
const categories = ref([])
const loadingCategories = ref(true)

// Pagination
const currentPage = ref(0)
const itemsPerPage = ref(10)
const totalProducts = ref(0)
const totalPages = ref(1)

// Search and filter
const searchTerm = ref('')
const selectedCategory = ref('')

// Modal state
const showModal = ref(false)
const currentProduct = ref(null)
const productForm = reactive({
  name: '',
  categoryId: null,
  price: 0,
  originalPrice: null,
  stock: 0,
  description: '',
  image: ''
})
const isSubmitting = ref(false)

// Fetch products from API
async function fetchProducts() {
  isLoading.value = true
  error.value = null
  
  try {
    const params = {
      page: currentPage.value,
      size: itemsPerPage.value
    }
    
    // Add search parameter if provided
    if (searchTerm.value) {
      params.search = searchTerm.value
    }
    
    // Add category filter if selected
    let response
    if (selectedCategory.value) {
      response = await api.category.getCategoryProducts(selectedCategory.value, params)
    } else {
      response = await api.product.getProducts(params)
    }
    
    // Map products
    products.value = response.data.products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice || null,
      image: p.image || '/assets/images/products/sam-tuoi.png',
      stock: p.stock || 0,
      categoryId: p.categoryId
    }))
    
    // Set pagination data
    totalProducts.value = response.data.totalItems || products.value.length
    totalPages.value = response.data.totalPages || 1
    
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.'
    notificationService.show('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Fetch categories from API
async function fetchCategories() {
  loadingCategories.value = true
  
  try {
    const response = await api.category.getCategories()
    categories.value = response.data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
    categories.value = [
      { id: 1, name: 'Sâm tươi' },
      { id: 2, name: 'Sâm khô' },
      { id: 3, name: 'Chế phẩm' },
      { id: 4, name: 'Trà thảo dược' },
      { id: 5, name: 'Thực phẩm chức năng' }
    ]
  } finally {
    loadingCategories.value = false
  }
}

// Get category name by id
function getCategoryName(categoryId) {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Chưa phân loại'
}

// Determine status based on stock
function getProductStatus(stock) {
  if (stock <= 0) return 'Hết hàng'
  if (stock <= 5) return 'Sắp hết'
  return 'Còn hàng'
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Open product modal
const openProductModal = (product) => {
  currentProduct.value = product
  
  if (product) {
    // Edit mode
    productForm.name = product.name
    productForm.categoryId = product.categoryId
    productForm.price = product.price
    productForm.originalPrice = product.originalPrice
    productForm.stock = product.stock
    productForm.description = product.description
    productForm.image = product.image
  } else {
    // Add mode
    productForm.name = ''
    productForm.categoryId = categories.value.length > 0 ? categories.value[0].id : null
    productForm.price = 0
    productForm.originalPrice = null
    productForm.stock = 0
    productForm.description = ''
    productForm.image = '/assets/images/products/sam-tuoi.png'
  }
  
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  currentProduct.value = null
}

// Save product
const saveProduct = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    if (currentProduct.value) {
      // Update existing product
      await api.product.updateProduct(currentProduct.value.id, productForm)
      notificationService.show('Sản phẩm đã được cập nhật thành công!', {
        title: 'Thành công',
        type: 'success'
      })
    } else {
      // Add new product
      await api.product.createProduct(productForm)
      notificationService.show('Sản phẩm mới đã được thêm thành công!', {
        title: 'Thành công',
        type: 'success'
      })
    }
    
    // Refresh product list
    fetchProducts()
    closeModal()
  } catch (err) {
    console.error('Error saving product:', err)
    notificationService.show('Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Confirm delete
const confirmDelete = async (product) => {
  try {
    const confirmed = confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)
    
    if (confirmed) {
      await api.product.deleteProduct(product.id)
      
      // Refresh product list
      fetchProducts()
      
      notificationService.show('Sản phẩm đã được xóa thành công!', {
        title: 'Thành công',
        type: 'success'
      })
    }
  } catch (err) {
    console.error('Error deleting product:', err)
    notificationService.show('Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Pagination
function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchProducts()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProducts()
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchProducts()
}

// Reset filters
function resetFilters() {
  searchTerm.value = ''
  selectedCategory.value = ''
  currentPage.value = 0
  fetchProducts()
}

// Handle search
function handleSearch() {
  currentPage.value = 0
  fetchProducts()
}

// Handle category change
function handleCategoryChange() {
  currentPage.value = 0
  fetchProducts()
}

// Initial data fetch
onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 