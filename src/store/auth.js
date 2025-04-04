import { ref, computed } from 'vue'

// Tạo store quản lý authentication
const auth = {
  isAuthenticated: ref(false),
  currentUser: ref(null),
  isLoading: ref(false),
  
  // Khởi tạo store từ localStorage nếu đã đăng nhập trước đó
  init() {
    const authenticated = localStorage.getItem('admin_authenticated')
    const userString = localStorage.getItem('admin_user')
    
    if (authenticated === 'true' && userString) {
      try {
        const user = JSON.parse(userString)
        this.currentUser.value = user
        this.isAuthenticated.value = true
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        this.logout()
      }
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
        
        // Lưu vào localStorage nếu chọn ghi nhớ đăng nhập
        if (rememberMe) {
          localStorage.setItem('admin_authenticated', 'true')
          localStorage.setItem('admin_user', JSON.stringify(user))
        }
        
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
  async logout() {
    this.isLoading.value = true
    
    try {
      // Mô phỏng gọi API đăng xuất
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Xóa dữ liệu người dùng
      this.currentUser.value = null
      this.isAuthenticated.value = false
      
      // Xóa dữ liệu từ localStorage
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_user')
      
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
  })
}

// Khởi tạo store khi import
auth.init()

export default auth 