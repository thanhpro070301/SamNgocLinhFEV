import { ref, computed } from 'vue'
import sessionToken from './sessionToken'
import api from '@/api'

// Tạo store quản lý authentication
const auth = {
  isAuthenticated: ref(false),
  currentUser: ref(null),
  isLoading: ref(false),
  
  // Khởi tạo store từ localStorage nếu đã đăng nhập trước đó
  init() {
    try {
      // Kiểm tra token hiện tại có hợp lệ không
      if (sessionToken.isCurrentTokenValid()) {
        const session = sessionToken.getCurrentSession()
        if (session) {
          // Khôi phục thông tin người dùng từ session
          this.currentUser.value = {
            id: session.userId,
            name: session.userName,
            email: session.userEmail,
            role: session.userRole
          }
          this.isAuthenticated.value = true
        }
      } else {
        // Nếu token không hợp lệ, đăng xuất
        this.logout(false) // false để không xóa token (đã được xóa trong sessionToken)
      }
    } catch (error) {
      console.error('Error initializing auth store:', error)
      // Reset auth state on error
      this.currentUser.value = null
      this.isAuthenticated.value = false
    }
  },
  
  // Đăng nhập
  async login({ email, password, rememberMe }) {
    this.isLoading.value = true
    
    try {
      // Gọi API đăng nhập
      const response = await api.auth.login({
        email,
        password
      })
      
      // Lấy token từ response
      const token = response.data
      
      // Giả lập dữ liệu user từ token
      // Thực tế sẽ decode token hoặc gọi API get profile
      const user = {
        id: 1, // Giả lập ID
        email: email,
        name: email.split('@')[0], // Lấy tên từ email 
        role: email.includes('admin') ? 'admin' : 'user'
      }
      
      // Lưu thông tin đăng nhập
      this.currentUser.value = user
      this.isAuthenticated.value = true
      
      // Tạo token session
      sessionToken.createToken(user, rememberMe)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      this.isLoading.value = false
    }
  },
  
  // Đăng ký
  async register({ name, email, password }) {
    this.isLoading.value = true
    
    try {
      // Gọi API đăng ký
      await api.auth.register({
        name,
        email,
        password
      })
      
      // Trả về true khi đăng ký thành công
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      this.isLoading.value = false
    }
  },
  
  // Đăng xuất
  async logout(removeToken = true) {
    this.isLoading.value = true
    
    try {
      // Gọi API đăng xuất nếu đã đăng nhập và cần xóa token
      if (this.isAuthenticated.value && removeToken) {
        try {
          await api.auth.logout()
        } catch (error) {
          console.error('Error calling logout API:', error)
          // Tiếp tục quá trình logout dù API có lỗi
        }
      }
      
      // Xóa dữ liệu người dùng
      this.currentUser.value = null
      this.isAuthenticated.value = false
      
      // Xóa token session nếu cần
      if (removeToken) {
        sessionToken.removeToken(sessionToken.currentToken.value)
      }
      
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    } finally {
      this.isLoading.value = false
    }
  },
  
  // Kiểm tra quyền admin
  isAdmin: computed(() => {
    if (!auth.isAuthenticated.value) return false
    return auth.currentUser.value?.role === 'admin'
  }),
  
  // Cập nhật hoạt động của phiên hiện tại
  updateActivity() {
    if (this.isAuthenticated.value) {
      sessionToken.updateActivity()
    }
  },
  
  // Lấy danh sách phiên đăng nhập của người dùng hiện tại
  getUserSessions: computed(() => {
    if (!auth.isAuthenticated.value) return []
    return sessionToken.getCurrentUserSessions.value
  }),
  
  // Xóa một phiên đăng nhập cụ thể
  removeSession(tokenId) {
    if (this.isAuthenticated.value) {
      // Nếu xóa phiên hiện tại, thực hiện đăng xuất
      if (tokenId === sessionToken.currentToken.value) {
        this.logout()
      } else {
        sessionToken.removeToken(tokenId)
      }
    }
  },
  
  // Xóa tất cả phiên đăng nhập ngoại trừ phiên hiện tại
  removeOtherSessions() {
    if (this.isAuthenticated.value) {
      sessionToken.removeOtherTokens()
    }
  }
}

// Khởi tạo store khi import
auth.init()

export default auth 