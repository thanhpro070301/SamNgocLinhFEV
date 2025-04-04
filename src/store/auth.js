import { ref, computed } from 'vue'
import sessionToken from './sessionToken'

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
      // Mô phỏng gọi API đăng nhập
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo credentials
      const demoAccounts = [
        {
          email: 'admin@example.com',
          password: 'admin123',
          id: 1,
          name: 'Admin',
          role: 'admin'
        },
        {
          email: 'samngoclinh@gmail.com',
          password: 'sam123',
          id: 2,
          name: 'Quản lý Sâm Ngọc Linh',
          role: 'admin'
        }
      ]
      
      // Kiểm tra đăng nhập với tài khoản demo
      const foundUser = demoAccounts.find(
        account => account.email === email && account.password === password
      )
      
      if (foundUser) {
        const user = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role
        }
        
        // Lưu thông tin đăng nhập
        this.currentUser.value = user
        this.isAuthenticated.value = true
        
        // Tạo token session
        sessionToken.createToken(user, rememberMe)
        
        return true
      }
      
      return false
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
      // Mô phỏng gọi API đăng ký
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Kiểm tra email đã tồn tại
      if (email === 'admin@example.com') {
        return false
      }
      
      // Mô phỏng đăng ký thành công
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
      // Mô phỏng gọi API đăng xuất
      await new Promise(resolve => setTimeout(resolve, 500))
      
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