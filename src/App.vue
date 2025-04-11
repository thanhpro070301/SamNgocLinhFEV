<template>
  <div class="app">
    <!-- Hiển thị layout admin hoặc frontend dựa vào đường dẫn -->
    <template v-if="!isAdminRoute">
      <!-- Frontend layout -->
      <TheHeader />
      <main class="main-content" :class="{'auth-content': isAuthRoute}">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
      <TheFooter />
    </template>
    <template v-else>
      <!-- Admin layout -->
      <div class="admin-layout">
        <router-view></router-view>
      </div>
    </template>
    
    <!-- Modern Notification -->
    <NotificationPopup 
      :show="notificationService.showNotification.value"
      :title="notificationService.notificationData.value.title"
      :message="notificationService.notificationData.value.message"
      :duration="notificationService.notificationData.value.duration"
      @close="notificationService.hide"
    />
    
    <!-- Cart Added Confirmation -->
    <CartAddedConfirmation
      :show="notificationService.showCartConfirmation.value"
      :product="notificationService.cartConfirmationData.value.product"
      :dismiss-time="notificationService.cartConfirmationData.value.duration"
      @close="notificationService.hideCartAdded"
    />
    
    <!-- Toast notifications -->
    <ToastContainer />
    
    <!-- Event-based notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref, onBeforeUnmount, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import NotificationPopup from '@/components/NotificationPopup.vue'
import CartAddedConfirmation from '@/components/CartAddedConfirmation.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import notificationService from '@/utils/notificationService'
import { useAuthStore } from '@/store/auth'
import sessionToken from './store/sessionToken'
import { checkLocalStorage } from './debug'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Refs
const isLoading = ref(true)
const lastUserActivity = ref(Date.now())
const tokenCheckInterval = ref(null)
const activityCheckInterval = ref(null)
const sessionSyncInterval = ref(null)

// Kiểm tra xem đang ở route admin không
const isAdminRoute = computed(() => {
  const currentPath = window.location.pathname
  return currentPath.startsWith('/admin')
})

// Kiểm tra xem đang ở route auth không
const isAuthRoute = computed(() => {
  const currentPath = window.location.pathname
  return currentPath.startsWith('/auth')
})

// Các hàm hỗ trợ
function reloadPage() {
  window.location.reload()
}

// Cập nhật thời gian hoạt động cuối cùng của người dùng
function updateLastActivity() {
  lastUserActivity.value = Date.now()
  if (auth.updateActivity) {
    auth.updateActivity()
  }
}

// Đồng bộ session giữa các tab/cửa sổ
function setupStorageSync() {
  // Lắng nghe sự kiện storage thay đổi từ tab khác
  window.addEventListener('storage', (event) => {
    if (['authToken', 'isAuthenticated', 'userDetails', 'expiresAt'].includes(event.key)) {
      console.log('Storage changed in another tab:', event.key)
      
      // Đồng bộ lại trạng thái auth
      if (auth.syncStorages) {
        auth.syncStorages()
      }
      
      // Nếu token bị xóa (đăng xuất từ tab khác), thực hiện đăng xuất ở tab này
      if ((event.key === 'authToken' && !event.newValue && auth.isAuthenticated) || 
          (event.key === 'isAuthenticated' && event.oldValue === 'true' && event.newValue !== 'true')) {
        console.log('Auth token removed or authentication state changed in another tab, updating this tab')
        
        // Update local auth state immediately
        auth.isAuthenticated = false
        auth.user = null
        
        // Force all UI components to reflect logged-out state
        document.dispatchEvent(new CustomEvent('auth:logout', { detail: { fromAnotherTab: true } }));
        
        // Redirect if on a protected page
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/admin') || 
            currentPath.startsWith('/profile') || 
            currentPath.startsWith('/orders')) {
          router.push('/auth/login?session=expired&source=other_tab')
        }
      }
    }
    
    // Also handle explicit logout event
    if (event.key === 'auth_event' && event.newValue === 'logging_out') {
      console.log('Explicit logout event detected from another tab')
      
      // Update local auth state
      auth.isAuthenticated = false
      auth.user = null
      
      // Force all UI components to reflect logged-out state
      document.dispatchEvent(new CustomEvent('auth:logout', { detail: { fromAnotherTab: true } }));
      
      // Clear local storage to ensure consistency
      if (auth.syncStorages) {
        auth.syncStorages()
      }
    }
  })
}

// Thiết lập sự kiện theo dõi hoạt động người dùng
function setupActivityTracking() {
  // Danh sách sự kiện cần theo dõi
  const events = [
    'mousemove', 'mousedown', 'click', 'scroll', 
    'keypress', 'touchstart', 'touchmove'
  ]
  
  // Thêm listener cho mỗi sự kiện
  events.forEach(event => {
    window.addEventListener(event, updateLastActivity)
  })
  
  // Cập nhật trạng thái hoạt động cho auth store
  activityCheckInterval.value = setInterval(() => {
    // Kiểm tra nếu người dùng không hoạt động trong 30 phút
    const inactiveFor = Date.now() - lastUserActivity.value
    
    // Nếu không hoạt động quá 30 phút, kiểm tra token
    if (inactiveFor > 30 * 60 * 1000 && auth.isAuthenticated) {
      console.log('User inactive for 30 minutes, validating session')
      auth.init().catch(error => {
        console.error('Session validation failed after inactivity:', error)
      })
    }
  }, 5 * 60 * 1000) // Kiểm tra mỗi 5 phút
}

