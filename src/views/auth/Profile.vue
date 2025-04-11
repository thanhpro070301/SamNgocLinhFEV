<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Tài khoản của tôi</h1>
      
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- User info section -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center mb-6">
            <div class="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold mr-6">
              {{ userInitials }}
            </div>
            <div>
              <h2 class="text-xl font-semibold">{{ userName }}</h2>
              <p class="text-gray-600">{{ user?.email }}</p>
              <p class="text-gray-600">{{ user?.phone || 'Chưa cập nhật số điện thoại' }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-medium mb-2">Thông tin tài khoản</h3>
              <div class="text-sm text-gray-600 space-y-2">
                <p><span class="font-medium">Họ tên:</span> {{ userName }}</p>
                <p><span class="font-medium">Email:</span> {{ user?.email }}</p>
                <p><span class="font-medium">Số điện thoại:</span> {{ user?.phone || 'Chưa cập nhật' }}</p>
                <p><span class="font-medium">Ngày tham gia:</span> {{ formatDate(user?.createdAt) }}</p>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="font-medium mb-2">Địa chỉ giao hàng mặc định</h3>
              <div v-if="user?.address" class="text-sm text-gray-600">
                {{ user.address }}
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                Chưa cập nhật địa chỉ giao hàng
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              @click="editProfile" 
              class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
        
        <!-- Recent orders section -->
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
          
          <div v-if="recentOrders.length === 0" class="text-gray-500 text-center py-6">
            Bạn chưa có đơn hàng nào
          </div>
          
          <div v-else class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
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
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <router-link 
                      :to="`/order-tracking?orderId=${order.id}`" 
                      class="text-green-600 hover:text-green-900"
                    >
                      Chi tiết
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 text-right">
            <router-link 
              to="/orders" 
              class="text-green-600 hover:text-green-800 font-medium"
            >
              Xem tất cả đơn hàng <i class="fas fa-chevron-right ml-1"></i>
            </router-link>
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
import { authApi } from '@/api'
import { validateAuthState, hasValidToken } from '@/utils/authHelper'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const error = ref(null)
const user = computed(() => auth.user)
const recentOrders = ref([])

// Computed values
const userName = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
})

