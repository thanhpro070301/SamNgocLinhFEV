<template>
  <div>
    <!-- Actions Bar -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-4">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          >
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select class="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Tất cả danh mục</option>
          <option value="sam-tuoi">Sâm tươi</option>
          <option value="cao-sam">Cao sâm</option>
          <option value="ruou-sam">Rượu sâm</option>
        </select>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Thêm sản phẩm
      </button>
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SẢN PHẨM
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DANH MỤC
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GIÁ
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              KHO
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TRẠNG THÁI
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              THAO TÁC
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
                </div>
                <div class="max-w-xs">
                  <div class="font-medium text-gray-900 truncate">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ product.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ product.category }}</td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ formatPrice(product.price) }}</div>
              <div class="text-sm text-gray-500" v-if="product.originalPrice">
                <s>{{ formatPrice(product.originalPrice) }}</s>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ product.stock }}</div>
              <div class="text-sm text-gray-500">Đã bán: {{ product.sold }}</div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': product.status === 'active',
                  'bg-gray-100 text-gray-700': product.status === 'draft',
                  'bg-red-100 text-red-700': product.status === 'outOfStock'
                }"
              >
                {{ getStatusText(product.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-3 items-center px-2">
                <button 
                  @click="editProduct(product)"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                  title="Chỉnh sửa"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="deleteProduct(product)"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                  title="Xóa"
                  type="button"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-500">
        Hiển thị 1-10 trong số 50 sản phẩm
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="px-3 py-1 border border-gray-300 rounded-md bg-green-600 text-white">1</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input 
                  v-model="productForm.name"
                  type="text" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select 
                  v-model="productForm.category"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="sam-tuoi">Sâm tươi</option>
                  <option value="cao-sam">Cao sâm</option>
                  <option value="ruou-sam">Rượu sâm</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                <input 
                  v-model="productForm.price"
                  type="number" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
                <input 
                  v-model="productForm.originalPrice"
                  type="number" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng trong kho</label>
                <input 
                  v-model="productForm.stock"
                  type="number" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  v-model="productForm.status"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="active">Đang bán</option>
                  <option value="draft">Nháp</option>
                  <option value="outOfStock">Hết hàng</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea 
                v-model="productForm.description"
                rows="4"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label class="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <i class="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                    <span class="text-sm text-gray-500">Chọn file hoặc kéo thả vào đây</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      class="hidden" 
                      @change="handleImageUpload"
                    />
                  </label>
                </div>
                <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img :src="productForm.image || samTuoiImage" alt="Preview" class="w-full h-full object-cover">
                  <button 
                    v-if="productForm.image"
                    @click="removeImage" 
                    type="button" 
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                {{ editingProduct ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

// Sample data
const products = ref([
  {
    id: 1,
    name: 'Sâm Ngọc Linh Tươi 10 Năm Tuổi',
    category: 'sam-tuoi',
    price: 15000000,
    originalPrice: 18000000,
    stock: 50,
    sold: 124,
    status: 'active',
    image: samTuoiImage
  },
  {
    id: 2,
    name: 'Cao Sâm Ngọc Linh',
    category: 'cao-sam',
    price: 8000000,
    stock: 100,
    sold: 89,
    status: 'active',
    image: samTuoiImage
  },
  {
    id: 3,
    name: 'Rượu Sâm Ngọc Linh',
    category: 'ruou-sam',
    price: 5000000,
    originalPrice: 6000000,
    stock: 0,
    sold: 156,
    status: 'outOfStock',
    image: samTuoiImage
  }
])

const showAddModal = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  category: 'sam-tuoi',
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: 'active',
  description: '',
  image: ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Đang bán'
    case 'draft':
      return 'Nháp'
    case 'outOfStock':
      return 'Hết hàng'
    default:
      return status
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddModal.value = true
}

const deleteProduct = (product) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    products.value = products.value.filter(p => p.id !== product.id)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    category: 'sam-tuoi',
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: 'active',
    description: '',
    image: ''
  }
}

const saveProduct = () => {
  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    products.value[index] = { ...products.value[index], ...productForm.value }
  } else {
    // Add new product
    products.value.push({
      id: products.value.length + 1,
      ...productForm.value,
      sold: 0,
      image: productForm.value.image || samTuoiImage
    })
  }
  closeModal()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  productForm.value.image = ''
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 200px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

/* Đảm bảo các nút thao tác luôn hiển thị */
td button {
  position: relative;
  z-index: 10;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Tăng độ nổi bật khi hover */
td button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Đảm bảo cell có đủ không gian cho nút */
td:last-child {
  min-width: 140px;
}
</style> 