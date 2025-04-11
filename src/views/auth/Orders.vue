<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Đơn hàng của tôi</h1>
        <router-link to="/profile" class="text-green-600 hover:text-green-800">
          <i class="fas fa-arrow-left mr-1"></i> Quay lại tài khoản
        </router-link>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>
      
      <div v-else>
        <!-- Filter options -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
            <select 
              v-model="filters.status" 
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="DELIVERED">Đã giao hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
            <select 
              v-model="filters.timeRange" 
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="">Tất cả thời gian</option>
              <option value="last30">30 ngày qua</option>
              <option value="last90">90 ngày qua</option>
              <option value="last180">180 ngày qua</option>
            </select>
          </div>
          
          <div class="ml-auto">
            <button 
              @click="loadOrders" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-sync-alt mr-2"></i> Làm mới
            </button>
          </div>
        </div>
        
        <!-- Orders list -->
        <div v-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="text-gray-400 mb-4">
            <i class="fas fa-shopping-bag text-5xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Không có đơn hàng nào</h3>
          <p class="text-gray-500 mb-4">Bạn chưa có đơn hàng nào trong khoảng thời gian này</p>
          <router-link 
            to="/products" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Mua sắm ngay
          </router-link>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">#{{ order.id }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ formatPrice(order.totalAmount) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getOrderStatusClass(order.status)"
                  >
                    {{ getOrderStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getPaymentStatusClass(order.paymentStatus)"
                  >
                    {{ getPaymentStatusText(order.paymentStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <router-link 
                    :to="`/order-tracking?orderId=${order.id}`" 
                    class="text-green-600 hover:text-green-900 mr-3"
                  >
                    Chi tiết
                  </router-link>
                  
                  <button 
                    v-if="order.status === 'PENDING'"
                    @click="cancelOrder(order.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Hủy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useNotificationService } from '@/composables/useNotificationService'
import api from '@/api'

const router = useRouter()
const auth = useAuthStore()
const notificationService = useNotificationService()

const loading = ref(true)
const error = ref(null)
const orders = ref([])
const filters = ref({
  status: '',
  timeRange: ''
})

// Load orders
async function loadOrders() {
  if (!auth.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    // Call API to get orders
    const response = await api.order.getMyOrders()
    
    // Process API response
    if (Array.isArray(response)) {
      orders.value = response
    } else if (response?.data && Array.isArray(response.data)) {
      orders.value = response.data
    } else {
      // Fallback for testing
      orders.value = []
    }
    
    // Sort orders by date (newest first)
    orders.value.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    
  } catch (err) {
    console.error('Error loading orders:', err)
    error.value = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

// Apply filters to orders
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // Filter by status
  if (filters.value.status) {
    result = result.filter(order => order.status === filters.value.status)
  }
  
  // Filter by time range
  if (filters.value.timeRange) {
    const now = new Date()
    let filterDate = new Date()
    
    switch (filters.value.timeRange) {
      case 'last30':
        filterDate.setDate(now.getDate() - 30)
        break
      case 'last90':
        filterDate.setDate(now.getDate() - 90)
        break
      case 'last180':
        filterDate.setDate(now.getDate() - 180)
        break
    }
    
    result = result.filter(order => new Date(order.createdAt) >= filterDate)
  }
  
  return result
})

// Cancel order
async function cancelOrder(orderId) {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
    return
  }
  
  try {
    loading.value = true
    
    // Call API to cancel order
    await api.order.cancelOrder(orderId)
    
    // Reload orders
    await loadOrders()
    
    // Show success notification
    notificationService.showSuccess('Đã hủy đơn hàng thành công')
  } catch (err) {
    console.error('Error cancelling order:', err)
    notificationService.showError('Không thể hủy đơn hàng. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

// Get order status text
function getOrderStatusText(status) {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận'
    case 'PROCESSING': return 'Đang xử lý'
    case 'SHIPPING': return 'Đang giao hàng'
    case 'DELIVERED': return 'Đã giao hàng'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
  }
}

// Get order status class
function getOrderStatusClass(status) {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'PROCESSING': return 'bg-blue-100 text-blue-800'
    case 'SHIPPING': return 'bg-indigo-100 text-indigo-800'
    case 'DELIVERED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Get payment status text
function getPaymentStatusText(status) {
  switch (status) {
    case 'PENDING': return 'Chưa thanh toán'
    case 'PAID': return 'Đã thanh toán'
    case 'FAILED': return 'Thanh toán thất bại'
    default: return status
  }
}

// Get payment status class
function getPaymentStatusClass(status) {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'PAID': return 'bg-green-100 text-green-800'
    case 'FAILED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Load orders when component is mounted
onMounted(() => {
  loadOrders()
})
</script> 