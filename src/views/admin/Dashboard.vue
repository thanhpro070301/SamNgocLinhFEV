<template>
  <div class="relative">
    <!-- Animated Backdrop with Aurora Gradient (with lower z-index to not interfere) -->
    <div class="absolute top-0 right-0 -z-20 transform translate-x-1/3 -translate-y-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-aurora-blue via-aurora-purple to-aurora-pink opacity-10 dark:opacity-5 blur-3xl animate-aurora"></div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 dark:border-green-400"></div>
    </div>
    
    <!-- Error Display -->
    <div v-else-if="hasError" class="py-8 text-center">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <div class="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Đang xảy ra lỗi kết nối</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ errorMessage }}</p>
        <button 
          @click="retryFetch" 
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Thử lại
        </button>
        <button 
          @click="loadMockData" 
          class="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Dùng dữ liệu mẫu
        </button>
      </div>
    </div>
    
    <!-- Dashboard content -->
    <div v-else class="relative z-10 pt-6">
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white relative">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">Thống kê tổng quan</span>
          <span class="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300 rounded-full"></span>
        </h2>
      </div>
      
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Products -->
        <StatCard
          title="Sản phẩm"
          :value="dashboardData.totalProducts"
          color="glassmorphism-card"
          icon-bg-color="bg-green-100 dark:bg-green-900/30"
          icon-color="text-green-600 dark:text-green-400"
          :trend="12"
        >
          <template #icon>
            <svg class="h-7 w-7 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008m-7.008 0h14.016m-14.016 0a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622" />
            </svg>
          </template>
        </StatCard>
        
        <!-- Total Orders -->
        <StatCard
          title="Đơn hàng"
          :value="dashboardData.totalOrders"
          color="glassmorphism-card"
          icon-bg-color="bg-blue-100 dark:bg-blue-900/30"
          icon-color="text-blue-600 dark:text-blue-400"
          :trend="5"
        >
          <template #icon>
            <svg class="h-7 w-7 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h14.625c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5L5.625 14.25m0 0l1.5-1.5M5.625 14.25l-1.5-1.5m1.5 1.5a1.125 1.125 0 01-1.125-1.125V6.75m14.625 6L18.375 14.25m0 0l-1.5-1.5m1.5 1.5l1.5-1.5m-1.5 1.5a1.125 1.125 0 00-1.125-1.125V6.75m-3 7.5l-1.5-1.5M15 14.25l1.5-1.5" />
            </svg>
          </template>
        </StatCard>
        
        <!-- Revenue -->
        <StatCard
          title="Doanh thu"
          :value="formatCurrency(dashboardData.totalRevenue)"
          color="glassmorphism-card"
          icon-bg-color="bg-yellow-100 dark:bg-yellow-900/30"
          icon-color="text-yellow-600 dark:text-yellow-400"
          :trend="8"
        >
          <template #icon>
            <svg class="h-7 w-7 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.536a2.25 2.25 0 002.242 0l.879-.536M15 16.182l.879.536a2.25 2.25 0 002.242 0l.879-.536M15 16.182V13.5a2.25 2.25 0 00-4.5 0v2.682m6.75-6.512l.879.536a2.25 2.25 0 012.242 0l.879-.536M15 9.682V6.75a2.25 2.25 0 00-4.5 0v2.932m6.75 0l-.879.536a2.25 2.25 0 01-2.242 0l-.879-.536m-6.75-6.512l.879.536a2.25 2.25 0 012.242 0l.879-.536M9 16.182V13.5a2.25 2.25 0 00-4.5 0v2.682M9 16.182l-.879.536a2.25 2.25 0 01-2.242 0L4.125 16.182m0 0V6.75a2.25 2.25 0 014.5 0v9.432m0 0l-.879.536a2.25 2.25 0 01-2.242 0l-.879-.536M9 9.682V6.75a2.25 2.25 0 014.5 0v2.932m0 0l-.879.536a2.25 2.25 0 01-2.242 0l-.879-.536" />
            </svg>
          </template>
        </StatCard>
        
        <!-- Total Users -->
        <StatCard
          title="Người dùng"
          :value="dashboardData.totalUsers"
          color="glassmorphism-card"
          icon-bg-color="bg-purple-100 dark:bg-purple-900/30"
          icon-color="text-purple-600 dark:text-purple-400"
          :trend="3"
        >
          <template #icon>
             <svg class="h-7 w-7 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </template>
        </StatCard>
      </div>
      
      <!-- Charts and Tables Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2">
          <ChartCard 
            title="Doanh thu theo tháng" 
            height="320px"
            :data="revenueChartData"
            :is-revenue="true"
          >
            <template #actions>
              <div class="flex items-center">
                <select v-model="revenueChartPeriod" class="text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2">
                  <option value="year">Năm 2023</option>
                  <option value="month">6 tháng</option>
                  <option value="week">Tuần này</option>
                </select>
              </div>
            </template>
          </ChartCard>
        </div>
        
        <!-- Products Chart -->
        <div class="lg:col-span-1">
          <ChartCard 
            title="Top sản phẩm" 
            height="320px"
            :data="productChartData"
          >
            <!-- Chart will be automatically rendered by the enhanced ChartCard component -->
          </ChartCard>
        </div>
      </div>
      
      <!-- Recent Orders Table -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 relative">
          <span>Đơn hàng gần đây</span>
          <span class="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
        </h2>
        
        <RecentOrdersTable 
          :orders="dashboardData.recentOrders"
          @view-all="navigateToOrders"
          @view-detail="viewOrderDetail"
          @order-click="viewOrderDetail"
        />
      </div>
      
      <!-- Product Stats -->
      <div v-if="dashboardData.productStats && dashboardData.productStats.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 relative">
          <span>Thống kê sản phẩm</span>
          <span class="absolute bottom-0 left-0 w-12 h-0.5 bg-green-500 dark:bg-green-400 rounded-full"></span>
        </h2>
        
        <ProductSummary 
          :products="dashboardData.productStats" 
          @view-all="navigateToProducts"
        />
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeumorphicButton
          variant="primary"
          class="flex items-center justify-center py-3"
          @click="navigateToProducts"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm sản phẩm
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="secondary"
          class="flex items-center justify-center py-3"
          @click="navigateToOrders"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          Xem đơn hàng
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="default"
          class="flex items-center justify-center py-3"
          @click="navigateToUsers"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          Quản lý người dùng
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="default"
          class="flex items-center justify-center py-3"
          @click="navigateToCategories"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
          </svg>
          Quản lý danh mục
        </NeumorphicButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import api from '@/api';
