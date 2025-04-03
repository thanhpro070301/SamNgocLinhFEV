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
              >
              <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div class="relative w-full sm:w-auto">
              <select 
                v-model="selectedCategory" 
                class="appearance-none px-4 py-2 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
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
        
        <!-- Products table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
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
                <tr v-for="product in filteredProducts" :key="product.id">
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
                    <div class="text-sm text-gray-900">{{ product.category }}</div>
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
                        'bg-green-100 text-green-800': product.status === 'Còn hàng',
                        'bg-yellow-100 text-yellow-800': product.status === 'Sắp hết',
                        'bg-red-100 text-red-800': product.status === 'Hết hàng'
                      }"
                    >
                      {{ product.status }}
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
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center">
                    <div class="text-gray-500">
                      <i class="fas fa-box mb-3 text-2xl"></i>
                      <p>Không tìm thấy sản phẩm nào.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị <span class="font-medium">1</span> đến <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span> trên tổng số <span class="font-medium">{{ filteredProducts.length }}</span> sản phẩm
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <!-- Pagination numbers would go here -->
                  <button
                    @click="currentPage++"
                    :disabled="currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)"
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
                      v-model="productForm.category"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
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
                  
                  <!-- Stock and Status -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
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
                    <div>
                      <label for="product-status" class="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select
                        id="product-status"
                        v-model="productForm.status"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        required
                      >
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Sắp hết">Sắp hết</option>
                        <option value="Hết hàng">Hết hàng</option>
                      </select>
                    </div>
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
            >
              {{ currentProduct ? 'Cập nhật' : 'Thêm mới' }}
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { ref, computed, reactive } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

// Sample product data
const products = ref([
  {
    id: 1,
    name: 'Sâm Ngọc Linh tươi loại 1',
    category: 'Sâm tươi',
    price: 850000,
    originalPrice: 1000000,
    stock: 12,
    status: 'Còn hàng',
    description: 'Sâm Ngọc Linh tươi loại 1 có tuổi đời 10-15 năm, được thu hoạch từ núi Ngọc Linh.',
    image: '/src/assets/images/products/sam-tuoi.png'
  },
  {
    id: 2,
    name: 'Sâm Ngọc Linh khô loại đặc biệt',
    category: 'Sâm khô',
    price: 1250000,
    originalPrice: 1500000,
    stock: 8,
    status: 'Còn hàng',
    description: 'Sâm Ngọc Linh khô loại đặc biệt được chế biến từ sâm tươi loại 1, có tuổi đời trên 15 năm.',
    image: '/src/assets/images/products/sam-kho.png'
  },
  {
    id: 3,
    name: 'Rượu sâm Ngọc Linh',
    category: 'Chế phẩm',
    price: 580000,
    originalPrice: null,
    stock: 25,
    status: 'Còn hàng',
    description: 'Rượu sâm Ngọc Linh được ngâm từ sâm tươi loại 1, có hương vị đặc trưng và tác dụng tốt cho sức khỏe.',
    image: '/src/assets/images/products/ruou-sam.png'
  },
  {
    id: 4,
    name: 'Trà sâm Ngọc Linh',
    category: 'Trà thảo dược',
    price: 120000,
    originalPrice: 150000,
    stock: 2,
    status: 'Sắp hết',
    description: 'Trà sâm Ngọc Linh được chế biến từ lá và thân sâm Ngọc Linh, có hương vị thơm ngon và tác dụng tốt cho sức khỏe.',
    image: '/src/assets/images/products/tra-sam.png'
  },
  {
    id: 5,
    name: 'Viên đông trùng hạ thảo',
    category: 'Thực phẩm chức năng',
    price: 450000,
    originalPrice: null,
    stock: 0,
    status: 'Hết hàng',
    description: 'Viên đông trùng hạ thảo được chiết xuất từ đông trùng hạ thảo tự nhiên, có tác dụng tốt cho sức khỏe.',
    image: '/src/assets/images/products/vien-dong-trung.png'
  }
])

// Available categories
const categories = ref([
  'Sâm tươi',
  'Sâm khô',
  'Chế phẩm',
  'Trà thảo dược',
  'Thực phẩm chức năng'
])

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Search and filter
const searchTerm = ref('')
const selectedCategory = ref('')

// Modal state
const showModal = ref(false)
const currentProduct = ref(null)
const productForm = reactive({
  name: '',
  category: 'Sâm tươi',
  price: 0,
  originalPrice: null,
  stock: 0,
  status: 'Còn hàng',
  description: '',
  image: ''
})

// Filtered products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Apply category filter
    if (selectedCategory.value && product.category !== selectedCategory.value) {
      return false
    }
    
    // Apply search filter
    if (searchTerm.value) {
      const searchLower = searchTerm.value.toLowerCase()
      return product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
    }
    
    return true
  })
})

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Open product modal
const openProductModal = (product) => {
  currentProduct.value = product
  
  if (product) {
    // Edit mode
    Object.assign(productForm, product)
  } else {
    // Add mode
    Object.assign(productForm, {
      name: '',
      category: 'Sâm tươi',
      price: 0,
      originalPrice: null,
      stock: 0,
      status: 'Còn hàng',
      description: '',
      image: ''
    })
  }
  
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  currentProduct.value = null
}

// Save product
const saveProduct = () => {
  if (currentProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === currentProduct.value.id)
    if (index !== -1) {
      products.value[index] = { ...productForm, id: currentProduct.value.id }
    }
  } else {
    // Add new product
    const newId = Math.max(0, ...products.value.map(p => p.id)) + 1
    products.value.push({ ...productForm, id: newId })
  }
  
  closeModal()
}

// Confirm delete
const confirmDelete = (product) => {
  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
    products.value = products.value.filter(p => p.id !== product.id)
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 