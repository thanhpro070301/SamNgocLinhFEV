<template>
  <div class="orders-admin-page min-h-screen bg-gray-50">
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
                      <p class="text-sm text-gray-900">Phương thức thanh toán: {{ getPaymentMethodText(selectedOrder?.paymentMethod) }}</p>
                      <p class="text-sm text-gray-900">Trạng thái thanh toán: 
                        <span 
                          class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="getPaymentStatusColor(selectedOrder?.paymentStatus)"
                        >
                          {{ getPaymentStatusText(selectedOrder?.paymentStatus) }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 py-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Địa chỉ giao hàng</h4>
                  <p class="text-sm text-gray-900">{{ selectedOrder?.shippingAddress }}</p>
                </div>
                
                <div v-if="selectedOrder?.notes" class="border-t border-gray-200 py-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Ghi chú đơn hàng</h4>
                  <p class="text-sm text-gray-900">{{ selectedOrder?.notes }}</p>
                </div>
                
                <div class="border-t border-gray-200 py-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Sản phẩm</h4>
                  <div v-if="selectedOrder?.orderItems?.length" class="mt-2">
                    <div v-for="(item, index) in selectedOrder.orderItems" :key="index" class="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                        <img :src="item.image || '/assets/images/products/sam-tuoi.png'" :alt="item.name" class="h-full w-full object-cover">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500">SL: {{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
                      </div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatCurrency(item.price * item.quantity) }}
                      </div>
                    </div>
                    <div class="flex justify-between mt-3 pt-3 border-t border-gray-100">
                      <span class="text-sm font-medium">Tổng tiền:</span>
                      <span class="text-sm font-bold">{{ formatCurrency(selectedOrder?.totalAmount) }}</span>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500 mt-1">
                    Không có thông tin chi tiết sản phẩm
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Cập nhật trạng thái đơn hàng</h4>
                      <div class="flex">
                        <select 
                          v-model="newStatus" 
                          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="PROCESSING">Đang xử lý</option>
                          <option value="SHIPPING">Đang giao hàng</option>
                          <option value="DELIVERED">Đã giao hàng</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Cập nhật trạng thái thanh toán</h4>
                      <div class="flex">
                        <select 
                          v-model="newPaymentStatus" 
                          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="PENDING">Chưa thanh toán</option>
                          <option value="PAID">Đã thanh toán</option>
                          <option value="FAILED">Thanh toán thất bại</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-end mt-4 space-x-3">
                    <button 
                      @click="saveOrderUpdates"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      :disabled="isProcessing"
                    >
                      <template v-if="isProcessing">
                        <span class="inline-block animate-spin mr-2">
                          <i class="fas fa-circle-notch"></i>
                        </span>
                        Đang xử lý...
                      </template>
                      <template v-else>
                        Lưu thay đổi
                      </template>
                    </button>
                    
                    <button 
                      @click="closeDetailModal"
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Đóng
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
import { useAuthStore } from '@/store/auth'
import api from '@/api'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const auth = useAuthStore()
const orders = ref([])
const isLoading = ref(false)
const loadingError = ref(null)

// State
const searchTerm = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const newStatus = ref('')
const newPaymentStatus = ref('')
const isProcessing = ref(false)

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
    // Check if we can use cached data first
    const lastAdminOrdersLoaded = localStorage.getItem('lastAdminOrdersLoaded');
    const cachedOrders = localStorage.getItem('adminCachedOrders');
    
    // If we have recent cached data (less than 5 minutes old), use it
    if (cachedOrders && lastAdminOrdersLoaded && 
        (Date.now() - parseInt(lastAdminOrdersLoaded)) < 5 * 60 * 1000) {
      console.log('Using recent cached admin orders');
      useAdminCachedOrders();
      isLoading.value = false;
      return;
    }
    
    // Otherwise, fetch fresh data
    console.log('Fetching fresh admin orders data');
    const response = await api.order.getOrders()
    
    // Kiểm tra phản hồi từ API
    if (Array.isArray(response)) {
      orders.value = response
      
      // Cache the orders data
      try {
        localStorage.setItem('adminCachedOrders', JSON.stringify(response));
        localStorage.setItem('lastAdminOrdersLoaded', Date.now().toString());
      } catch (e) {
        console.warn('Error saving admin orders to cache:', e);
      }
      
    } else if (response && Array.isArray(response.data)) {
      orders.value = response.data
      
      // Cache the orders data
      try {
        localStorage.setItem('adminCachedOrders', JSON.stringify(response.data));
        localStorage.setItem('lastAdminOrdersLoaded', Date.now().toString());
      } catch (e) {
        console.warn('Error saving admin orders to cache:', e);
      }
      
    } else if (response && typeof response === 'object') {
      orders.value = [response] // Trường hợp API trả về đơn đơn hàng
      
      // Cache the orders data
      try {
        localStorage.setItem('adminCachedOrders', JSON.stringify([response]));
        localStorage.setItem('lastAdminOrdersLoaded', Date.now().toString());
      } catch (e) {
        console.warn('Error saving admin orders to cache:', e);
      }
      
    } else {
      console.error('Invalid response format:', response)
      loadingError.value = 'Định dạng dữ liệu không hợp lệ'
      useAdminCachedOrders()
    }
    
    console.log('Orders loaded:', orders.value)
  } catch (error) {
    console.error('Error fetching orders:', error)
    
    // Check if it's an auth error
    if (error?.status === 401 || error?.response?.status === 401) {
      loadingError.value = 'Phiên đăng nhập hết hạn, đang sử dụng dữ liệu đã lưu'
      console.log('Authentication error during order fetch, using cached data')
    } else {
      loadingError.value = 'Không thể tải danh sách đơn hàng'
    }
    
    // Try to use cached data first
    useAdminCachedOrders()
  } finally {
    isLoading.value = false
  }
}

