/**
 * Composable để quản lý và kiểm tra trạng thái đăng nhập
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { clearAllAuthData, clearInvalidSession } from '@/utils/clearAuth'

export function useAuth() {
  const router = useRouter()
  const auth = useAuthStore()
  
  // Trạng thái
  const isInitializing = ref(true)
  const isAuthenticated = ref(false)
  const userRole = ref(null)
  const lastChecked = ref(Date.now())
  const syncInterval = ref(null)
  const monitorInterval = ref(null)
  
  /**
   * Đồng bộ dữ liệu xác thực giữa localStorage và sessionStorage
   */
  const syncAuthStorages = () => {
    // Kiểm tra nếu auth store có sẵn phương thức đồng bộ
    if (auth.syncStorages) {
      return auth.syncStorages()
    }
    
    // Nếu không, thực hiện đồng bộ thủ công
    const localToken = localStorage.getItem('authToken')
    const sessionToken = sessionStorage.getItem('authToken')
    
    // Đồng bộ token
    if (localToken && !sessionToken) {
      sessionStorage.setItem('authToken', localToken)
      sessionStorage.setItem('isAuthenticated', 'true')
      
      // Đồng bộ dữ liệu khác
      const userDetails = localStorage.getItem('userDetails')
      const expiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt')
      
      if (userDetails) sessionStorage.setItem('userDetails', userDetails)
      if (expiresAt) {
        sessionStorage.setItem('expiresAt', expiresAt)
        sessionStorage.setItem('tokenExpiresAt', expiresAt)
      }
    } else if (sessionToken && !localToken) {
      localStorage.setItem('authToken', sessionToken)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Đồng bộ dữ liệu khác
      const userDetails = sessionStorage.getItem('userDetails')
      const expiresAt = sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt')
      
      if (userDetails) localStorage.setItem('userDetails', userDetails)
      if (expiresAt) {
        localStorage.setItem('expiresAt', expiresAt)
        localStorage.setItem('tokenExpiresAt', expiresAt)
      }
    }
    
    return {
      localToken,
      sessionToken,
      synced: (!localToken && !sessionToken) || (localToken === sessionToken)
    }
  }
  
  /**
   * Kiểm tra token nếu hết hạn ở client-side
   */
  const checkTokenExpiration = () => {
    const expiresAt = localStorage.getItem('expiresAt') || 
                    localStorage.getItem('tokenExpiresAt') ||
                    sessionStorage.getItem('expiresAt') || 
                    sessionStorage.getItem('tokenExpiresAt')
    
    if (!expiresAt) return true // Không có thông tin hết hạn, cần kiểm tra với server
    
    const now = Date.now()
    const expiry = parseInt(expiresAt, 10)
    
    if (isNaN(expiry)) return true // Không phải giá trị số, cần kiểm tra với server
    
    // Token còn hạn nếu thời gian hiện tại < thời gian hết hạn
    return now < expiry
  }
  
  /**
   * Khởi tạo và kiểm tra trạng thái đăng nhập
   */
  const initAuth = async () => {
    try {
      isInitializing.value = true
      
      // Đồng bộ các storage trước
      syncAuthStorages()
      
      // Kiểm tra token có còn hạn ở client không
      const tokenValid = checkTokenExpiration()
      
      if (!tokenValid) {
        // Token đã hết hạn ở client, xóa dữ liệu
        console.log('Token expired according to client side data')
        await clearAllAuthData()
        isAuthenticated.value = false
        userRole.value = null
        return false
      }
      
      // Xác thực với server
      const result = await auth.init()
      
      if (result && result.success) {
        isAuthenticated.value = true
        userRole.value = auth.user?.role || null
        
        // Khởi tạo interval theo dõi session
        setupMonitoring()
        return true
      } else {
        isAuthenticated.value = false
        userRole.value = null
        return false
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      isAuthenticated.value = false
      userRole.value = null
      return false
    } finally {
      isInitializing.value = false
      lastChecked.value = Date.now()
    }
  }
  
  /**
   * Thiết lập theo dõi session
   */
  const setupMonitoring = () => {
    // Xóa interval cũ nếu có
    if (syncInterval.value) clearInterval(syncInterval.value)
    if (monitorInterval.value) clearInterval(monitorInterval.value)
    
    // Đồng bộ mỗi 30 giây
    syncInterval.value = setInterval(() => {
      if (isAuthenticated.value) {
        syncAuthStorages()
      }
    }, 30 * 1000)
    
    // Kiểm tra token mỗi 3 phút
    monitorInterval.value = setInterval(async () => {
      if (isAuthenticated.value) {
        // Chỉ kiểm tra nếu đã qua 3 phút kể từ lần cuối
        const now = Date.now()
        if (now - lastChecked.value > 3 * 60 * 1000) {
          console.log('Checking auth status periodically')
          const stillValid = await initAuth()
          
          if (!stillValid) {
            console.warn('Token is no longer valid, clearing session')
            clearAllAuthData()
            router.push('/auth/login?session=expired')
          }
        }
      }
    }, 3 * 60 * 1000)
    
    // Thêm sự kiện theo dõi storage thay đổi từ các tab khác
    window.addEventListener('storage', handleStorageChange)
  }
  
  /**
   * Xử lý sự kiện storage thay đổi
   */
  const handleStorageChange = (event) => {
    if (['authToken', 'isAuthenticated', 'userDetails', 'expiresAt'].includes(event.key)) {
      console.log('Auth storage changed in another tab:', event.key)
      
      // Đồng bộ lại storages
      syncAuthStorages()
      
      // Xử lý trường hợp đăng xuất từ tab khác
      if (event.key === 'authToken' && !event.newValue && isAuthenticated.value) {
        console.log('Auth token removed in another tab')
        isAuthenticated.value = false
        userRole.value = null
        router.push('/auth/login?session=expired')
      }
      
      // Xử lý trường hợp session hết hạn
      if (event.key === 'isAuthenticated' && event.oldValue === 'true' && event.newValue !== 'true') {
        console.log('Authentication state changed in another tab')
        isAuthenticated.value = false
        userRole.value = null
      }
    }
  }
  
  /**
   * Kiểm tra và chuyển hướng nếu không đủ quyền
   */
  const requireAuth = async (requiredRole = null) => {
    try {
      if (isInitializing.value) {
        // Đợi tới khi khởi tạo xong
        await initAuth()
      }
      
      // Nếu không đăng nhập, chuyển hướng tới trang đăng nhập
      if (!isAuthenticated.value) {
        router.push({
          path: '/auth/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return false
      }
      
      // Nếu cần role cụ thể và không có
      if (requiredRole && userRole.value !== requiredRole) {
        if (requiredRole === 'ADMIN' && userRole.value !== 'ADMIN') {
          router.push('/profile') // Người dùng thường không có quyền admin
        } else {
          router.push('/') // Chuyển hướng khác
        }
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error checking auth requirements:', error)
      
      // Xử lý an toàn - chuyển hướng đến trang đăng nhập nếu có lỗi
      router.push({
        path: '/auth/login',
        query: { 
          redirect: router.currentRoute.value.fullPath,
          error: 'error_checking_auth'
        }
      })
      return false
    }
  }
  
  // Khởi tạo auth khi mount
  onMounted(() => {
    initAuth()
  })
  
  // Dọn dẹp khi unmount
  onUnmounted(() => {
    if (syncInterval.value) clearInterval(syncInterval.value)
    if (monitorInterval.value) clearInterval(monitorInterval.value)
    window.removeEventListener('storage', handleStorageChange)
  })
  
  // Trả về các hàm và giá trị
  return {
    isInitializing,
    isAuthenticated,
    userRole,
    initAuth,
    syncAuthStorages,
    requireAuth,
    clearSession: clearAllAuthData
  }
} 