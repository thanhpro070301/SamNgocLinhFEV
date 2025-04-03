<template>
  <div class="admin-dashboard bg-gray-50 min-h-screen">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Dashboard title -->
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">Tổng quan</h1>
        </div>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <!-- Card 1 - Số lượng đơn hàng -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Đơn hàng</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.orders }}</p>
              </div>
              <div class="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center">
                <i class="fas fa-shopping-cart text-green-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-500 font-medium flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> {{ stats.orderGrowth }}%
              </span>
              <span class="text-gray-500 ml-2">so với tháng trước</span>
            </div>
          </div>
          
          <!-- Card 2 - Doanh thu -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Doanh thu</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.revenue }}M</p>
              </div>
              <div class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center">
                <i class="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-500 font-medium flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> {{ stats.revenueGrowth }}%
              </span>
              <span class="text-gray-500 ml-2">so với tháng trước</span>
            </div>
          </div>
          
          <!-- Card 3 - Sản phẩm -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Sản phẩm</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.products }}</p>
              </div>
              <div class="bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center">
                <i class="fas fa-box text-purple-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-gray-500">Tổng số sản phẩm đang bán</span>
            </div>
          </div>
          
          <!-- Card 4 - Khách hàng -->
          <div class="bg-white rounded-lg shadow p-5">
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Khách hàng</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.customers }}</p>
              </div>
              <div class="bg-orange-100 rounded-full h-12 w-12 flex items-center justify-center">
                <i class="fas fa-users text-orange-600 text-xl"></i>
              </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-green-500 font-medium flex items-center">
                <i class="fas fa-arrow-up mr-1"></i> {{ stats.customerGrowth }}%
              </span>
              <span class="text-gray-500 ml-2">mới trong tuần này</span>
            </div>
          </div>
        </div>
        
        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Chart 1 - Doanh thu theo tháng -->
          <div class="bg-white p-5 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Doanh thu theo tháng</h2>
            <div class="chart-container" style="position: relative; height:300px;">
              <div class="flex items-center justify-center h-full text-gray-500">
                <p>Biểu đồ doanh thu theo tháng sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
          
          <!-- Chart 2 - Sản phẩm bán chạy -->
          <div class="bg-white p-5 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Sản phẩm bán chạy</h2>
            <div class="chart-container" style="position: relative; height:300px;">
              <div class="flex items-center justify-center h-full text-gray-500">
                <p>Biểu đồ sản phẩm bán chạy sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Orders -->
        <div class="bg-white p-5 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Đơn hàng gần đây</h2>
            <router-link to="/admin/orders" class="text-sm text-blue-600 hover:text-blue-800">
              Xem tất cả
            </router-link>
          </div>
          
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
                    Ngày
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
                <tr v-for="order in recentOrders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ order.customer }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': order.status === 'Hoàn thành',
                        'bg-yellow-100 text-yellow-800': order.status === 'Đang xử lý',
                        'bg-blue-100 text-blue-800': order.status === 'Đang giao',
                        'bg-red-100 text-red-800': order.status === 'Đã hủy'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

// Dữ liệu mẫu cho Dashboard
const stats = ref({
  orders: 245,
  orderGrowth: 12,
  revenue: 78.5,
  revenueGrowth: 8.2,
  products: 36,
  customers: 1240,
  customerGrowth: 5.3
})

// Dữ liệu mẫu cho đơn hàng gần đây
const recentOrders = ref([
  { id: 1001, customer: 'Nguyễn Văn A', date: '12/09/2023', status: 'Hoàn thành', value: '2.500.000 đ' },
  { id: 1002, customer: 'Trần Thị B', date: '11/09/2023', status: 'Đang giao', value: '1.800.000 đ' },
  { id: 1003, customer: 'Phạm Văn C', date: '10/09/2023', status: 'Đang xử lý', value: '3.200.000 đ' },
  { id: 1004, customer: 'Lê Thị D', date: '09/09/2023', status: 'Hoàn thành', value: '1.250.000 đ' },
  { id: 1005, customer: 'Hoàng Văn E', date: '08/09/2023', status: 'Đã hủy', value: '950.000 đ' }
])
</script>

<style scoped>
/* Thêm styles nếu cần */
</style> 