const userInitials = computed(() => {
  if (!user.value) return ''
  const firstName = user.value.firstName || ''
  const lastName = user.value.lastName || ''
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

// Load user profile and recent orders
onMounted(async () => {
  try {
    loading.value = true;
    
    // CRITICAL SAFETY CHECK: Ensure no auth data exists if token is missing
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true' || 
                      sessionStorage.getItem('isAuthenticated') === 'true';
    
    // If auth flag is true but no token exists, or if token exists but auth flag is false,
    // this is an inconsistent state - force clear everything
    if ((isAuthFlag && !token) || (token && !isAuthFlag)) {
      console.error('CRITICAL: Inconsistent auth state detected! Clearing all auth data');
      await auth.logout(false);
      router.replace('/auth/login?reason=inconsistent_auth_state');
      return;
    }
    
    // Simple check - if no token, redirect to login immediately
    if (!token) {
      console.log('No auth token found, redirecting to login');
      await auth.logout(false); // Ensure all auth data is cleared
      router.replace('/auth/login?redirect=/profile&reason=no_token');
      return;
    }
    
    // Check if we've been redirecting in a loop
    let redirectCount = parseInt(sessionStorage.getItem('redirect_count') || '0');
    redirectCount++;
    sessionStorage.setItem('redirect_count', redirectCount.toString());
    
    // If we're in a redirect loop, force clear everything and stop
    if (redirectCount > 3) {
      console.error('Profile: Too many redirects detected, forcing complete logout');
      sessionStorage.removeItem('redirect_count');
      await auth.logout(true);
      return;
    }
    
    // Before making any API calls, validate token
    console.log('Validating token before loading profile...');
    const tokenValid = await validateToken();
    if (!tokenValid) {
      console.error('Token validation failed, performing complete logout');
      await auth.logout(false);
      router.replace('/auth/login?reason=invalid_token');
      return;
    }
    
    // Token is valid, reset redirect counter
    sessionStorage.removeItem('redirect_count');
    
    // Load user profile if needed
    if (!auth.user) {
      console.log('Auth user not found in store, fetching profile...');
      const profileLoaded = await fetchUserProfile();
      if (!profileLoaded) {
        console.error('Failed to load user profile, redirecting to login');
        await auth.logout(false);
        router.replace('/auth/login?reason=profile_load_failed');
        return;
      }
    }
    
    // ORDERS SECTION - Only if we're fully authenticated
    try {
      // First check if we should use cached data
      const lastOrdersLoaded = localStorage.getItem('lastOrdersLoaded');
      const cachedOrders = localStorage.getItem('cachedOrders');
      
      // If we have cached data and it's recent (less than 5 minutes old), use it
      if (cachedOrders && lastOrdersLoaded && 
          (Date.now() - parseInt(lastOrdersLoaded)) < 5 * 60 * 1000) {
        console.log('Using recent cached orders data');
        useOrdersCache();
      } else {
        // Otherwise fetch fresh data
        console.log('Loading fresh orders data...');
        try {
          const ordersResponse = await api.order.getMyOrders();
          
          if (Array.isArray(ordersResponse)) {
            recentOrders.value = ordersResponse.slice(0, 5);
            localStorage.setItem('cachedOrders', JSON.stringify(ordersResponse.slice(0, 5)));
            localStorage.setItem('lastOrdersLoaded', Date.now().toString());
          } else if (ordersResponse?.data && Array.isArray(ordersResponse.data)) {
            recentOrders.value = ordersResponse.data.slice(0, 5);
            localStorage.setItem('cachedOrders', JSON.stringify(ordersResponse.data.slice(0, 5)));
            localStorage.setItem('lastOrdersLoaded', Date.now().toString());
          } else {
            // If API returned success but no data, use empty array
            recentOrders.value = [];
            console.log('No orders data available');
          }
        } catch (apiError) {
          // For API errors, check if it's unauthorized or other error
          if (apiError?.status === 401 || apiError?.response?.status === 401) {
            console.warn('Orders API returned 401, using cached data if available');
            
            // Try to use cached data instead of logging out immediately
            if (cachedOrders) {
              useOrdersCache();
            } else {
              recentOrders.value = [];
            }
          } else {
            // For non-auth errors, just log and use cached data if available
            console.error('Error loading orders (non-auth):', apiError);
            if (cachedOrders) {
              useOrdersCache();
            } else {
              recentOrders.value = [];
            }
          }
        }
      }
    } catch (orderError) {
      console.error('Fatal error in orders section:', orderError);
      // Don't fail the whole component for order errors
      useOrdersCache();
    }
    
  } catch (err) {
    console.error('Critical error in profile component:', err);
    
    // On critical errors, force clear auth and redirect
    error.value = 'Không thể tải dữ liệu. Vui lòng đăng nhập lại.';
    await auth.logout(false);
    router.replace('/auth/login?redirect=/profile&reason=critical_error');
  } finally {
    loading.value = false;
    localStorage.removeItem('validating_token');
  }
});

// Helper function to fetch user profile
async function fetchUserProfile() {
  try {
    // Luôn làm mới dữ liệu từ server thay vì sử dụng cache
    const profileLoaded = await auth.fetchUserProfile();
    
    if (!profileLoaded) {
      console.error('Could not load user profile');
      // Xóa dữ liệu người dùng khỏi local và session storage
      if (localStorage.getItem('userDetails')) localStorage.removeItem('userDetails');
      if (sessionStorage.getItem('userDetails')) sessionStorage.removeItem('userDetails');
      
      error.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
      router.replace('/auth/login?redirect=/profile');
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error fetching user profile:', e);
    
    // Xóa dữ liệu người dùng khỏi local và session storage
    if (localStorage.getItem('userDetails')) localStorage.removeItem('userDetails');
    if (sessionStorage.getItem('userDetails')) sessionStorage.removeItem('userDetails');
    
    // Check if it's an auth error
    if (e.response?.status === 401 || e.status === 401) {
      router.replace('/auth/login?redirect=/profile');
    }
    return false;
  }
}

// Hàm kiểm tra token có hợp lệ không
async function validateToken() {
  try {
    console.log('Kiểm tra token tại Profile component...');
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      console.log('Profile validateToken: Không tìm thấy token');
      return false; // Don't logout, just return false to let the caller handle it
    }

    // Check if the auth store already indicates we're authenticated
    if (auth.isAuthenticated && auth.user) {
      console.log('Auth store indicates user is already authenticated, skipping API check');
      return true;
    }

    // First check if we've validated recently (within last 2 minutes)
    const lastValidation = localStorage.getItem('lastTokenValidation');
    if (lastValidation && (Date.now() - parseInt(lastValidation)) < 2 * 60 * 1000) {
      console.log('Using recent token validation result (within 2 minutes)');
      return true;
    }
    
    // Sử dụng API client tập trung từ index thay vì gọi fetch trực tiếp
    try {
      const result = await authApi.checkToken(token);
      console.log('Response từ API kiểm tra token:', result);
      
      if (result.success && result.data && result.data.valid) {
        console.log('Token hợp lệ, cập nhật thời gian kiểm tra');
        localStorage.setItem('lastTokenValidation', Date.now().toString());
        return true;
      } else if (!result.success) {
        console.log('API check failed but token exists, assuming valid');
        return true; // Assume valid if we have token but API check failed
      } else {
        console.log('Token được xác nhận là không hợp lệ, đăng xuất');
        return false;
      }
    } catch (apiError) {
      console.error('Lỗi API kiểm tra token:', apiError);
      
      // For any API errors, just use the auth store's state instead of forcing logout
      if (localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true') {
        console.log('API error but token exists in storage, assuming valid');
        return true;
      }
      
      // Only if we're sure it's an authentication error (401) do we treat as invalid
      if (apiError?.response?.status === 401) {
        console.log('Token không được xác thực (401)');
        return false;
      }
      
      // For other errors, assume token is valid to prevent logout loops
      return true;
    }
  } catch (error) {
    console.error('Lỗi tổng thể khi xác thực token:', error);
    // Don't logout on general errors, just return based on storage state
    return localStorage.getItem('isAuthenticated') === 'true' || 
           sessionStorage.getItem('isAuthenticated') === 'true';
  }
}

// Navigate to edit profile
function editProfile() {
  // For now, just show an alert as we don't have an edit profile page yet
  alert('Tính năng chỉnh sửa thông tin đang được phát triển')
}

// Format a date
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

// Helper function to use cached orders data
function useOrdersCache() {
  const cachedOrders = localStorage.getItem('cachedOrders');
  if (cachedOrders) {
    try {
      recentOrders.value = JSON.parse(cachedOrders);
      console.log('Using cached orders data');
    } catch (e) {
      recentOrders.value = [];
    }
  } else {
    recentOrders.value = [];
  }
}
</script> 