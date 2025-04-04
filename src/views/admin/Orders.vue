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
                        <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ order.customerName }}</div>
                        <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ order.customerEmail }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Order date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ order.date }}</div>
                    <div class="text-xs text-gray-500">{{ order.time }}</div>
                  </td>
                  
                  <!-- Total price -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatPrice(order.total) }}đ</div>
                    <div class="text-xs text-gray-500">{{ order.itemCount }} sản phẩm</div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': order.status === 'Hoàn thành',
                        'bg-blue-100 text-blue-800': order.status === 'Đang giao',
                        'bg-yellow-100 text-yellow-800': order.status === 'Đang xử lý',
                        'bg-red-100 text-red-800': order.status === 'Đã hủy',
                        'bg-purple-100 text-purple-800': order.status === 'Chờ thanh toán'
                      }"
                    >
                      {{ order.status }}
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
                        @click="updateOrderStatus(order)"
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
                      <p class="text-sm text-gray-900">{{ selectedOrder?.customerName }}</p>
                      <p class="text-sm text-gray-500">{{ selectedOrder?.customerEmail }}</p>
                      <p class="text-sm text-gray-500">{{ selectedOrder?.customerPhone }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Thông tin đơn hàng</h4>
                      <p class="text-sm text-gray-900">Ngày đặt: {{ selectedOrder?.date }}</p>
                      <p class="text-sm text-gray-900">Trạng thái: 
                        <span 
                          class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-green-100 text-green-800': selectedOrder?.status === 'Hoàn thành',
                            'bg-blue-100 text-blue-800': selectedOrder?.status === 'Đang giao',
                            'bg-yellow-100 text-yellow-800': selectedOrder?.status === 'Đang xử lý',
                            'bg-red-100 text-red-800': selectedOrder?.status === 'Đã hủy',
                            'bg-purple-100 text-purple-800': selectedOrder?.status === 'Chờ thanh toán'
                          }"
                        >
                          {{ selectedOrder?.status }}
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
                
                <div class="border-t border-gray-200 py-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Danh sách sản phẩm</h4>
                  <div class="mt-2 space-y-3">
                    <div 
                      v-for="(item, index) in selectedOrder?.items" 
                      :key="index"
                      class="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div class="flex items-center">
                        <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100 mr-3">
                          <img :src="item.image" :alt="item.name" class="h-full w-full object-cover object-center">
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                          <div class="text-xs text-gray-500">
                            Số lượng: {{ item.quantity }} x {{ formatPrice(item.price) }}đ
                          </div>
                        </div>
                      </div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatPrice(item.price * item.quantity) }}đ
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 py-4">
                  <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500">Tổng tiền sản phẩm:</div>
                    <div class="text-sm font-medium text-gray-900">{{ formatPrice(selectedOrder?.subtotal) }}đ</div>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <div class="text-sm font-medium text-gray-500">Phí vận chuyển:</div>
                    <div class="text-sm font-medium text-gray-900">{{ formatPrice(selectedOrder?.shipping) }}đ</div>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <div class="text-sm font-medium text-gray-900">Tổng thanh toán:</div>
                    <div class="text-lg font-bold text-green-600">{{ formatPrice(selectedOrder?.total) }}đ</div>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex justify-between">
                    <select 
                      v-model="newStatus" 
                      class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option v-for="status in statusOptions" :key="status" :value="status">
                        {{ status }}
                      </option>
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
import AdminHeader from '@/components/admin/AdminHeader.vue'

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
  'Đang xử lý',
  'Đang giao',
  'Hoàn thành', 
  'Chờ thanh toán',
  'Đã hủy'
]