// Use cached admin orders
function useAdminCachedOrders() {
  const cachedOrders = localStorage.getItem('adminCachedOrders');
  if (cachedOrders) {
    try {
      const parsed = JSON.parse(cachedOrders);
      orders.value = parsed;
      console.log('Using cached admin orders data:', orders.value.length, 'orders loaded from cache');
      return true;
    } catch (e) {
      console.error('Error parsing cached admin orders:', e);
    }
  }
  
  // Fall back to default orders if no cache is available
  console.log('No cached admin orders available, using default data');
  useDefaultOrders();
  return false;
}

// Sử dụng dữ liệu mẫu khi API lỗi
function useDefaultOrders() {
  orders.value = [
    {
      id: 1,
      userId: 1,
      totalAmount: 3450000,
      shippingFee: 30000,
      status: "PENDING",
      paymentMethod: "COD",
      paymentStatus: "PENDING",
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
      paymentMethod: "bank",
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
}

// Lấy chi tiết đơn hàng theo ID
async function fetchOrderDetail(id) {
  try {
    if (!id) return null
    
    const response = await api.order.getOrder(id)
    console.log('Order detail:', response)
    
    if (response && response.id) {
      return response
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching order details for ID ${id}:`, error)
    return null
  }
}

// Cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, status) {
  if (!orderId || !status) {
    notificationService.showError('Thông tin cập nhật không hợp lệ')
    return
  }
  
  try {
    isLoading.value = true
    const response = await api.order.updateOrderStatus(orderId, status)
    console.log('Order status updated:', response)
    
    // Thông báo thành công
    notificationService.show('Cập nhật trạng thái đơn hàng thành công', {
      title: 'Thành công',
      type: 'success'
    })
    
    // Cập nhật lại danh sách đơn hàng
    await fetchOrders()
  } catch (error) {
    console.error('Error updating order status:', error)
    notificationService.showError('Không thể cập nhật trạng thái đơn hàng')
  } finally {
    isLoading.value = false
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
async function viewOrderDetails(order) {
  try {
    isLoading.value = true
    
    // Fetch detailed order information from API
    const detailedOrder = await fetchOrderDetail(order.id)
    
    if (detailedOrder) {
      selectedOrder.value = detailedOrder
    } else {
      // Fallback to the basic order info if detailed info cannot be fetched
      selectedOrder.value = order
    }
    
    newStatus.value = selectedOrder.value.status
    newPaymentStatus.value = selectedOrder.value.paymentStatus
    showDetailModal.value = true
  } catch (error) {
    console.error('Error viewing order details:', error)
    notificationService.showError('Không thể tải chi tiết đơn hàng')
  } finally {
    isLoading.value = false
  }
}

// Close detail modal
function closeDetailModal() {
  showDetailModal.value = false
  selectedOrder.value = null
  newStatus.value = ''
  newPaymentStatus.value = ''
  
  // If any changes were made, refresh the orders list
  fetchOrders().catch(error => {
    console.error('Error refreshing orders:', error)
  })
}

// Save order updates
async function saveOrderUpdates() {
  if (!selectedOrder.value || !newStatus.value || !newPaymentStatus.value) {
    notificationService.showError('Thông tin trạng thái không hợp lệ')
    return
  }
  
  try {
    isProcessing.value = true
    
    // Update order status
    await updateOrderStatus(selectedOrder.value.id, newStatus.value)
    
    // Update payment status
    await api.order.updatePaymentStatus(selectedOrder.value.id, newPaymentStatus.value)
    
    // Thông báo thành công
    notificationService.show('Cập nhật trạng thái đơn hàng thành công', {
      title: 'Thành công',
      type: 'success'
    })
    
    // Cập nhật lại danh sách đơn hàng
    await fetchOrders()
  } catch (error) {
    console.error('Error saving order updates:', error)
    notificationService.showError('Không thể lưu thay đổi đơn hàng')
  } finally {
    isProcessing.value = false
  }
}

// Lấy màu cho trạng thái thanh toán
function getPaymentStatusColor(status) {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Hiển thị tên trạng thái thanh toán
function getPaymentStatusText(status) {
  switch (status) {
    case 'PAID':
      return 'Đã thanh toán'
    case 'PENDING':
      return 'Chưa thanh toán'
    case 'FAILED':
      return 'Thanh toán thất bại'
    default:
      return status
  }
}

// Hiển thị tên phương thức thanh toán
function getPaymentMethodText(method) {
  switch (method) {
    case 'cod':
      return 'Thanh toán khi nhận hàng (COD)'
    case 'bank':
      return 'Chuyển khoản ngân hàng'
    default:
      return method
  }
}

// Export orders to Excel
function exportOrders() {
  // TODO: Implement Excel export functionality
  console.log('Exporting orders to Excel...')
  notificationService.show('Tính năng xuất Excel đang được phát triển', {
    title: 'Thông báo',
    type: 'info'
  })
}

// Lấy danh sách đơn hàng khi component được khởi tạo
onMounted(async () => {
  console.log('Orders view mounted');
  console.log('Current route:', router.currentRoute.value.path);
  console.log('Auth status:', auth.isAuthenticated);
  
  // First check if user is authenticated and has admin role
  if (!auth.isAuthenticated) {
    console.error('User is not authenticated, using cached data if available');
    loadingError.value = 'Phiên đăng nhập không hợp lệ, đang sử dụng dữ liệu đã lưu';
    useAdminCachedOrders();
    return;
  }
  
  if (!auth.isAdmin) {
    console.error('User is not an admin, using cached data if available');
    loadingError.value = 'Bạn không có quyền quản trị, đang sử dụng dữ liệu đã lưu';
    useAdminCachedOrders();
    return;
  }
  
  try {
    // Thử lấy dữ liệu đơn hàng
    await fetchOrders();
  } catch (error) {
    console.error('Critical error loading orders:', error);
    
    // Fallback to cached data
    loadingError.value = 'Không thể tải dữ liệu đơn hàng, đang sử dụng dữ liệu đã lưu';
    useAdminCachedOrders();
    
    // Show notification only for serious errors, not auth errors
    if (!(error?.status === 401 || error?.response?.status === 401)) {
      notificationService.showError('Không thể tải dữ liệu đơn hàng');
    }
  }
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