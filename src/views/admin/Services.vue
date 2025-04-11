<template>
  <div class="services-admin-page min-h-screen bg-gray-50">
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
        
        <!-- Search and filters -->
        <div class="bg-white p-4 rounded shadow mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Tìm kiếm dịch vụ..." 
                  class="w-full px-4 py-2 border rounded-md"
                  @keyup.enter="searchQuery = searchQuery"
                >
                <button 
                  class="absolute right-2 top-2 text-gray-400"
                  @click="searchQuery = searchQuery"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            
            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                v-model="statusFilter" 
                class="w-full px-4 py-2 border rounded-md"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{{ error }}</p>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- Services table -->
        <div v-else-if="filteredServices.length > 0" class="bg-white rounded shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in filteredServices" :key="service.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                      <i :class="[service.icon, 'text-blue-500 text-lg']"></i>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 line-clamp-1">
                        {{ service.name }}
                      </div>
                      <div class="text-sm text-gray-500 line-clamp-1">
                        {{ service.description }}
                      </div>
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
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ service.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editService(service)" 
                      class="text-indigo-600 hover:text-indigo-900"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleServiceStatus(service)" 
                      class="text-yellow-600 hover:text-yellow-900"
                      :title="service.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'"
                    >
                      <i :class="service.status === 'active' ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                    </button>
                    <button 
                      @click="confirmDelete(service.id)" 
                      class="text-red-600 hover:text-red-900"
                      title="Xóa"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="px-6 py-3 flex items-center justify-between border-t">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 0"
                :class="currentPage === 0 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                class="px-4 py-2 rounded"
              >
                Trước
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages - 1"
                :class="currentPage >= totalPages - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                class="px-4 py-2 rounded"
              >
                Sau
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị <span class="font-medium">{{ filteredServices.length }}</span> trong số 
                  <span class="font-medium">{{ totalServices }}</span> dịch vụ
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    @click="prevPage" 
                    :disabled="currentPage === 0"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="goToPage(page - 1)"
                    :class="currentPage === page - 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="nextPage" 
                    :disabled="currentPage >= totalPages - 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="!isLoading" class="bg-white p-8 rounded shadow text-center">
          <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Không có dịch vụ nào</h3>
          <p class="text-gray-500 mb-4">Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn.</p>
          <button 
            @click="openAddModal" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm dịch vụ mới
          </button>
        </div>
      </div>
    </main>
    
    <!-- Add/Edit Service Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}
          </h3>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <!-- Service Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ *</label>
              <input 
                v-model="serviceForm.name" 
                type="text" 
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Nhập tên dịch vụ"
              >
            </div>
            
            <!-- Icon -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <div class="flex space-x-4">
                <div class="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
                  <i :class="[serviceForm.icon, 'text-blue-500 text-3xl']"></i>
                </div>
                <select 
                  v-model="serviceForm.icon" 
                  class="flex-1 px-4 py-2 border rounded-md"
                >
                  <option value="fas fa-leaf">Lá</option>
                  <option value="fas fa-hiking">Du lịch</option>
                  <option value="fas fa-seedling">Cây con</option>
                  <option value="fas fa-tractor">Máy kéo</option>
                  <option value="fas fa-spa">Spa</option>
                  <option value="fas fa-tree">Cây</option>
                  <option value="fas fa-mountain">Núi</option>
                  <option value="fas fa-clinic-medical">Y tế</option>
                </select>
              </div>
            </div>
            
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                v-model="serviceForm.status" 
                class="w-full px-4 py-2 border rounded-md"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            
            <!-- Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
              <input 
                v-model.number="serviceForm.price" 
                type="number" 
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Nhập giá dịch vụ"
                min="0"
              >
            </div>
            
            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian *</label>
              <input 
                v-model="serviceForm.duration" 
                type="text" 
                class="w-full px-4 py-2 border rounded-md"
                placeholder="Ví dụ: 2 giờ, 1 ngày, 3 tháng..."
              >
            </div>
            
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea 
                v-model="serviceForm.description" 
                class="w-full px-4 py-2 border rounded-md"
                rows="4"
                placeholder="Nhập mô tả chi tiết về dịch vụ"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="closeModal" 
            class="px-4 py-2 border rounded-md"
          >
            Hủy
          </button>
          <button 
            @click="saveService" 
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
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
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/api'
import notificationService from '@/utils/notificationService'

