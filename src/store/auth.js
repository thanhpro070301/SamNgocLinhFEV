import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import sessionToken from './sessionToken'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isAuthenticated = ref(false)
  const sessionCheckInterval = ref(null)
  const lastActivity = ref(Date.now())

  // Khởi tạo store
  const init = async () => {
    try {
      // Kiểm tra token hiện tại
      if (sessionToken.isCurrentTokenValid()) {
        // Lấy thông tin user từ session
        const session = sessionToken.getCurrentSession()
        if (session) {
          user.value = {
            id: session.userId,
            name: session.userName,
            email: session.userEmail,
            role: session.userRole
          }
          isAuthenticated.value = true
          
          // Bắt đầu kiểm tra session định kỳ
          startSessionCheck()

          // Thiết lập sự kiện để theo dõi hoạt động người dùng
          setupActivityTracking()
        }
      } else {
        // Token không hợp lệ, đăng xuất
        await logout(false)
      }
    } catch (error) {
      console.error('Error initializing auth store:', error)
      await logout(false)
    }
  }

  // Bắt đầu kiểm tra session định kỳ
  const startSessionCheck = () => {
    // Kiểm tra mỗi 5 phút
    sessionCheckInterval.value = setInterval(async () => {
      try {
        // Nếu không có hoạt động trong 30 phút, đăng xuất
        if (Date.now() - lastActivity.value > 30 * 60 * 1000) {
          console.log('No activity detected for 30 minutes, logging out...')
          await logout(true)
          router.push('/admin/login')
          return
        }

        if (!sessionToken.isCurrentTokenValid()) {
          // Thử refresh token
          const refreshed = await sessionToken.refreshSession()
          if (!refreshed) {
            // Không thể refresh, đăng xuất
            await logout(false)
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        await logout(false)
        router.push('/admin/login')
      }
    }, 5 * 60 * 1000)
  }

  // Thiết lập theo dõi hoạt động người dùng
  const setupActivityTracking = () => {
    // Cập nhật thời gian hoạt động cuối cùng khi có tương tác
    const updateActivity = () => {
      lastActivity.value = Date.now()
      if (isAuthenticated.value) {
        sessionToken.updateActivity()
      }
    }

    // Theo dõi các sự kiện người dùng
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('click', updateActivity)
    window.addEventListener('touchstart', updateActivity)
    window.addEventListener('scroll', updateActivity)
  }

  // Dừng kiểm tra session
  const stopSessionCheck = () => {
    if (sessionCheckInterval.value) {
      clearInterval(sessionCheckInterval.value)
      sessionCheckInterval.value = null
    }
  }

  // Cập nhật hoạt động người dùng
  const updateActivity = () => {
    lastActivity.value = Date.now()
    sessionToken.updateActivity()
  }

  // Đăng nhập
  const login = async (credentials, rememberMe = false) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.auth.login(credentials)
      
      if (response && response.success && response.data.token) {
        // Tạo session token
        sessionToken.createToken({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }, response.data.token, response.data.refreshToken, rememberMe)
        
        // Lưu thông tin user
        user.value = response.data
        isAuthenticated.value = true
        
        // Cập nhật hoạt động
        updateActivity()
        
        // Bắt đầu kiểm tra session
        startSessionCheck()
        
        return true
      }
      
      error.value = response.message || 'Thông tin đăng nhập không hợp lệ'
      return false
    } catch (err) {
      error.value = err.message || 'Lỗi đăng nhập'
      return false
    } finally {
      loading.value = false
    }
  }

  // Đăng xuất
  const logout = async (silent = false) => {
    try {
      // Gọi API logout nếu có token và không im lặng
      if (sessionToken.currentToken.value && !silent) {
        await api.auth.logout()
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Reset state
      user.value = null
      isAuthenticated.value = false
      error.value = null
      
      // Dừng kiểm tra session
      stopSessionCheck()
      
      // Xóa session token
      sessionToken.resetAll()
    }
  }

  // Kiểm tra quyền
  const hasPermission = (permission) => {
    if (!user.value || !user.value.role) return false
    return user.value.role.permissions?.includes(permission) || false
  }

  // Kiểm tra role
  const hasRole = (role) => {
    if (!user.value || !user.value.role) return false
    return user.value.role.name === role
  }

  // Đăng ký
  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.auth.register(userData)
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data
        }
      }
      
      error.value = response.message || 'Đăng ký thất bại'
      return {
        success: false,
        message: response.message || 'Đăng ký thất bại'
      }
    } catch (err) {
      error.value = err.message || 'Lỗi đăng ký'
      console.error('Registration error details:', err)
      return {
        success: false,
        message: err.message || 'Lỗi đăng ký'
      }
    } finally {
      loading.value = false
    }
  }

  // Xử lý khi component được hủy
  const cleanup = () => {
    stopSessionCheck()
    window.removeEventListener('mousemove', updateActivity)
    window.removeEventListener('keydown', updateActivity)
    window.removeEventListener('click', updateActivity)
    window.removeEventListener('touchstart', updateActivity)
    window.removeEventListener('scroll', updateActivity)
  }
  
  // Đảm bảo xóa các event listener khi app unmount
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup)
  }

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Getters
    isAdmin: computed(() => hasRole('ADMIN')),
    
    // Actions
    init,
    login,
    logout,
    register,
    hasPermission,
    hasRole,
    updateActivity,
    cleanup
  }
}) 