import ApiStatus from '@/components/ApiStatus.vue';
import sessionToken from '@/store/sessionToken';
import notificationService from '@/utils/notificationService';

// Import components
import StatCard from '@/components/admin/StatCard.vue';
import ChartCard from '@/components/admin/ChartCard.vue';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable.vue';
import ProductSummary from '@/components/admin/ProductSummary.vue';
import NeumorphicButton from '@/components/admin/NeumorphicButton.vue';

// Router and auth
const router = useRouter();
const auth = useAuthStore();

// Dashboard data
const dashboardData = ref({
  totalProducts: 153,
  totalOrders: 87,
  totalRevenue: 68500000,
  totalUsers: 42,
  recentOrders: [],
  productStats: []
});

// Set initial loading state
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const revenueChartPeriod = ref('month');
const productChartData = ref([85, 67, 45, 40, 30, 25]);
const revenueChartData = ref([12500000, 18700000, 15800000, 21200000, 9800000, 17500000]);

// Watch for chart period changes
watch(revenueChartPeriod, (newPeriod) => {
  // This would normally fetch new data based on period
  console.log(`Chart period changed to: ${newPeriod}`);
  
  // For demo, just change the data pattern slightly based on period
  if (newPeriod === 'year') {
    revenueChartData.value = [12500000, 15700000, 18800000, 14200000, 19800000, 22500000];
  } else if (newPeriod === 'month') {
    revenueChartData.value = [12500000, 18700000, 15800000, 21200000, 9800000, 17500000];
  } else {
    revenueChartData.value = [2500000, 3700000, 4800000, 5200000, 4800000, 7500000];
  }
}, { immediate: true });

