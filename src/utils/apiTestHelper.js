/**
 * API Test Helper
 * Công cụ hỗ trợ kiểm tra API và xác thực
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

/**
 * Kiểm tra kết nối với API
 * @returns {Promise<{success: boolean, message: string, status: number}>}
 */
export async function checkApiConnection() {
  try {
    console.log('Testing API connection to:', API_BASE_URL)
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      return {
        success: true,
        message: 'API connection successful',
        status: response.status
      }
    }
    
    return {
      success: false,
      message: `API returned status ${response.status}`,
      status: response.status
    }
  } catch (error) {
    console.error('API connection test failed:', error)
    return {
      success: false,
      message: error.message || 'API connection failed',
      status: 0
    }
  }
}

/**
 * Kiểm tra token hiện tại
 * @returns {Promise<{success: boolean, message: string, tokenInfo: Object}>}
 */
export async function checkCurrentToken() {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      return {
        success: false,
        message: 'No token found in localStorage',
        tokenInfo: null
      }
    }
    
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    const now = Date.now()
    const isExpired = expiresAt && now >= parseInt(expiresAt)
    const timeLeft = expiresAt ? Math.floor((parseInt(expiresAt) - now) / 1000) : 0
    
    // Kiểm tra token với server
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const serverVerified = response.ok
      
      return {
        success: !isExpired && serverVerified,
        message: serverVerified 
          ? (isExpired ? 'Token expired but verified by server' : 'Token valid and verified by server')
          : (isExpired ? 'Token expired and rejected by server' : 'Token not expired but rejected by server'),
        tokenInfo: {
          token: token.substring(0, 8) + '...',
          expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : 'unknown',
          isExpired,
          timeLeftSeconds: timeLeft,
          serverVerified
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Error verifying token with server: ${error.message}`,
        tokenInfo: {
          token: token.substring(0, 8) + '...',
          expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : 'unknown',
          isExpired,
          timeLeftSeconds: timeLeft,
          serverError: error.message
        }
      }
    }
  } catch (error) {
    console.error('Token check failed:', error)
    return {
      success: false,
      message: `Error checking token: ${error.message}`,
      tokenInfo: null
    }
  }
}

/**
 * Kiểm tra login với email và password
 * @param {string} email Email để test
 * @param {string} password Password để test
 * @returns {Promise<{success: boolean, message: string, tokenInfo: Object}>}
 */
export async function testLogin(email, password) {
  try {
    console.log('Testing login with:', { email, password: '********' })
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe: false }),
      credentials: 'omit'
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: `Login failed: ${data.message || response.statusText}`,
        loginInfo: {
          status: response.status,
          responseBody: data
        }
      }
    }
    
    if (data.success && data.data && data.data.token) {
      return {
        success: true,
        message: 'Login successful',
        loginInfo: {
          token: data.data.token.substring(0, 8) + '...',
          user: data.data.user,
          expiresAt: data.data.expiresAt || 'unknown'
        }
      }
    }
    
    return {
      success: false,
      message: 'Login response did not contain required token',
      loginInfo: {
        status: response.status,
        responseBody: data
      }
    }
  } catch (error) {
    console.error('Login test failed:', error)
    return {
      success: false,
      message: `Error testing login: ${error.message}`,
      loginInfo: null
    }
  }
}

/**
 * Kiểm tra đồng bộ giữa localStorage và sessionStorage
 * @returns {{success: boolean, message: string, differences: Object}}
 */
export function checkStorageSync() {
  try {
    // Các key cần kiểm tra
    const keysToCheck = [
      'authToken',
      'admin_current_token',
      'isAuthenticated',
      'tokenExpiresAt',
      'currentUser'
    ]
    
    const differences = {}
    let hasDifferences = false
    
    for (const key of keysToCheck) {
      const localValue = localStorage.getItem(key)
      const sessionValue = sessionStorage.getItem(key)
      
      if (localValue !== sessionValue) {
        hasDifferences = true
        differences[key] = {
          localStorage: localValue ? (key.includes('token') ? localValue.substring(0, 8) + '...' : localValue) : null,
          sessionStorage: sessionValue ? (key.includes('token') ? sessionValue.substring(0, 8) + '...' : sessionValue) : null
        }
      }
    }
    
    return {
      success: !hasDifferences,
      message: hasDifferences ? 'Found differences between localStorage and sessionStorage' : 'Storage is in sync',
      differences: hasDifferences ? differences : null
    }
  } catch (error) {
    console.error('Storage sync check failed:', error)
    return {
      success: false,
      message: `Error checking storage sync: ${error.message}`,
      differences: null
    }
  }
}

export default {
  checkApiConnection,
  checkCurrentToken,
  testLogin,
  checkStorageSync
} 