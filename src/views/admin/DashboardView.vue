<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

// Refs for dashboard data
const loading = ref(true)
const stats = ref({
  users: 0,
  orders: 0,
  products: 0,
  revenue: 0
})

// Check authentication before rendering
onMounted(() => {
  // Log all localStorage items
  console.log('Dashboard mounted, all localStorage items:')
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    let value = localStorage.getItem(key)
    
    // Không hiển thị toàn bộ token
    if (key.includes('token') && value && value.length > 10) {
      value = value.substring(0, 8) + '...'
    }
    
    console.log(`${key}: ${value}`)
  }
  
  // Kiểm tra token từ cả localStorage, sessionStorage và cookie
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith('authToken=')) {
        return cookie.substring('authToken='.length, cookie.length)
      }
    }
    return null
  }
  
  // Lấy token từ nhiều nguồn
  const localToken = localStorage.getItem('authToken')
  const sessionToken = sessionStorage.getItem('authToken')
  const cookieToken = getTokenFromCookie()
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true'
  
  console.log('Dashboard checking auth:', { 
    hasLocalToken: !!localToken, 
    hasSessionToken: !!sessionToken,
    hasCookieToken: !!cookieToken,
    localTokenPrefix: localToken ? localToken.substring(0, 8) : null,
    sessionTokenPrefix: sessionToken ? sessionToken.substring(0, 8) : null,
    cookieTokenPrefix: cookieToken ? cookieToken.substring(0, 8) : null,
    isAuthenticated 
  })
  
  // Sử dụng token từ bất kỳ nguồn nào
  const token = localToken || sessionToken || cookieToken
  
  // Đồng bộ token giữa các kho lưu trữ khác nhau nếu cần
  if (token) {
    if (!localToken) localStorage.setItem('authToken', token)
    if (!sessionToken) sessionStorage.setItem('authToken', token)
    
    // Đồng bộ với admin_current_token
    if (!localStorage.getItem('admin_current_token')) {
      localStorage.setItem('admin_current_token', token)
    }
    if (!sessionStorage.getItem('admin_current_token')) {
      sessionStorage.setItem('admin_current_token', token)
    }
    
    // Đảm bảo trạng thái xác thực
    if (!isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('isAuthenticated', 'true')
    }
  }
  
  if (!token) {
    console.log('Not authenticated, redirecting to login')
    window.location.href = '/auth/login'
    return
  }
  
  // Kiểm tra token hết hạn chưa
  const getExpiresAt = () => {
    // Ưu tiên lấy từ localStorage, sau đó là sessionStorage, cuối cùng là cookie
    const localExpires = localStorage.getItem('tokenExpiresAt')
    const sessionExpires = sessionStorage.getItem('tokenExpiresAt')
    
    // Lấy từ cookie
    const getCookieExpiresAt = () => {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith('tokenExpiresAt=')) {
          return cookie.substring('tokenExpiresAt='.length, cookie.length)
        }
      }
      return null
    }
    
    const cookieExpires = getCookieExpiresAt()
    
    return localExpires || sessionExpires || cookieExpires
  }
  
  const expiresAt = getExpiresAt()
  if (expiresAt) {
    const now = Date.now()
    const expireTime = parseInt(expiresAt)
    
    console.log('Token expiration check:', {
      now: new Date(now).toISOString(),
      expires: new Date(expireTime).toISOString(),
      isValid: now < expireTime,
      timeLeftMinutes: Math.round((expireTime - now) / 1000 / 60)
    })
    
    if (now >= expireTime) {
      console.log('Token expired, redirecting to login')
      // Xóa token từ tất cả các nguồn
      localStorage.removeItem('authToken')
      localStorage.removeItem('admin_current_token')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('tokenExpiresAt')
      
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('admin_current_token')
      sessionStorage.removeItem('isAuthenticated')
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('tokenExpiresAt')
      
      // Xóa cookies
      document.cookie = 'authToken=; path=/; max-age=0'
      document.cookie = 'userData=; path=/; max-age=0'
      document.cookie = 'tokenExpiresAt=; path=/; max-age=0'
      
      window.location.href = '/auth/login'
      return
    }
  }
  
  // Lấy thông tin người dùng từ các nguồn
  const getUserData = () => {
    const localUserData = localStorage.getItem('currentUser')
    const sessionUserData = sessionStorage.getItem('currentUser')
    
    // Lấy từ cookie
    const getCookieUserData = () => {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith('userData=')) {
          return cookie.substring('userData='.length, cookie.length)
        }
      }
      return null
    }
    
    const cookieUserData = getCookieUserData()
    
    return localUserData || sessionUserData || cookieUserData
  }
  
  const userData = getUserData()
  console.log('User data from storage sources:', userData ? JSON.parse(userData) : null)
  
  if (!userData) {
    console.log('No user data found, redirecting to login')
    window.location.href = '/auth/login'
    return
  }
  
  console.log('Authentication valid, loading dashboard')
  loadDashboardData()
})

// Load dashboard data
const loadDashboardData = async () => {
  try {
    // Simulate API call
    setTimeout(() => {
      stats.value = {
        users: 120,
        orders: 540,
        products: 89,
        revenue: 35670
      }
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    loading.value = false
  }
}
</script> 