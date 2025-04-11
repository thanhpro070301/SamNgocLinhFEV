/**
 * Utility to test the authentication flow and token storage
 */
import { clearAllAuthData } from './clearAuth';
import { login, logout, validateToken } from '@/api/auth.service';

// Test the login flow
export async function testLogin(email, password, rememberMe = false) {
  console.group('🔍 Testing Login Process');
  console.log('1. Starting with clean state...');
  clearAllAuthData();
  
  console.log('2. Attempting login with:', { email, password, rememberMe });
  const loginResult = await login(email, password, rememberMe);
  
  console.log('3. Login result:', loginResult);
  
  console.log('4. Checking localStorage...');
  const localStorageData = {
    authToken: localStorage.getItem('authToken'),
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    userDetails: localStorage.getItem('userDetails'),
    expiresAt: localStorage.getItem('expiresAt')
  };
  console.log('   localStorage data:', localStorageData);
  
  console.log('5. Checking sessionStorage...');
  const sessionStorageData = {
    authToken: sessionStorage.getItem('authToken'),
    isAuthenticated: sessionStorage.getItem('isAuthenticated'),
    userDetails: sessionStorage.getItem('userDetails'),
    expiresAt: sessionStorage.getItem('expiresAt')
  };
  console.log('   sessionStorage data:', sessionStorageData);
  
  console.log('6. Validating token with backend...');
  const isValid = await validateToken();
  console.log('   Token valid:', isValid);
  
  const tokensMatch = localStorageData.authToken === sessionStorageData.authToken;
  console.log('7. Tokens match between localStorage and sessionStorage:', tokensMatch);

  // Kiểm tra chi tiết đồng bộ giữa localStorage và sessionStorage
  const storageSync = checkStorageSync();
  console.log('8. Storage synchronization check:', storageSync);
  
  // Kiểm tra chi tiết đồng bộ với backend
  console.log('9. Performing backend sync check...');
  const backendSync = await checkBackendSync(localStorageData.authToken);
  console.log('   Backend sync result:', backendSync);
  
  console.groupEnd();
  
  return {
    success: loginResult.success,
    tokensMatch,
    isValid,
    localStorageData,
    sessionStorageData,
    storageSync,
    backendSync
  };
}

// Kiểm tra đồng bộ giữa localStorage và sessionStorage
function checkStorageSync() {
  const keys = ['authToken', 'isAuthenticated', 'expiresAt', 'userDetails'];
  const results = {};
  let allSynced = true;
  
  for (const key of keys) {
    const localValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);
    const isSynced = localValue === sessionValue && (localValue !== null || sessionValue !== null);
    
    results[key] = {
      inLocalStorage: !!localValue,
      inSessionStorage: !!sessionValue,
      isSynced
    };
    
    if (!isSynced) {
      allSynced = false;
    }
  }
  
  return {
    allSynced,
    details: results
  };
}

// Kiểm tra đồng bộ với backend
async function checkBackendSync(token) {
  if (!token) {
    return {
      success: false,
      message: 'No token available to check'
    };
  }
  
  try {
    // Kiểm tra token với backend
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    
    // Phân tích kết quả
    if (result.success && result.data.valid) {
      // Kiểm tra thời gian hết hạn
      const serverExpiresAt = result.data.expiresAt;
      const clientExpiresAt = localStorage.getItem('expiresAt') || sessionStorage.getItem('expiresAt');
      
      let expiryMatch = false;
      let expiryInfo = {};
      
      if (serverExpiresAt && clientExpiresAt) {
        const serverDate = new Date(serverExpiresAt).getTime();
        const clientDate = parseInt(clientExpiresAt, 10);
        
        // Cho phép sai lệch 5 giây
        const timeDiff = Math.abs(serverDate - clientDate);
        expiryMatch = timeDiff < 5000; // 5 seconds
        
        expiryInfo = {
          server: new Date(serverDate).toISOString(),
          client: new Date(clientDate).toISOString(),
          diffMs: timeDiff,
          isAcceptable: expiryMatch
        };
      }
      
      return {
        success: true,
        tokenValid: true,
        expiryMatch,
        expiryInfo,
        userId: result.data.userId,
        serverData: result.data
      };
    } else {
      return {
        success: true,
        tokenValid: false,
        reason: result.data.error || 'unknown'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
}

// Test the logout flow
export async function testLogout() {
  console.group('🔍 Testing Logout Process');
  
  console.log('1. Logging out...');
  await logout();
  
  console.log('2. Checking localStorage after logout...');
  const localStorageData = {
    authToken: localStorage.getItem('authToken'),
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    userDetails: localStorage.getItem('userDetails'),
    expiresAt: localStorage.getItem('expiresAt')
  };
  console.log('   localStorage data after logout:', localStorageData);
  
  console.log('3. Checking sessionStorage after logout...');
  const sessionStorageData = {
    authToken: sessionStorage.getItem('authToken'),
    isAuthenticated: sessionStorage.getItem('isAuthenticated'),
    userDetails: sessionStorage.getItem('userDetails'),
    expiresAt: sessionStorage.getItem('expiresAt')
  };
  console.log('   sessionStorage data after logout:', sessionStorageData);
  
  const isCleared = !localStorageData.authToken && 
                   !localStorageData.isAuthenticated && 
                   !sessionStorageData.authToken && 
                   !sessionStorageData.isAuthenticated;
  
  console.log('4. All auth data cleared:', isCleared);
  
  console.groupEnd();
  
  return {
    success: isCleared,
    localStorageData,
    sessionStorageData
  };
}

// Tạo một chức năng kiểm tra tình trạng đăng nhập
export async function checkLoginStatus() {
  const localToken = localStorage.getItem('authToken');
  const sessionToken = sessionStorage.getItem('authToken');
  const localIsAuth = localStorage.getItem('isAuthenticated') === 'true';
  const sessionIsAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  
  let backendValid = false;
  let tokenSource = null;
  
  if (localToken) {
    tokenSource = 'localStorage';
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/check-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: localToken })
      });
      const result = await response.json();
      backendValid = result.data?.valid === true;
    } catch (error) {
      console.error('Error checking localStorage token:', error);
    }
  } else if (sessionToken) {
    tokenSource = 'sessionStorage';
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/check-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: sessionToken })
      });
      const result = await response.json();
      backendValid = result.data?.valid === true;
    } catch (error) {
      console.error('Error checking sessionStorage token:', error);
    }
  }
  
  // Kiểm tra việc đồng bộ
  const tokenMatch = !localToken || !sessionToken || localToken === sessionToken;
  const authFlagMatch = localIsAuth === sessionIsAuth;
  
  return {
    hasLocalToken: !!localToken,
    hasSessionToken: !!sessionToken,
    localIsAuth,
    sessionIsAuth,
    tokenMatch,
    authFlagMatch,
    backendValid,
    tokenSource,
    isSynced: tokenMatch && authFlagMatch,
    isFullySynced: tokenMatch && authFlagMatch && 
                  ((localIsAuth && backendValid) || (!localIsAuth && !backendValid))
  };
}

export default {
  testLogin,
  testLogout,
  checkLoginStatus
}; 