// Debug utility để kiểm tra localStorage
export const checkLocalStorage = () => {
  // Kiểm tra localStorage
  const authToken = localStorage.getItem('authToken')
  const expiresAt = localStorage.getItem('tokenExpiresAt')
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const currentUser = localStorage.getItem('currentUser')
  
  console.log('DEBUG - LocalStorage state:', {
    authToken: authToken ? `${authToken.substring(0, 8)}...` : null,
    expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : null,
    isAuthenticated,
    hasUser: !!currentUser,
    userDetails: currentUser ? JSON.parse(currentUser) : null
  })
  
  // Kiểm tra sessionStorage
  const sessionAuthToken = sessionStorage.getItem('authToken')
  const sessionExpiresAt = sessionStorage.getItem('tokenExpiresAt')
  const sessionIsAuthenticated = sessionStorage.getItem('isAuthenticated')
  
  console.log('DEBUG - SessionStorage state:', {
    authToken: sessionAuthToken ? `${sessionAuthToken.substring(0, 8)}...` : null,
    expiresAt: sessionExpiresAt ? new Date(parseInt(sessionExpiresAt)).toISOString() : null,
    isAuthenticated: sessionIsAuthenticated
  })
  
  // So sánh localStorage và sessionStorage
  console.log('DEBUG - Storage comparison:', {
    tokenMatch: authToken === sessionAuthToken,
    expiresAtMatch: expiresAt === sessionExpiresAt,
    authStateMatch: isAuthenticated === sessionIsAuthenticated
  })
  
  // Kiểm tra token còn hạn không
  const now = Date.now()
  let isValid = false
  
  if (authToken && expiresAt) {
    const expireTime = parseInt(expiresAt)
    const isLocalValid = now < expireTime
    
    console.log('DEBUG - LocalStorage token validity:', {
      isValid: isLocalValid,
      timeLeftMinutes: Math.round((expireTime - now) / 1000 / 60),
      now: new Date(now).toISOString(),
      expires: new Date(expireTime).toISOString()
    })
    
    if (isLocalValid) {
      isValid = true
    }
  }
  
  if (sessionAuthToken && sessionExpiresAt && !isValid) {
    const sessionExpireTime = parseInt(sessionExpiresAt)
    const isSessionValid = now < sessionExpireTime
    
    console.log('DEBUG - SessionStorage token validity:', {
      isValid: isSessionValid,
      timeLeftMinutes: Math.round((sessionExpireTime - now) / 1000 / 60),
      now: new Date(now).toISOString(),
      expires: new Date(sessionExpireTime).toISOString()
    })
    
    if (isSessionValid) {
      isValid = true
    }
  }
  
  // Kiểm tra bổ sung các trường hợp đặc biệt
  console.log('DEBUG - Edge cases check:', {
    localStorage: {
      nullToken: authToken === null,
      emptyToken: authToken === '',
      invalidExpiry: expiresAt === null || isNaN(parseInt(expiresAt)),
      malformedUser: currentUser !== null && (() => {
        try {
          JSON.parse(currentUser);
          return false;
        } catch (e) {
          return true;
        }
      })()
    },
    sessionStorage: {
      nullToken: sessionAuthToken === null,
      emptyToken: sessionAuthToken === '',
      invalidExpiry: sessionExpiresAt === null || isNaN(parseInt(sessionExpiresAt))
    }
  })
  
  return {
    isValid,
    token: authToken || sessionAuthToken,
    user: currentUser ? JSON.parse(currentUser) : null,
    expires: expiresAt ? new Date(parseInt(expiresAt)) : null,
    comparison: {
      tokenMatch: authToken === sessionAuthToken,
      expiresAtMatch: expiresAt === sessionExpiresAt
    }
  }
}

// Kiểm tra trạng thái auth store
export const checkAuthStore = (store) => {
  if (!store) {
    console.log('DEBUG - Auth store not provided')
    return null
  }
  
  console.log('DEBUG - Auth store state:', {
    isAuthenticated: store.isAuthenticated,
    hasUser: !!store.user,
    user: store.user,
    loading: store.loading,
    error: store.error
  })
  
  return {
    isAuthenticated: store.isAuthenticated,
    user: store.user
  }
}

// Automatically check when imported
if (typeof window !== 'undefined') {
  console.log('DEBUG - Checking localStorage and sessionStorage...')
  checkLocalStorage()
}

export default {
  checkLocalStorage,
  checkAuthStore
} 