// Services data
const services = ref([])
const isLoading = ref(true)
const error = ref(null)

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentServiceId = ref(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')

// Pagination
const currentPage = ref(0)
const itemsPerPage = ref(10)
const totalServices = ref(0)
const totalPages = ref(1)

// Service form data
const serviceForm = reactive({
  name: '',
  icon: 'fas fa-leaf',
  status: 'active',
  price: 0,
  duration: '',
  description: ''
})

// Computed: filtered services based on search and status
const filteredServices = computed(() => {
  return services.value.filter(service => {
    // Filter by search query
    const matchesSearch = !searchQuery.value || 
      service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter.value === 'all' || service.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

// Fetch services from API
async function fetchServices() {
  isLoading.value = true
  error.value = null
  
  try {
    // For now, services endpoint might not be ready, so we're using sample data
    // This should be replaced with actual API call when backend is ready
    // const response = await api.service.getServices()
    // services.value = response.data
    
    // Sample data
    services.value = [
      {
        id: 1,
        name: 'Tham quan vườn sâm Ngọc Linh',
        icon: 'fas fa-hiking',
        description: 'Tham quan vườn sâm Ngọc Linh và tìm hiểu quy trình trồng, chăm sóc sâm.',
        price: 500000,
        duration: '2 giờ',
        status: 'active'
      },
      {
        id: 2,
        name: 'Trải nghiệm thu hoạch sâm',
        icon: 'fas fa-seedling',
        description: 'Trải nghiệm quy trình thu hoạch sâm Ngọc Linh cùng các chuyên gia.',
        price: 1200000,
        duration: '4 giờ',
        status: 'active'
      },
      {
        id: 3,
        name: 'Chăm sóc sức khỏe với sâm Ngọc Linh',
        icon: 'fas fa-spa',
        description: 'Dịch vụ tư vấn sức khỏe và cách sử dụng sâm Ngọc Linh hiệu quả.',
        price: 300000,
        duration: '1 giờ',
        status: 'inactive'
      }
    ]
    
    // Simulate pagination data
    totalServices.value = services.value.length
    totalPages.value = Math.ceil(totalServices.value / itemsPerPage.value)
    
  } catch (err) {
    console.error('Error fetching services:', err)
    error.value = 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.'
    notificationService.show('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

// Open modal to add new service
function openAddModal() {
  isEditMode.value = false
  currentServiceId.value = null
  
  // Reset form
  serviceForm.name = ''
  serviceForm.icon = 'fas fa-leaf'
  serviceForm.status = 'active'
  serviceForm.price = 0
  serviceForm.duration = ''
  serviceForm.description = ''
  
  isModalOpen.value = true
}

// Open modal to edit service
function editService(service) {
  isEditMode.value = true
  currentServiceId.value = service.id
  
  // Populate form with service data
  serviceForm.name = service.name
  serviceForm.icon = service.icon
  serviceForm.status = service.status
  serviceForm.price = service.price
  serviceForm.duration = service.duration
  serviceForm.description = service.description
  
  isModalOpen.value = true
}

// Close modal
function closeModal() {
  isModalOpen.value = false
}

// Save service (add new or update existing)
async function saveService() {
  try {
    if (isEditMode.value) {
      // Update existing service
      // await api.service.updateService(currentServiceId.value, serviceForm)
      
      // For now, update in local array
      const index = services.value.findIndex(s => s.id === currentServiceId.value)
      if (index !== -1) {
        services.value[index] = {
          ...services.value[index],
          ...serviceForm
        }
      }
      
      notificationService.show('Dịch vụ đã được cập nhật thành công.', {
        title: 'Thành công',
        type: 'success'
      })
    } else {
      // Add new service
      // const response = await api.service.createService(serviceForm)
      
      // For now, add to local array
      const newId = Math.max(0, ...services.value.map(s => s.id)) + 1
      services.value.push({
        id: newId,
        ...serviceForm
      })
      
      notificationService.show('Dịch vụ mới đã được thêm thành công.', {
        title: 'Thành công',
        type: 'success'
      })
    }
    
    // Close modal
    closeModal()
    
  } catch (err) {
    console.error('Error saving service:', err)
    notificationService.show('Có lỗi xảy ra khi lưu dịch vụ. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Toggle service status (active/inactive)
function toggleServiceStatus(service) {
  const newStatus = service.status === 'active' ? 'inactive' : 'active'
  try {
    // await api.service.updateService(service.id, { status: newStatus })
    
    // For now, update in local array
    const index = services.value.findIndex(s => s.id === service.id)
    if (index !== -1) {
      services.value[index].status = newStatus
    }
    
    notificationService.show(`Dịch vụ đã được ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'}.`, {
      title: 'Thành công',
      type: 'success'
    })
  } catch (err) {
    console.error('Error updating service status:', err)
    notificationService.show('Có lỗi xảy ra khi cập nhật trạng thái dịch vụ.', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Confirm delete service
function confirmDelete(serviceId) {
  const confirmed = confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')
  if (confirmed) {
    deleteService(serviceId)
  }
}

// Delete service
async function deleteService(serviceId) {
  try {
    // await api.service.deleteService(serviceId)
    
    // For now, remove from local array
    services.value = services.value.filter(s => s.id !== serviceId)
    
    notificationService.show('Dịch vụ đã được xóa thành công.', {
      title: 'Thành công',
      type: 'success'
    })
  } catch (err) {
    console.error('Error deleting service:', err)
    notificationService.show('Có lỗi xảy ra khi xóa dịch vụ.', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Pagination controls
function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    // When API is implemented:
    // fetchServices()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    // When API is implemented:
    // fetchServices()
  }
}

function goToPage(page) {
  currentPage.value = page
  // When API is implemented:
  // fetchServices()
}

// Load services on component mount
onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.min-width-cell {
  min-width: 140px;
}
</style> 