// Sample order data
const orders = ref([
  {
    id: 'ORD10001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@gmail.com',
    customerPhone: '0987654321',
    date: '15/04/2023',
    time: '10:30',
    total: 4500000,
    subtotal: 4300000,
    shipping: 200000,
    itemCount: 2,
    status: 'Hoàn thành',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        name: 'Sâm Ngọc Linh tươi 10 năm tuổi',
        price: 2500000,
        quantity: 1,
        image: '/src/assets/images/products/sam-tuoi.png'
      },
      {
        name: 'Rượu sâm ngọc linh 15 năm',
        price: 1800000,
        quantity: 1,
        image: '/src/assets/images/products/ruou-sam.png'
      }
    ]
  },
  {
    id: 'ORD10002',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@gmail.com',
    customerPhone: '0912345678',
    date: '14/04/2023',
    time: '14:45',
    total: 6700000,
    subtotal: 6500000,
    shipping: 200000,
    itemCount: 2,
    status: 'Đang giao',
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingAddress: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        name: 'Sâm Ngọc Linh tươi 15 năm tuổi',
        price: 5000000,
        quantity: 1,
        image: '/src/assets/images/products/sam-tuoi-15-nam.png'
      },
      {
        name: 'Trà sâm ngọc linh',
        price: 1500000,
        quantity: 1,
        image: '/src/assets/images/products/tra-sam.png'
      }
    ]
  },
  {
    id: 'ORD10003',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@gmail.com',
    customerPhone: '0923456789',
    date: '13/04/2023',
    time: '09:15',
    total: 3200000,
    subtotal: 3000000,
    shipping: 200000,
    itemCount: 1,
    status: 'Đang xử lý',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '789 Đường Lý Tự Trọng, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        name: 'Cao sâm ngọc linh 100g',
        price: 3000000,
        quantity: 1,
        image: '/src/assets/images/products/cao-sam.png'
      }
    ]
  },
  {
    id: 'ORD10004',
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@gmail.com',
    customerPhone: '0934567890',
    date: '12/04/2023',
    time: '16:20',
    total: 2200000,
    subtotal: 2000000,
    shipping: 200000,
    itemCount: 2,
    status: 'Chờ thanh toán',
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingAddress: '101 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        name: 'Trà sâm ngọc linh',
        price: 1500000,
        quantity: 1,
        image: '/src/assets/images/products/tra-sam.png'
      },
      {
        name: 'Kẹo sâm ngọc linh',
        price: 500000,
        quantity: 1,
        image: '/src/assets/images/products/keo-sam.png'
      }
    ]
  },
  {
    id: 'ORD10005',
    customerName: 'Hoàng Văn E',
    customerEmail: 'hoangvane@gmail.com',
    customerPhone: '0945678901',
    date: '11/04/2023',
    time: '11:05',
    total: 7500000,
    subtotal: 7300000,
    shipping: 200000,
    itemCount: 1,
    status: 'Đã hủy',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '202 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        name: 'Sâm Ngọc Linh tươi 20 năm tuổi',
        price: 7300000,
        quantity: 1,
        image: '/src/assets/images/products/sam-tuoi-20-nam.png'
      }
    ]
  }
])

// Filtered orders
const filteredOrders = computed(() => {
  let result = orders.value

  // Filter by search term
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(searchLower) || 
      order.customerName.toLowerCase().includes(searchLower) || 
      order.customerEmail.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    result = result.filter(order => order.status === selectedStatus.value)
  }

  return result
})

// Format currency
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price)
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

// Update order status
function updateOrderStatus(order) {
  selectedOrder.value = order
  newStatus.value = order.status
  showDetailModal.value = true
}

// Save order status
function saveOrderStatus() {
  if (selectedOrder.value) {
    // Find the order and update its status
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus.value
      selectedOrder.value.status = newStatus.value
      
      // In a real app, you would call an API to update the status
      // api.updateOrderStatus(selectedOrder.value.id, newStatus.value)
      
      // Show success message (in a real app)
      // toast.success('Trạng thái đơn hàng đã được cập nhật')
    }
  }
}

// Export orders to Excel
function exportOrders() {
  // In a real app, this would call a function to export to Excel
  console.log('Exporting orders to Excel...')
  alert('Tính năng xuất Excel đang được phát triển')
}

// Lifecycle
onMounted(() => {
  // In a real app, this would fetch orders from an API
  // api.getOrders().then(data => {
  //   orders.value = data
  // })
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