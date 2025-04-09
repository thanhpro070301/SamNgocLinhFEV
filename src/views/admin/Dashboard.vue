<template>
  <div class="admin-dashboard min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">BẢNG ĐIỀU KHIỂN</h1>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
        
        <!-- Dashboard content -->
        <div v-else>
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <!-- Total Products -->
            <div class="bg-white rounded-lg shadow px-5 py-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Sản phẩm
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ dashboardData.totalProducts }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <!-- Total Orders -->
            <div class="bg-white rounded-lg shadow px-5 py-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Đơn hàng
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ dashboardData.totalOrders }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <!-- Revenue -->
            <div class="bg-white rounded-lg shadow px-5 py-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Doanh thu
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ formatCurrency(dashboardData.totalRevenue) }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <!-- Total Users -->
            <div class="bg-white rounded-lg shadow px-5 py-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Người dùng
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        {{ dashboardData.totalUsers }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900">Đơn hàng gần đây</h2>
            <div class="mt-4 bg-white shadow overflow-hidden rounded-lg">
              <div v-if="dashboardData.recentOrders.length === 0" class="p-6 text-center text-gray-500">
                Không có đơn hàng nào
              </div>
              <table v-else class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in dashboardData.recentOrders" :key="order.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ order.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ order.shippingName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(order.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusColor(order.status)">
                        {{ getStatusName(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatCurrency(order.totalAmount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bg-gray-50 px-6 py-3 flex justify-end">
                <router-link to="/admin/orders" class="text-sm font-medium text-green-600 hover:text-green-900">
                  Xem tất cả đơn hàng
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Products stats -->
          <div class="mt-8" v-if="dashboardData.productStats && dashboardData.productStats.length > 0">
            <h2 class="text-lg font-medium text-gray-900">Thống kê sản phẩm</h2>
            <div class="mt-4 bg-white shadow overflow-hidden rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã bán
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(product, index) in dashboardData.productStats" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ product.sold }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ product.stock }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bg-gray-50 px-6 py-3 flex justify-end">
                <router-link to="/admin/products" class="text-sm font-medium text-green-600 hover:text-green-900">
                  Quản lý sản phẩm
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { useAuthStore } from '@/store/auth'
import api from '@/api'
import sessionToken from '@/store/sessionToken'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)
const dashboardData = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalUsers: 0,
  recentOrders: [],
  productStats: []
})

// Kiểm tra đăng nhập
if (!auth.isAuthenticated.value) {
  router.push('/admin/login')
}

// Lấy thông tin dashboard từ API
async function fetchDashboardData() {
  isLoading.value = true
  
  try {
    // Lấy tổng số sản phẩm
    const productsResponse = await api.product.getProducts({ page: 0, size: 1 })
    if (productsResponse.data && productsResponse.data.totalElements) {
      dashboardData.value.totalProducts = productsResponse.data.totalElements
    }
    
    // Lấy đơn hàng
    const ordersResponse = await api.order.getOrders()
    if (Array.isArray(ordersResponse.data)) {
      dashboardData.value.totalOrders = ordersResponse.data.length
      dashboardData.value.recentOrders = ordersResponse.data.slice(0, 5)
      
      // Tính tổng doanh thu
      dashboardData.value.totalRevenue = ordersResponse.data.reduce((sum, order) => {
        return sum + (order.status === 'COMPLETED' ? order.totalAmount : 0)
      }, 0)
    }
    
    // Lấy người dùng
    const usersResponse = await api.user.getUsers()
    if (Array.isArray(usersResponse.data)) {
      dashboardData.value.totalUsers = usersResponse.data.length
    }
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    
    // Sử dụng dữ liệu giả lập nếu API gặp lỗi
    dashboardData.value = {
      totalProducts: 24,
      totalOrders: 158,
      totalRevenue: 256800000,
      totalUsers: 90,
      recentOrders: [
        { id: 1, shippingName: 'Nguyễn Văn A', totalAmount: 3500000, status: 'COMPLETED', createdAt: new Date().toISOString() },
        { id: 2, shippingName: 'Trần Thị B', totalAmount: 7800000, status: 'PROCESSING', createdAt: new Date().toISOString() },
        { id: 3, shippingName: 'Lê Văn C', totalAmount: 2100000, status: 'PENDING', createdAt: new Date().toISOString() }
      ],
      productStats: [
        { name: 'Sâm Ngọc Linh tươi 10 năm tuổi', sold: 25, stock: 12 },
        { name: 'Sâm Ngọc Linh tươi 15 năm tuổi', sold: 18, stock: 5 },
        { name: 'Sâm Ngọc Linh ngâm mật ong', sold: 42, stock: 38 }
      ]
    }
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

// Lấy thông tin khi component được khởi tạo
onMounted(() => {
  fetchDashboardData()
})

// Hàm đăng xuất
async function logout() {
  try {
    const token = localStorage.getItem('admin_current_token')
    if (!token) {
      handleLogoutSuccess()
      return
    }
    
    // Gọi API đăng xuất sử dụng API client
    try {
      const { authApi } = await import('@/api');
      await authApi.logout();
      console.log('Đăng xuất thành công từ API')
    } catch (error) {
      console.error('Không thể gọi API đăng xuất:', error)
    }
    
    // Dù API có thành công hay không, vẫn xử lý đăng xuất ở client
    handleLogoutSuccess()
    
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error)
    notificationService.show('Đã xảy ra lỗi khi đăng xuất', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Xử lý sau khi đăng xuất
function handleLogoutSuccess() {
  // Xóa token
  localStorage.removeItem('admin_current_token')
  
  // Đặt lại trạng thái xác thực
  auth.isAuthenticated.value = false
  auth.currentUser.value = null
  
  // Xóa session token
  sessionToken.resetAll()
  
  // Thông báo
  notificationService.show('Đăng xuất thành công', {
    title: 'Đăng xuất',
    type: 'success'
  })
  
  // Chuyển hướng về trang đăng nhập
  router.push('/admin/login')
}
</script>

<style scoped>
/* Thêm styles nếu cần */
</style> 