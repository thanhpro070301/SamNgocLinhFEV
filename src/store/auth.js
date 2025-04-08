import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import sessionToken from './sessionToken'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isAuthenticated = ref(false)
  const sessionCheckInterval = ref(null)

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
        }
      } else {
        // Token không hợp lệ, đăng xuất
        await logout()
      }
    } catch (error) {
      console.error('Error initializing auth store:', error)
      await logout()
    }
  }

  // Bắt đầu kiểm tra session định kỳ
  const startSessionCheck = () => {
    // Kiểm tra mỗi 5 phút
    sessionCheckInterval.value = setInterval(async () => {
      try {
        if (!sessionToken.isCurrentTokenValid()) {
          // Thử refresh token
          const refreshed = await sessionToken.refreshSession()
          if (!refreshed) {
            // Không thể refresh, đăng xuất
            await logout()
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        await logout()
      }
    }, 5 * 60 * 1000)
  }

  // Dừng kiểm tra session
  const stopSessionCheck = () => {
    if (sessionCheckInterval.value) {
      clearInterval(sessionCheckInterval.value)
      sessionCheckInterval.value = null
    }
  }

  // Đăng nhập
  const login = async (credentials, rememberMe = false) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.auth.login(credentials)
      
      if (response && response.token) {
        // Tạo session token
        const { token, refreshToken } = sessionToken.createToken(response.user, rememberMe)
        
        // Lưu thông tin user
        user.value = response.user
        isAuthenticated.value = true
        
        // Bắt đầu kiểm tra session
        startSessionCheck()
        
        return true
      }
      
      error.value = 'Invalid credentials'
      return false
    } catch (err) {
      error.value = err.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  // Đăng xuất
  const logout = async () => {
    try {
      // Gọi API logout nếu có token
      if (sessionToken.currentToken.value) {
        await api.auth.logout(sessionToken.currentToken.value)
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
    return user.value.role.permissions.includes(permission)
  }

  // Kiểm tra role
  const hasRole = (role) => {
    if (!user.value || !user.value.role) return false
    return user.value.role.name === role
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    init,
    login,
    logout,
    hasPermission,
    hasRole
  }
}) 