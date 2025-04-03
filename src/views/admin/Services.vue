<template>
  <div class="services-management admin-dashboard bg-gray-50 min-h-screen">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
          <button 
            @click="openAddModal"
            class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <i class="fas fa-plus"></i>
            Thêm dịch vụ mới
          </button>
        </div>
        
        <!-- Actions Bar -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div class="flex items-center gap-4 flex-grow">
            <div class="relative flex-grow max-w-md">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Tìm kiếm dịch vụ..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div class="flex-shrink-0">
              <select 
                v-model="statusFilter"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Services Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in filteredServices" :key="service.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                      <i :class="service.icon"></i>
                    </div>
                    <div class="max-w-xs">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ service.name }}</div>
                      <div class="text-sm text-gray-500 line-clamp-1">{{ service.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatPrice(service.price) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.duration }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`">
                    {{ service.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex gap-3 items-center px-2">
                    <button 
                      @click="editService(service)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                      title="Chỉnh sửa"
                      type="button"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleServiceStatus(service)"
                      class="w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-colors"
                      :class="service.status === 'active' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                      :title="service.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'"
                      type="button"
                    >
                      <i :class="service.status === 'active' ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                    </button>
                    <button 
                      @click="confirmDelete(service.id)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                      title="Xóa"
                      type="button"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredServices.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                  Không tìm thấy dịch vụ nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-500">
            Hiển thị {{ filteredServices.length }} trên tổng số {{ services.length }} dịch vụ
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
        
        <!-- Add/Edit Service Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}
              </h3>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveService">
                <div class="grid gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="serviceForm.name"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Biểu tượng</label>
                      <div class="relative">
                        <select 
                          v-model="serviceForm.icon"
                          class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        >
                          <option value="fas fa-leaf">Lá (fas fa-leaf)</option>
                          <option value="fas fa-seedling">Cây non (fas fa-seedling)</option>
                          <option value="fas fa-hiking">Du lịch (fas fa-hiking)</option>
                          <option value="fas fa-spa">Spa (fas fa-spa)</option>
                          <option value="fas fa-tractor">Nông trại (fas fa-tractor)</option>
                        </select>
                        <i :class="[serviceForm.icon || 'fas fa-leaf', 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500']"></i>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select 
                        v-model="serviceForm.status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) <span class="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        v-model="serviceForm.price"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        min="0"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        v-model="serviceForm.duration"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: 2 giờ, 1 ngày..."
                        required
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea 
                      v-model="serviceForm.description"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end gap-3">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-exclamation-triangle text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
              <p class="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.</p>
            </div>
            <div class="flex justify-center gap-3">
              <button 
                @click="showDeleteConfirm = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                @click="deleteService"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

// Sample data - replace with API calls in production
const services = ref([
  {
    id: 1,
    name: 'Du lịch trải nghiệm',
    description: 'Tour khám phá vùng trồng sâm Ngọc Linh, tìm hiểu về quy trình trồng và thu hoạch.',
    price: 2500000,
    duration: '1 ngày',
    icon: 'fas fa-hiking',
    status: 'active'
  },
  {
    id: 2,
    name: 'Chăm sóc, bảo vệ Sâm',
    description: 'Dịch vụ tư vấn kỹ thuật chăm sóc sâm Ngọc Linh từ các chuyên gia.',
    price: 5000000,
    duration: '3 tháng',
    icon: 'fas fa-seedling',
    status: 'active'
  },
  {
    id: 3,
    name: 'Xây dựng trang trại',
    description: 'Tư vấn thiết kế, xây dựng và vận hành trang trại trồng sâm Ngọc Linh.',
    price: 15000000,
    duration: '6 tháng',
    icon: 'fas fa-tractor',
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Hướng dẫn chế biến',
    description: 'Khóa học chế biến các sản phẩm từ sâm Ngọc Linh như rượu, cao, trà...',
    price: 1800000,
    duration: '2 ngày',
    icon: 'fas fa-spa',
    status: 'active'
  }
])

// Search and filter
const searchQuery = ref('')
const statusFilter = ref('all')

const filteredServices = computed(() => {
  let result = services.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(service => 
      service.name.toLowerCase().includes(query) || 
      service.description.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(service => service.status === statusFilter.value)
  }
  
  return result
})

// Modal state and form
const isModalOpen = ref(false)
const isEditMode = ref(false)
const serviceForm = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  duration: '',
  icon: 'fas fa-leaf',
  status: 'active'
})

// Delete confirmation
const showDeleteConfirm = ref(false)
const serviceToDeleteId = ref(null)

// Format price with thousand separator
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

// Open modal for adding new service
const openAddModal = () => {
  isEditMode.value = false
  serviceForm.value = {
    id: null,
    name: '',
    description: '',
    price: 0,
    duration: '',
    icon: 'fas fa-leaf',
    status: 'active'
  }
  isModalOpen.value = true
}

// Open modal for editing service
const editService = (service) => {
  isEditMode.value = true
  serviceForm.value = { ...service }
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
}

// Save service (add or update)
const saveService = () => {
  if (isEditMode.value) {
    // Update existing service
    const index = services.value.findIndex(s => s.id === serviceForm.value.id)
    if (index !== -1) {
      services.value[index] = { ...serviceForm.value }
    }
  } else {
    // Add new service
    const newId = Math.max(0, ...services.value.map(s => s.id)) + 1
    services.value.push({
      ...serviceForm.value,
      id: newId
    })
  }
  
  closeModal()
}

// Confirm delete
const confirmDelete = (id) => {
  serviceToDeleteId.value = id
  showDeleteConfirm.value = true
}

// Delete service
const deleteService = () => {
  services.value = services.value.filter(s => s.id !== serviceToDeleteId.value)
  showDeleteConfirm.value = false
}

// Toggle service status
const toggleServiceStatus = (service) => {
  const index = services.value.findIndex(s => s.id === service.id)
  if (index !== -1) {
    services.value[index].status = service.status === 'active' ? 'inactive' : 'active'
  }
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