// Khởi tạo auth khi component được mount
onMounted(async () => {
  console.log('App mounted - initializing auth')
  
  try {
    // Khởi tạo auth store
    const result = await auth.init()
    console.log('Auth initialization result:', result)
    
    // Đồng bộ session giữa các tab
    setupStorageSync()
    
    // Thiết lập theo dõi hoạt động người dùng
    setupActivityTracking()
    
    // Thiết lập kiểm tra token định kỳ và đồng bộ session liên tục
    tokenCheckInterval.value = setInterval(async () => {
      if (auth.isAuthenticated) {
        console.log('Performing periodic token check')
        await auth.init().catch(error => {
          console.error('Error during periodic token check:', error)
        })
      }
    }, 3 * 60 * 1000) // Mỗi 3 phút
    
    // Đồng bộ dữ liệu session mỗi 30 giây
    sessionSyncInterval.value = setInterval(() => {
      if (auth.isAuthenticated && auth.syncStorages) {
        auth.syncStorages()
      }
    }, 30 * 1000) // Mỗi 30 giây
  } catch (error) {
    console.error('Error during app initialization:', error)
  } finally {
    isLoading.value = false
  }
})

// Dọn dẹp interval khi component unmount
onUnmounted(() => {
  console.log('App unmounting, cleaning up intervals')
  
  // Xóa tất cả interval
  if (tokenCheckInterval.value) {
    clearInterval(tokenCheckInterval.value)
  }
  
  if (activityCheckInterval.value) {
    clearInterval(activityCheckInterval.value)
  }
  
  if (sessionSyncInterval.value) {
    clearInterval(sessionSyncInterval.value)
  }
  
  // Xóa các event listener
  const events = [
    'mousemove', 'mousedown', 'click', 'scroll', 
    'keypress', 'touchstart', 'touchmove'
  ]
  events.forEach(event => {
    window.removeEventListener(event, updateLastActivity)
  })
})

// Theo dõi thay đổi route để kiểm tra quyền truy cập
watch(
  () => route.path,
  async (newPath) => {
    console.log('Route changed to:', newPath)
    
    // Cập nhật thời gian hoạt động khi chuyển trang
    updateLastActivity()
    
    // Kiểm tra nếu đang truy cập route admin
    if (newPath.startsWith('/admin')) {
      console.log('Admin route detected, checking authentication')
      
      // Kiểm tra đăng nhập
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const expiresAt = localStorage.getItem('tokenExpiresAt') || localStorage.getItem('expiresAt') ||
                       sessionStorage.getItem('tokenExpiresAt') || sessionStorage.getItem('expiresAt')
      const now = Date.now()
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || 
                            sessionStorage.getItem('isAuthenticated') === 'true'
      
      // Safely parse expiration date
      let expireTime = null;
      if (expiresAt) {
        try {
          // Try parsing as a number first
          const parsedTime = parseInt(expiresAt, 10);
          if (!isNaN(parsedTime)) {
            expireTime = parsedTime;
          } else {
            // Try parsing as date string
            const dateTime = new Date(expiresAt).getTime();
            if (!isNaN(dateTime)) {
              expireTime = dateTime;
            }
          }
        } catch (err) {
          console.error('Error parsing token expiry time:', err);
        }
      }
      
      // Token is valid if:
      // 1. Token exists 
      // 2. Either: expiresAt exists and is greater than now OR expiresAt doesn't exist but isAuthenticated is true (fallback)
      const tokenValid = token && ((expireTime && now < expireTime) || (!expireTime && isAuthenticated))
      
      if (!tokenValid || !isAuthenticated) {
        console.log('Not authenticated or token invalid, redirecting to login')
        // Lưu trang sẽ chuyển đến sau khi đăng nhập
        localStorage.setItem('redirectAfterLogin', newPath)
        router.push('/auth/login')
        return
      }

      // Kiểm tra vai trò admin
      try {
        // Khởi tạo auth store nếu chưa được khởi tạo
        if (!auth.isAuthenticated) {
          await auth.init()
        }
        
        // Nếu không có thông tin người dùng, lấy từ localStorage hoặc API
        if (!auth.user) {
          const userDetailsStr = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails')
          if (userDetailsStr) {
            try {
              auth.user = JSON.parse(userDetailsStr)
            } catch (error) {
              console.error('Error parsing user details from storage:', error)
            }
          }
          
          if (!auth.user) {
            try {
              await auth.fetchUserProfile()
            } catch (error) {
              console.error('Error fetching user profile:', error)
              // On error, we'll still try to continue with localStorage data if possible
              // If we still can't get user data, redirect to login
              if (!auth.user) {
                console.log('Failed to retrieve user profile, redirecting to login')
                router.push('/auth/login')
                return
              }
            }
          }
        }
        
        // Kiểm tra quyền admin
        const isAdmin = auth.user?.role === 'ADMIN'
        console.log('User role check for admin route:', { isAdmin, role: auth.user?.role })
        
        if (!isAdmin) {
          console.log('User is not an admin, redirecting to profile')
          router.push('/profile')
        }
      } catch (error) {
        console.error('Error checking admin permissions:', error)
        router.push('/auth/login')
      }
    }
  },
  { immediate: true }
)

// Cleanup khi unmount
onBeforeUnmount(() => {
  console.log('App unmounting, cleaning up...')
  if (auth.cleanup) {
    auth.cleanup()
  }
})
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.auth-content {
  padding: 0;
}

.admin-layout {
  min-height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
}

/* Ensure consistent header visibility */
header.glassmorphism-header {
  z-index: 100;
}
</style> 