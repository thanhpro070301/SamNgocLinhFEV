import { ref } from 'vue'
import { clearAllAuthData } from '@/utils/clearAuth'

// Session token service
const createSessionToken = () => {
  // State 
  const currentToken = ref(null)
  const refreshToken = ref(null)
  const tokenExpiry = ref(null)
  const currentSession = ref(null)
  const activeSessions = ref([])
  
  // Khởi tạo store từ localStorage
  const initFromLocalStorage = () => {
    try {
      console.log('Initializing session token from storage')
      
      // Kiểm tra cả localStorage và sessionStorage
      const localToken = localStorage.getItem('authToken')
      const sessionToken = sessionStorage.getItem('authToken')
      
      console.log('Storage check:', {
        localStorage: { hasToken: !!localToken },
        sessionStorage: { hasToken: !!sessionToken }
      })
      
      // Sử dụng token từ bất kỳ nguồn nào, ưu tiên localStorage
      const token = localToken || sessionToken
      
      if (!token) {
        console.log('No token found in any storage')
        return { success: false, error: 'No token found' }
      }
      
      // Đồng bộ giữa localStorage và sessionStorage
      if (localToken && !sessionToken) {
        console.log('Syncing from localStorage to sessionStorage')
        sessionStorage.setItem('authToken', localToken)
        sessionStorage.setItem('admin_current_token', localToken)
        sessionStorage.setItem('isAuthenticated', 'true')
        
        if (localStorage.getItem('tokenExpiresAt')) {
          sessionStorage.setItem('tokenExpiresAt', localStorage.getItem('tokenExpiresAt'))
        } else if (localStorage.getItem('expiresAt')) {
          sessionStorage.setItem('tokenExpiresAt', localStorage.getItem('expiresAt'))
          sessionStorage.setItem('expiresAt', localStorage.getItem('expiresAt'))
        }
        
        if (localStorage.getItem('userDetails')) {
          sessionStorage.setItem('userDetails', localStorage.getItem('userDetails'))
        } else if (localStorage.getItem('currentUser')) {
          sessionStorage.setItem('currentUser', localStorage.getItem('currentUser'))
        }
      } else if (sessionToken && !localToken) {
        console.log('Syncing from sessionStorage to localStorage')
        localStorage.setItem('authToken', sessionToken)
        localStorage.setItem('admin_current_token', sessionToken)
        localStorage.setItem('isAuthenticated', 'true')
        
        if (sessionStorage.getItem('tokenExpiresAt')) {
          localStorage.setItem('tokenExpiresAt', sessionStorage.getItem('tokenExpiresAt'))
        } else if (sessionStorage.getItem('expiresAt')) {
          localStorage.setItem('tokenExpiresAt', sessionStorage.getItem('expiresAt'))
          localStorage.setItem('expiresAt', sessionStorage.getItem('expiresAt'))
        }
        
        if (sessionStorage.getItem('userDetails')) {
          localStorage.setItem('userDetails', sessionStorage.getItem('userDetails'))
        } else if (sessionStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', sessionStorage.getItem('currentUser'))
        }
      } else if (localToken && sessionToken && localToken !== sessionToken) {
        // Tokens don't match - prefer localStorage version
        console.log('Token mismatch between localStorage and sessionStorage - using localStorage version')
        sessionStorage.setItem('authToken', localToken)
        sessionStorage.setItem('admin_current_token', localToken)
      }
      
      // Khởi tạo từ thông tin user - ưu tiên userDetails hơn currentUser
      const userStr = localStorage.getItem('userDetails') || 
                     sessionStorage.getItem('userDetails') || 
                     localStorage.getItem('currentUser') || 
                     sessionStorage.getItem('currentUser')
                     
      const expiresAtStr = localStorage.getItem('expiresAt') || 
                          localStorage.getItem('tokenExpiresAt') || 
                          sessionStorage.getItem('expiresAt') || 
                          sessionStorage.getItem('tokenExpiresAt')
      
      // Thiết lập token mới
      currentToken.value = token
      tokenExpiry.value = expiresAtStr ? parseInt(expiresAtStr) : null
      
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          
          // Tạo session mới
          const session = {
            id: Date.now().toString(),
            token: token,
            refreshToken: null,
            userId: userData.id || Date.now().toString(),
            userEmail: userData.email || 'admin@example.com',
            userName: userData.name || 'Admin',
            userRole: userData.role || 'ADMIN',
            createdAt: new Date().toISOString(),
            expiresAt: expiresAtStr ? new Date(parseInt(expiresAtStr)).toISOString() : null,
            lastActivity: new Date().toISOString(),
            rememberMe: false
          }
          
          currentSession.value = session
          activeSessions.value = [session]
          
          console.log('Session restored with token and user data')
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      } else {
        // Tạo default session nếu không có user data
        const session = {
          id: Date.now().toString(),
          token: token,
          refreshToken: null,
          userId: Date.now().toString(),
          userEmail: 'admin@example.com',
          userName: 'Admin',
          userRole: 'ADMIN',
          createdAt: new Date().toISOString(),
          expiresAt: expiresAtStr ? new Date(parseInt(expiresAtStr)).toISOString() : null,
          lastActivity: new Date().toISOString(),
          rememberMe: false
        }
        
        currentSession.value = session
        activeSessions.value = [session]
        
        console.log('Default session created with token only')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error initializing from localStorage:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Tạo token mới
  const createToken = (token, refreshToken = null, rememberMe = false) => {
    try {
      console.log('Creating new session token')
      
      // Clear existing tokens first
      clearAllAuthData()
      
      // Lưu token vào state
      currentToken.value = token
      
      if (refreshToken) {
        refreshToken.value = refreshToken
      }
      
      // Tính thời gian hết hạn
      const now = Date.now()
      const expiresAt = rememberMe
        ? now + (30 * 24 * 60 * 60 * 1000) // 30 ngày
        : now + (3 * 60 * 60 * 1000) // 3 giờ
      tokenExpiry.value = expiresAt
      
      // Lấy thông tin user
      const userStr = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails')
      let userData = null
      
      if (userStr) {
        try {
          userData = JSON.parse(userStr)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
      
      // Tạo session mới
      const session = {
        id: Date.now().toString(),
        token: token,
        refreshToken: refreshToken,
        userId: userData?.id || Date.now().toString(),
        userEmail: userData?.email || 'admin@example.com',
        userName: userData?.name || 'Admin',
        userRole: userData?.role || 'ADMIN',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(expiresAt).toISOString(),
        lastActivity: new Date().toISOString(),
        rememberMe: rememberMe
      }
      
      currentSession.value = session
      
      // Thêm vào danh sách sessions
      activeSessions.value.push(session)
      
      // Lưu vào localStorage và sessionStorage
      saveState()
      
      return { success: true, data: session }
    } catch (error) {
      console.error('Error creating token:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Reset token và tất cả sessions
  const resetAll = () => {
    console.log('Resetting all session tokens')
    
    currentToken.value = null
    refreshToken.value = null
    tokenExpiry.value = null
    currentSession.value = null
    activeSessions.value = []
    
    // Xóa khỏi cả localStorage và sessionStorage
    clearAllAuthData()
    
    return { success: true }
  }
  
  // Kiểm tra token có hợp lệ không
  const isTokenValid = () => {
    if (!currentToken.value || !tokenExpiry.value) {
      return false
    }
    
    const now = Date.now()
    return now < tokenExpiry.value
  }
  
  // Cập nhật hoạt động
  const updateActivity = () => {
    if (!currentSession.value) return false
    
    currentSession.value.lastActivity = new Date().toISOString()
    return true
  }
  
  // Lưu state vào localStorage và sessionStorage
  const saveState = () => {
    try {
      const token = currentToken.value || ''
      const isAuthenticated = token ? 'true' : 'false'
      
      // Lưu vào localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('admin_current_token', token)
      localStorage.setItem('isAuthenticated', isAuthenticated)
      
      if (tokenExpiry.value) {
        localStorage.setItem('tokenExpiresAt', tokenExpiry.value.toString())
        localStorage.setItem('expiresAt', tokenExpiry.value.toString())
      }
      
      // Lưu vào sessionStorage
      sessionStorage.setItem('authToken', token)
      sessionStorage.setItem('admin_current_token', token)
      sessionStorage.setItem('isAuthenticated', isAuthenticated)
      
      if (tokenExpiry.value) {
        sessionStorage.setItem('tokenExpiresAt', tokenExpiry.value.toString())
        sessionStorage.setItem('expiresAt', tokenExpiry.value.toString())
      }
      
      // Lưu thông tin session hiện tại
      if (currentSession.value) {
        const sessionInfo = JSON.stringify(currentSession.value)
        localStorage.setItem('currentSession', sessionInfo)
        sessionStorage.setItem('currentSession', sessionInfo)
      }
      
      return true
    } catch (error) {
      console.error('Error saving state:', error)
      return false
    }
  }
  
  // Fix token synchronization function
  const syncTokens = () => {
    try {
      console.log('Synchronizing tokens between localStorage and sessionStorage');
      
      // Get tokens from both storage types
      const localToken = localStorage.getItem('authToken');
      const sessionToken = sessionStorage.getItem('authToken');
      
      // Get authentication state from both storage types
      const localAuthState = localStorage.getItem('isAuthenticated');
      const sessionAuthState = sessionStorage.getItem('isAuthenticated');
      
      // Get expiration time from both storage types
      const localExpiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt');
      const sessionExpiresAt = sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt');
      
      // Get user details from both storage types
      const localUserDetails = localStorage.getItem('userDetails');
      const sessionUserDetails = sessionStorage.getItem('userDetails');
      
      console.log('Current token state:', {
        localStorage: { 
          hasToken: !!localToken, 
          isAuthenticated: localAuthState, 
          hasExpiry: !!localExpiresAt,
          hasUser: !!localUserDetails
        },
        sessionStorage: { 
          hasToken: !!sessionToken, 
          isAuthenticated: sessionAuthState,
          hasExpiry: !!sessionExpiresAt,
          hasUser: !!sessionUserDetails
        }
      });
      
      // Synchronize from localStorage to sessionStorage if localStorage has token
      if (localToken && (!sessionToken || localToken !== sessionToken)) {
        console.log('Synchronizing from localStorage to sessionStorage');
        sessionStorage.setItem('authToken', localToken);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        if (localExpiresAt) {
          sessionStorage.setItem('expiresAt', localExpiresAt);
          sessionStorage.setItem('tokenExpiresAt', localExpiresAt);
        }
        
        if (localUserDetails) {
          sessionStorage.setItem('userDetails', localUserDetails);
        }
      }
      // Synchronize from sessionStorage to localStorage if sessionStorage has token
      else if (sessionToken && (!localToken || sessionToken !== localToken)) {
        console.log('Synchronizing from sessionStorage to localStorage');
        localStorage.setItem('authToken', sessionToken);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (sessionExpiresAt) {
          localStorage.setItem('expiresAt', sessionExpiresAt);
          localStorage.setItem('tokenExpiresAt', sessionExpiresAt);
        }
        
        if (sessionUserDetails) {
          localStorage.setItem('userDetails', sessionUserDetails);
        }
      }
      // Ensure expiresAt and tokenExpiresAt are in sync within the same storage
      else {
        // Sync expiresAt and tokenExpiresAt in localStorage
        if (localStorage.getItem('expiresAt') && !localStorage.getItem('tokenExpiresAt')) {
          localStorage.setItem('tokenExpiresAt', localStorage.getItem('expiresAt'));
        } else if (!localStorage.getItem('expiresAt') && localStorage.getItem('tokenExpiresAt')) {
          localStorage.setItem('expiresAt', localStorage.getItem('tokenExpiresAt'));
        }
        
        // Sync expiresAt and tokenExpiresAt in sessionStorage
        if (sessionStorage.getItem('expiresAt') && !sessionStorage.getItem('tokenExpiresAt')) {
          sessionStorage.setItem('tokenExpiresAt', sessionStorage.getItem('expiresAt'));
        } else if (!sessionStorage.getItem('expiresAt') && sessionStorage.getItem('tokenExpiresAt')) {
          sessionStorage.setItem('expiresAt', sessionStorage.getItem('tokenExpiresAt'));
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error synchronizing tokens:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Updated token validation function
  const validateTokenWithAPI = async (token = null) => {
    try {
      // Synchronize tokens first to ensure we have all valid tokens
      syncTokens();
      
      // Get token from parameters or from storage
      token = token || currentToken.value || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found for validation');
        return false;
      }
      
      // Check expiration time
      const expiresAt = parseInt(localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt') || sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt') || '0');
      const now = Date.now();
      
      // If we have a clear expiration time and it's expired, don't even call the API
      if (expiresAt && now >= expiresAt) {
        console.log('Token is expired, clearing auth data');
        resetAll();
        return false;
      }
      
      // Make API call to validate token
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      // Ensure we don't double the /api prefix
      const apiPath = apiUrl.endsWith('/api') ? '/auth/check-token' : '/api/auth/check-token';
      const response = await fetch(`${apiUrl}${apiPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        console.log('Token validation failed, API returned error:', response.status);
        resetAll();
        return false;
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.valid) {
        // Update last activity
        updateActivity();
        return true;
      }
      
      // If token is invalid, clear all auth data
      console.log('Token is invalid according to API');
      resetAll();
      return false;
    } catch (error) {
      console.error('Error validating token with API:', error);
      return false;
    }
  };
  
  return {
    currentToken,
    tokenExpiry,
    currentSession,
    activeSessions,
    initFromLocalStorage,
    createToken,
    resetAll,
    isTokenValid,
    updateActivity,
    saveState,
    syncTokens,
    validateTokenWithAPI
  }
}

export default createSessionToken() 