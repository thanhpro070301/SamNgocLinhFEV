<template>
  <div class="admin-orders min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Orders title and actions -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">QUẢN LÝ ĐƠN HÀNG</h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                placeholder="Tìm kiếm đơn hàng..."
                class="px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
              >
              <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div class="relative w-full sm:w-auto">
              <select 
                v-model="selectedStatus" 
                class="appearance-none px-4 py-2 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              >
                <option value="">Tất cả trạng thái</option>
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <button 
              @click="exportOrders" 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <i class="fas fa-file-export"></i>
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>
        
        <!-- Orders table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
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
                <tr v-for="order in filteredOrders" :key="order.id">
                  <!-- Order ID -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
                  </td>
                  
                  <!-- Customer info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-0">
                        <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ order.shippingName }}</div>
                        <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ order.shippingEmail }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Order date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(order.createdAt) }}</div>
                  </td>
                  
                  <!-- Total price -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatCurrency(order.totalAmount) }}</div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusColor(order.status)"
                    >
                      {{ getStatusName(order.status) }}
                    </span>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="viewOrderDetails(order)"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Xem chi tiết"
                        type="button"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        @click="updateOrderStatus(order.id, order.status)"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Cập nhật trạng thái"
                        type="button"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                
                <!-- Empty state -->
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center">
                    <div class="text-gray-500">
                      <i class="fas fa-shopping-cart mb-3 text-2xl"></i>
                      <p>Không tìm thấy đơn hàng nào.</p>
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
                  Hiển thị <span class="font-medium">1</span> đến <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span> trên tổng số <span class="font-medium">{{ filteredOrders.length }}</span> đơn hàng
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
                  <!-- Pagination numbers -->
                  <span 
                    v-for="page in Math.min(5, Math.ceil(filteredOrders.length / itemsPerPage))" 
                    :key="page"
                    @click="currentPage = page"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 cursor-pointer"
                    :class="currentPage === page ? 'text-green-600 bg-green-50' : 'text-gray-500'"
                  >
                    {{ page }}
                  </span>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)"
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
    
    <!-- Order Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>
        
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Chi tiết đơn hàng #{{ selectedOrder?.id }}
                  </h3>
                  <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-500">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="border-t border-gray-200 py-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin khách hàng</h4>
                      <p class="text-sm text-gray-900">{{ selectedOrder?.shippingName }}</p>
                      <p class="text-sm text-gray-500">{{ selectedOrder?.shippingEmail }}</p>
                      <p class="text-sm text-gray-500">{{ selectedOrder?.shippingPhone }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin đơn hàng</h4>
                      <p class="text-sm text-gray-900">Ngày đặt: {{ formatDate(selectedOrder?.createdAt) }}</p>
                      <p class="text-sm text-gray-900">Trạng thái: 
                        <span 
                          class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="getStatusColor(selectedOrder?.status)"
                        >
                          {{ getStatusName(selectedOrder?.status) }}
                        </span>
                      </p>
                      <p class="text-sm text-gray-900">Phương thức thanh toán: {{ selectedOrder?.paymentMethod }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 py-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Địa chỉ giao hàng</h4>
                  <p class="text-sm text-gray-900">{{ selectedOrder?.shippingAddress }}</p>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between">
                    <select 
                      v-model="newStatus" 
                      class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="PROCESSING">Đang xử lý</option>
                      <option value="SHIPPING">Đang giao hàng</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                    
                    <button 
                      @click="saveOrderStatus"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Cập nhật trạng thái
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { useAuthStore } from '@/store/auth'
import api from '@/api'

const router = useRouter()
const auth = useAuthStore()
const orders = ref([])
const isLoading = ref(false)
const loadingError = ref(null)

// Chuyển hướng nếu chưa đăng nhập
if (!auth.isAuthenticated.value) {
  router.push('/admin/login')
}

// State
const searchTerm = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const newStatus = ref('')

// Status options
const statusOptions = [
  'PENDING',
  'PROCESSING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED'
]

// Filtered orders
const filteredOrders = computed(() => {
  let result = orders.value

  // Filter by search term
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase()
    result = result.filter(order => 
      order.id.toString().includes(searchLower) || 
      order.shippingName.toLowerCase().includes(searchLower) || 
      order.shippingEmail.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    result = result.filter(order => order.status === selectedStatus.value)
  }

  return result
})

// Lấy danh sách đơn hàng
async function fetchOrders() {
  isLoading.value = true
  loadingError.value = null
  
  try {
    const response = await api.order.getOrders()
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    loadingError.value = 'Không thể tải danh sách đơn hàng'
    
    // Sử dụng dữ liệu mẫu nếu API lỗi
    orders.value = [
      {
        id: 1,
        userId: 1,
        totalAmount: 3450000,
        shippingFee: 30000,
        status: "COMPLETED",
        paymentMethod: "COD",
        paymentStatus: "COMPLETED",
        shippingName: "Nguyễn Văn A",
        shippingPhone: "0123456789",
        shippingAddress: "123 Đường ABC, Quận XYZ",
        shippingEmail: "nguyenvana@example.com",
        notes: "Giao hàng giờ hành chính",
        createdAt: "2023-11-01T12:00:00",
        updatedAt: "2023-11-01T15:30:00"
      },
      {
        id: 2,
        userId: 2,
        totalAmount: 7800000,
        shippingFee: 30000,
        status: "PROCESSING",
        paymentMethod: "TRANSFER",
        paymentStatus: "PENDING",
        shippingName: "Trần Thị B",
        shippingPhone: "0987654321",
        shippingAddress: "456 Đường DEF, Quận UVW",
        shippingEmail: "tranthib@example.com",
        notes: "",
        createdAt: "2023-11-02T10:15:00",
        updatedAt: "2023-11-02T10:15:00"
      },
      {
        id: 3,
        userId: 3,
        totalAmount: 1250000,
        shippingFee: 30000,
        status: "SHIPPING",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        shippingName: "Lê Văn C",
        shippingPhone: "0369852147",
        shippingAddress: "789 Đường GHI, Quận RST",
        shippingEmail: "levanc@example.com",
        notes: "Gọi trước khi giao",
        createdAt: "2023-11-03T09:30:00",
        updatedAt: "2023-11-03T14:20:00"
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, status) {
  try {
    await api.order.updateOrderStatus(orderId, status)
    // Cập nhật lại danh sách đơn hàng
    fetchOrders()
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Không thể cập nhật trạng thái đơn hàng')
  }
}

// Cập nhật trạng thái thanh toán
async function updatePaymentStatus(orderId, paymentStatus) {
  try {
    await api.order.updatePaymentStatus(orderId, paymentStatus)
    // Cập nhật lại danh sách đơn hàng
    fetchOrders()
  } catch (error) {
    console.error('Error updating payment status:', error)
    alert('Không thể cập nhật trạng thái thanh toán')
  }
}

// Định dạng số thành tiền Việt Nam
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount).replace('₫', 'VNĐ')
}

// Định dạng thời gian
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Lấy màu cho trạng thái
function getStatusColor(status) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800'
    case 'SHIPPING':
      return 'bg-purple-100 text-purple-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Hiển thị tên trạng thái tiếng Việt
function getStatusName(status) {
  switch (status) {
    case 'COMPLETED':
      return 'Hoàn thành'
    case 'PROCESSING':
      return 'Đang xử lý'
    case 'SHIPPING':
      return 'Đang giao hàng'
    case 'PENDING':
      return 'Chờ xử lý'
    case 'CANCELLED':
      return 'Đã hủy'
    default:
      return status
  }
}

// View order details
function viewOrderDetails(order) {
  selectedOrder.value = order
  newStatus.value = order.status
  showDetailModal.value = true
}

// Close detail modal
function closeDetailModal() {
  showDetailModal.value = false
  selectedOrder.value = null
}

// Save order status
function saveOrderStatus() {
  if (selectedOrder.value) {
    // Call API to update order status
    updateOrderStatus(selectedOrder.value.id, newStatus.value)
    closeDetailModal()
  }
}

// Export orders to Excel
function exportOrders() {
  // In a real app, this would call a function to export to Excel
  console.log('Exporting orders to Excel...')
  alert('Tính năng xuất Excel đang được phát triển')
}

// Lấy danh sách đơn hàng khi component được khởi tạo
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 