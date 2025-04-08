import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import api from '@/api'

// Tạo store quản lý session token
const sessionToken = {
  // Dữ liệu token
  activeSessions: ref([]),
  currentToken: ref(null),
  refreshToken: ref(null),
  refreshInterval: null,
  
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

      // Lấy refresh token từ localStorage
      const refreshTokenString = localStorage.getItem('admin_refresh_token')
      if (refreshTokenString) {
        this.refreshToken.value = refreshTokenString
      }
      
      // Xóa các session hết hạn
      this.cleanExpiredSessions()

      // Bắt đầu kiểm tra session định kỳ
      this.startSessionCheck()
    } catch (error) {
      console.error('Error initializing session token store:', error)
      this.resetAll()
    }
  },

  // Bắt đầu kiểm tra session định kỳ
  startSessionCheck() {
    // Kiểm tra mỗi 5 phút
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshSession()
    }, 5 * 60 * 1000)
  },

  // Dừng kiểm tra session
  stopSessionCheck() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  },

  // Kiểm tra và refresh session
  async checkAndRefreshSession() {
    try {
      if (!this.currentToken.value || !this.refreshToken.value) return

      const session = this.getCurrentSession()
      if (!session) return

      // Kiểm tra thời gian còn lại của token
      const now = new Date()
      const expiresAt = new Date(session.expiresAt)
      const timeLeft = expiresAt - now

      // Nếu còn ít hơn 15 phút, refresh token
      if (timeLeft < 15 * 60 * 1000) {
        await this.refreshSession()
      }
    } catch (error) {
      console.error('Error checking session:', error)
    }
  },

  // Refresh session
  async refreshSession() {
    try {
      if (!this.refreshToken.value) return false

      const response = await api.auth.refreshToken(this.refreshToken.value)
      if (response && response.token) {
        this.currentToken.value = response.token
        this.refreshToken.value = response.refreshToken
        this.saveState()
        return true
      }
      return false
    } catch (error) {
      console.error('Error refreshing session:', error)
      return false
    }
  },
  
  // Tạo token mới khi đăng nhập
  createToken(user, rememberMe = false) {
    // Tạo token mới với UUID
    const tokenId = uuidv4()
    const refreshTokenId = uuidv4()
    
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
      refreshTokenId,
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
    this.refreshToken.value = refreshTokenId
    
    // Lưu vào localStorage
    this.saveState()
    
    return { token: tokenId, refreshToken: refreshTokenId }
  },
  
  // Lưu trạng thái vào localStorage
  saveState() {
    try {
      localStorage.setItem('admin_sessions', JSON.stringify(this.activeSessions.value))
      localStorage.setItem('admin_current_token', this.currentToken.value)
      localStorage.setItem('admin_refresh_token', this.refreshToken.value)
    } catch (error) {
      console.error('Error saving session state:', error)
    }
  },
  
  // Xóa tất cả dữ liệu
  resetAll() {
    this.activeSessions.value = []
    this.currentToken.value = null
    this.refreshToken.value = null
    this.stopSessionCheck()
    
    try {
      localStorage.removeItem('admin_sessions')
      localStorage.removeItem('admin_current_token')
      localStorage.removeItem('admin_refresh_token')
    } catch (error) {
      console.error('Error resetting session state:', error)
    }
  },
  
  // Xóa token
  removeToken(tokenId) {
    this.activeSessions.value = this.activeSessions.value.filter(
      session => session.tokenId !== tokenId
    )
    
    if (this.currentToken.value === tokenId) {
      this.currentToken.value = null
      this.refreshToken.value = null
    }
    
    this.saveState()
  },
  
  // Xóa các session hết hạn
  cleanExpiredSessions() {
    const now = new Date()
    this.activeSessions.value = this.activeSessions.value.filter(session => {
      const expiresAt = new Date(session.expiresAt)
      return now <= expiresAt
    })
    
    this.saveState()
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
  
  // Xóa tất cả token của một user
  removeUserTokens(userId) {
    this.activeSessions.value = this.activeSessions.value.filter(
      session => session.userId !== userId
    )
    
    // Nếu xóa token của user hiện tại, reset current token
    const currentSession = this.getCurrentSession()
    if (currentSession && currentSession.userId === userId) {
      this.currentToken.value = null
      this.refreshToken.value = null
    }
    
    this.saveState()
  },
  
  // Lấy thông tin session hiện tại
  getCurrentSession() {
    if (!this.currentToken.value) return null
    
    return this.activeSessions.value.find(
      session => session.tokenId === this.currentToken.value
    )
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