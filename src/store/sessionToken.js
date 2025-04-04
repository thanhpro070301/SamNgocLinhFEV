import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Tạo store quản lý session token
const sessionToken = {
  // Dữ liệu token
  activeSessions: ref([]),
  currentToken: ref(null),
  
  // Khởi tạo store từ localStorage
  init() {
    try {
      // Lấy danh sách session từ localStorage
      const sessionsString = localStorage.getItem('admin_sessions')
      if (sessionsString) {
        this.activeSessions.value = JSON.parse(sessionsString)
      }
      
      // Lấy token hiện tại từ localStorage
      const currentTokenString = localStorage.getItem('admin_current_token')
      if (currentTokenString) {
        this.currentToken.value = currentTokenString
      }
      
      // Xóa các session hết hạn
      this.cleanExpiredSessions()
    } catch (error) {
      console.error('Error initializing session token store:', error)
      this.resetAll()
    }
  },
  
  // Lưu trạng thái hiện tại vào localStorage
  saveState() {
    try {
      localStorage.setItem('admin_sessions', JSON.stringify(this.activeSessions.value))
      if (this.currentToken.value) {
        localStorage.setItem('admin_current_token', this.currentToken.value)
      } else {
        localStorage.removeItem('admin_current_token')
      }
    } catch (error) {
      console.error('Error saving session state to localStorage:', error)
    }
  },
  
  // Tạo token mới khi đăng nhập
  createToken(user, rememberMe = false) {
    // Tạo token mới với UUID
    const tokenId = uuidv4()
    
    // Thời gian hết hạn: 1 giờ hoặc 30 ngày nếu remember me
    const expiresAt = new Date()
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 ngày
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 giờ
    }
    
    // Thông tin thiết bị
    const device = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    }
    
    // IP Address (trong thực tế sẽ lấy từ server)
    const ipAddress = "127.0.0.1" // giả lập
    
    // Tạo đối tượng session
    const session = {
      tokenId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      ipAddress,
      device,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActivity: new Date().toISOString(),
      rememberMe
    }
    
    // Thêm vào danh sách active sessions
    this.activeSessions.value.push(session)
    
    // Lưu token hiện tại
    this.currentToken.value = tokenId
    
    // Lưu vào localStorage
    this.saveState()
    
    return tokenId
  },
  
  // Lấy thông tin session hiện tại
  getCurrentSession() {
    if (!this.currentToken.value) return null
    
    return this.activeSessions.value.find(
      session => session.tokenId === this.currentToken.value
    )
  },
  
  // Kiểm tra token có hợp lệ không
  isValidToken(tokenId) {
    try {
      if (!tokenId) return false
      
      const session = this.activeSessions.value.find(s => s.tokenId === tokenId)
      if (!session) return false
      
      // Kiểm tra token có hết hạn chưa
      const now = new Date()
      const expiresAt = new Date(session.expiresAt)
      
      if (now > expiresAt) {
        // Nếu hết hạn, xóa token
        this.removeToken(tokenId)
        return false
      }
      
      // Cập nhật thời gian hoạt động cuối
      session.lastActivity = new Date().toISOString()
      this.saveState()
      
      return true
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  },
  
  // Kiểm tra token hiện tại có hợp lệ không
  isCurrentTokenValid() {
    return this.isValidToken(this.currentToken.value)
  },
  
  // Cập nhật hoạt động cho token
  updateActivity(tokenId = null) {
    const token = tokenId || this.currentToken.value
    if (!token) return false
    
    const session = this.activeSessions.value.find(s => s.tokenId === token)
    if (session) {
      session.lastActivity = new Date().toISOString()
      this.saveState()
      return true
    }
    
    return false
  },
  
  // Xóa token
  removeToken(tokenId) {
    this.activeSessions.value = this.activeSessions.value.filter(
      session => session.tokenId !== tokenId
    )
    
    // Nếu xóa token hiện tại, reset current token
    if (this.currentToken.value === tokenId) {
      this.currentToken.value = null
    }
    
    this.saveState()
  },
  
  // Xóa tất cả token của một user
  removeUserTokens(userId) {
    this.activeSessions.value = this.activeSessions.value.filter(
      session => session.userId !== userId
    )
    
    // Nếu xóa token của user hiện tại, reset current token
    const currentSession = this.getCurrentSession()
    if (currentSession && currentSession.userId === userId) {
      this.currentToken.value = null
    }
    
    this.saveState()
  },
  
  // Xóa tất cả token ngoại trừ token hiện tại
  removeOtherTokens() {
    if (!this.currentToken.value) return
    
    this.activeSessions.value = this.activeSessions.value.filter(
      session => session.tokenId === this.currentToken.value
    )
    
    this.saveState()
  },
  
  // Xóa các token hết hạn
  cleanExpiredSessions() {
    const now = new Date()
    
    this.activeSessions.value = this.activeSessions.value.filter(session => {
      const expiresAt = new Date(session.expiresAt)
      return now <= expiresAt
    })
    
    // Kiểm tra xem token hiện tại có bị xóa không
    if (this.currentToken.value) {
      const currentSession = this.getCurrentSession()
      if (!currentSession) {
        this.currentToken.value = null
      }
    }
    
    this.saveState()
  },
  
  // Reset toàn bộ dữ liệu
  resetAll() {
    this.activeSessions.value = []
    this.currentToken.value = null
    localStorage.removeItem('admin_sessions')
    localStorage.removeItem('admin_current_token')
  },
  
  // Lấy danh sách tất cả các phiên đăng nhập của người dùng
  getAllSessions() {
    return this.activeSessions.value
  },
  
  // Lấy số lượng phiên đăng nhập hiện tại
  getSessionCount: computed(() => {
    return sessionToken.activeSessions.value.length
  }),
  
  // Lấy danh sách phiên đăng nhập của người dùng hiện tại
  getCurrentUserSessions: computed(() => {
    const currentSession = sessionToken.getCurrentSession()
    if (!currentSession) return []
    
    return sessionToken.activeSessions.value.filter(
      session => session.userId === currentSession.userId
    )
  })
}

// Khởi tạo store khi import
sessionToken.init()

export default sessionToken 