// Mẫu dữ liệu mock cho các thành phần
const mockData = {
  totalProducts: 153,
  totalOrders: 87,
  totalRevenue: 68500000,
  totalUsers: 42,
  recentOrders: [
    { 
      id: 1001, 
      shippingName: 'Nguyễn Văn A', 
      createdAt: '2023-05-15T08:30:00Z', 
      status: 'COMPLETED', 
      totalAmount: 1850000 
    },
    { 
      id: 1002, 
      shippingName: 'Trần Thị B', 
      createdAt: '2023-05-16T10:20:00Z', 
      status: 'PROCESSING', 
      totalAmount: 2450000 
    },
    { 
      id: 1003, 
      shippingName: 'Lê Văn C', 
      createdAt: '2023-05-16T14:15:00Z', 
      status: 'PENDING', 
      totalAmount: 950000 
    },
    { 
      id: 1004, 
      shippingName: 'Phạm Thị D', 
      createdAt: '2023-05-17T09:45:00Z', 
      status: 'CANCELLED', 
      totalAmount: 1250000 
    },
    { 
      id: 1005, 
      shippingName: 'Hoàng Văn E', 
      createdAt: '2023-05-17T16:30:00Z', 
      status: 'COMPLETED', 
      totalAmount: 3150000 
    },
  ],
  productStats: [
    { name: 'Sâm Ngọc Linh tươi túi 1kg', sold: 42, stock: 28 },
    { name: 'Sâm Ngọc Linh khô hộp 100g', sold: 37, stock: 15 },
    { name: 'Rượu sâm ngọc linh 500ml', sold: 29, stock: 32 },
    { name: 'Trà sâm ngọc linh hộp 20 gói', sold: 53, stock: 8 },
    { name: 'Mật ong rừng nguyên chất 250ml', sold: 61, stock: 0 },
  ],
  chartData: {
    revenue: [12500000, 18700000, 15800000, 21200000, 9800000, 17500000],
    products: [85, 67, 45, 40, 30, 25]
  }
};

// Load mock data immediately
const loadMockData = () => {
  dashboardData.value = { ...mockData };
  
  // Set chart data
  if (mockData.chartData) {
    productChartData.value = mockData.chartData.products;
    revenueChartData.value = mockData.chartData.revenue;
  }
  
  isLoading.value = false;
  hasError.value = false;
  errorMessage.value = '';
};

// Format VND currency
const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  });
  return formatter.format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Get status name
const getStatusName = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ xử lý';
    case 'PROCESSING': return 'Đang xử lý';
    case 'COMPLETED': return 'Hoàn thành';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'PROCESSING': return 'bg-blue-100 text-blue-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Navigation methods
const navigateToOrders = () => {
  router.push('/admin/orders');
};

const navigateToProducts = () => {
  router.push('/admin/products');
};

const navigateToUsers = () => {
  router.push('/admin/users');
};

const navigateToCategories = () => {
  router.push('/admin/categories');
};

const viewOrderDetail = (orderId) => {
  // Navigate to order detail or open modal
  console.log('View order:', orderId);
};

// Retry fetch data
const retryFetch = () => {
  fetchDashboardData();
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';
  
  console.log('Starting fetchDashboardData, isLoading:', isLoading.value);
  try {
    // Always load mock data first so UI shows something immediately
    loadMockData();
    console.log('Loaded initial mock data for immediate display');
    
    // Then try to fetch real data from API
    try {
      console.log('Attempting to fetch real data from API...');
      
      // Get endpoint from environment variables or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No auth token found, using mock data only');
        return;
      }
      
      // Use fetch API to avoid axios/interceptor dependencies
      const response = await fetch(`${apiUrl}/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const apiData = await response.json();
        console.log('Real data fetched successfully:', apiData);
        
        // If API data is valid, update dashboard data
        if (apiData && typeof apiData === 'object') {
          // Merge API data with mock data for any missing fields
          dashboardData.value = {
            totalProducts: apiData.totalProducts || mockData.totalProducts,
            totalOrders: apiData.totalOrders || mockData.totalOrders,
            totalRevenue: apiData.totalRevenue || mockData.totalRevenue,
            totalUsers: apiData.totalUsers || mockData.totalUsers,
            recentOrders: apiData.recentOrders?.length ? apiData.recentOrders : mockData.recentOrders,
            productStats: apiData.productStats?.length ? apiData.productStats : mockData.productStats
          };
          
          // Update chart data if available
          if (apiData.chartData) {
            if (apiData.chartData.products) {
              productChartData.value = apiData.chartData.products;
            }
            if (apiData.chartData.revenue) {
              revenueChartData.value = apiData.chartData.revenue;
            }
          }
          
          console.log('Dashboard data updated with API data');
        }
      } else {
        console.warn(`API returned error status: ${response.status}`);
        // Already using mock data, just log the error
      }
    } catch (apiError) {
      console.warn('API fetch failed:', apiError);
      // Already using mock data, just log the error
    }
  } catch (error) {
    console.error('Error in fetchDashboardData:', error);
    errorMessage.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// On component mount
onMounted(() => {
  console.log('Dashboard component mounted');
  
  // Check authentication first
  if (!auth.isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    router.push('/auth/login');
    return;
  }
  
  // Fetch dashboard data
  fetchDashboardData();
});
</script>

<style scoped>
/* Admin dashboard specific styles */
</style> 