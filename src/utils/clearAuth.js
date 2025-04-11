/**
 * Utility để xóa tất cả dữ liệu xác thực
 */

// Danh sách các key cần xóa
const AUTH_KEYS = [
  'authToken',
  'isAuthenticated',
  'hasUser',
  'userDetails',
  'expiresAt',
  'tokenExpiresAt',
  'admin_current_token',
  'currentUser',
  'redirectAfterLogin',
  'lastTokenValidation',
  'validating_token',
  'cachedOrders',
  'lastOrdersLoaded',
  'redirect_count',
  '_recent_logout'
];

// Danh sách các key mở rộng cần xóa khi forceClean = true
const EXTENDED_KEYS = [
  'userDetails', 
  'user', 
  'currentUser', 
  'userData', 
  'profile', 
  'user_data',
  'cachedOrders',
  'orders',
  'cart',
  'cartItems',
  'lastOrdersLoaded',
  'lastTokenValidation',
  'validating_token'
];

/**
 * Xóa tất cả dữ liệu xác thực
 * @param {Object} options - Tùy chọn
 * @param {boolean} options.notifyOtherTabs - Thông báo cho các tab khác biết là đã đăng xuất
 * @param {boolean} options.clearLocalOnly - Chỉ xóa localStorage mà không xóa sessionStorage
 * @param {boolean} options.clearSessionOnly - Chỉ xóa sessionStorage mà không xóa localStorage
 * @param {boolean} options.forceClean - Xóa triệt để và bỏ qua cache
 */
export const clearAllAuthData = (options = {}) => {
  const { 
    notifyOtherTabs = true,
    clearLocalOnly = false,
    clearSessionOnly = false,
    forceClean = true  // Mặc định luôn force clean
  } = options;
  
  console.log('Clearing auth data', { clearLocalOnly, clearSessionOnly, forceClean });
  
  try {
    if (notifyOtherTabs) {
      try {
        // Tạo sự kiện để thông báo cho các tab khác
        // Ghi 'logging_out' vào localStorage trước rồi xóa sau để các tab khác nhận biết
        localStorage.setItem('auth_event', 'logging_out');
        
        // Tạo sự kiện DOM để các component có thể phản ứng
        document.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { 
            manual: true,
            time: Date.now()
          }
        }));
        
        setTimeout(() => localStorage.removeItem('auth_event'), 500);
      } catch (e) {
        console.error('Error setting auth event:', e);
      }
    }
    
    // Xóa localStorage
    if (!clearSessionOnly) {
      // Xóa các key chính
      AUTH_KEYS.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing ${key} from localStorage:`, error);
        }
      });
      
      // Xóa bổ sung nếu forceClean = true
      if (forceClean) {
        // Xóa các key khác có thể liên quan đến auth
        EXTENDED_KEYS.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
          }
        });
        
        // Xóa toàn bộ localStorage keys có chứa các từ khóa liên quan đến auth
        try {
          const keywordsToMatch = ['token', 'auth', 'user', 'profile', 'session', 'login', 'order'];
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && keywordsToMatch.some(keyword => key.toLowerCase().includes(keyword))) {
              localStorage.removeItem(key);
              console.log(`Removed localStorage key: ${key}`);
            }
          }
        } catch (e) {
          console.error('Error cleaning localStorage by keywords:', e);
        }
      }
    }
    
    // Xóa sessionStorage
    if (!clearLocalOnly) {
      // Xóa các key chính
      AUTH_KEYS.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing ${key} from sessionStorage:`, error);
        }
      });
      
      // Xóa bổ sung nếu forceClean = true
      if (forceClean) {
        // Xóa các key khác có thể liên quan đến auth
        EXTENDED_KEYS.forEach(key => {
          try {
            sessionStorage.removeItem(key);
          } catch (error) {
            console.error(`Error removing ${key} from sessionStorage:`, error);
          }
        });
        
        // Xóa toàn bộ sessionStorage keys có chứa các từ khóa liên quan đến auth
        try {
          const keywordsToMatch = ['token', 'auth', 'user', 'profile', 'session', 'login', 'order'];
          
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && keywordsToMatch.some(keyword => key.toLowerCase().includes(keyword))) {
              sessionStorage.removeItem(key);
              console.log(`Removed sessionStorage key: ${key}`);
            }
          }
        } catch (e) {
          console.error('Error cleaning sessionStorage by keywords:', e);
        }
      }
    }
    
    // Reset token validation cache
    if (forceClean) {
      lastTokenValidationResult = null;
      lastTokenValidationTime = 0;
      isTokenValidationInProgress = false;
      sessionCheckAttempts = 0;
    }
    
    console.log('Auth data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

// Rate limiting variables
let lastSessionCheck = 0;
const SESSION_CHECK_COOLDOWN = 10000; // 10 seconds between checks (increased from 5s)
let sessionCheckAttempts = 0;
const MAX_SESSION_CHECK_ATTEMPTS = 2;
// Global token validation state to coordinate between different components
let isTokenValidationInProgress = false;
let lastTokenValidationResult = null;
let lastTokenValidationTime = 0;
// Cache validation results for at least 30 seconds
const TOKEN_VALIDATION_CACHE_TIME = 30000;

// Xóa dữ liệu xác thực nếu phát hiện token không hợp lệ
export const clearInvalidSession = async () => {
  try {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      return clearAllAuthData();
    }
    
    // Use cached result if available and recent
    const now = Date.now();
    if (lastTokenValidationResult !== null && 
        (now - lastTokenValidationTime < TOKEN_VALIDATION_CACHE_TIME)) {
      console.log('Using cached token validation result:', 
        lastTokenValidationResult ? 'valid' : 'invalid',
        `(${Math.round((now - lastTokenValidationTime)/1000)}s ago)`);
      
      return lastTokenValidationResult === false ? clearAllAuthData() : false;
    }
    
    // Don't check if another validation is already in progress
    if (isTokenValidationInProgress) {
      console.log('Token validation already in progress, skipping duplicate check');
      return false;
    }
    
    // Implement rate limiting
    if (now - lastSessionCheck < SESSION_CHECK_COOLDOWN) {
      console.log(`Rate limiting session check (tried ${sessionCheckAttempts + 1} times in ${now - lastSessionCheck}ms)`);
      
      if (++sessionCheckAttempts >= MAX_SESSION_CHECK_ATTEMPTS) {
        console.log('Too many session check attempts, skipping validation');
        // Return existing auth state instead of making API calls
        return false;
      }
    } else {
      // Reset attempts if enough time has passed
      sessionCheckAttempts = 0;
    }
    
    // Update timestamp and mark validation as in progress
    lastSessionCheck = now;
    isTokenValidationInProgress = true;
    
    // Thực hiện kiểm tra token cuối cùng trước khi xóa
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      // Ensure we don't double the /api prefix
      const apiPath = apiUrl.endsWith('/api') ? '/auth/check-token' : '/api/auth/check-token';
      const response = await fetch(`${apiUrl}${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      // Reset attempt counter on successful API call
      sessionCheckAttempts = 0;
      
      // Check for rate limiting response
      if (response.status === 429) {
        console.log('Rate limit exceeded (429), skipping validation');
        isTokenValidationInProgress = false;
        return false;
      }
      
      const result = await response.json();
      
      // Store validation result in cache
      lastTokenValidationResult = result.success && result.data.valid;
      lastTokenValidationTime = Date.now();
      
      // Nếu token không hợp lệ, xóa dữ liệu
      if (!result.success || !result.data.valid) {
        console.log('Token validation failed, clearing auth data');
        isTokenValidationInProgress = false;
        return clearAllAuthData();
      } else {
        console.log('Token is valid, not clearing auth data');
        isTokenValidationInProgress = false;
        return false;
      }
    } catch (error) {
      console.error('Error validating token, clearing auth data:', error);
      
      // Check if it's a rate limiting error
      if (error.status === 429 || error.message?.includes('429')) {
        console.log('Possible rate limit error, not clearing auth data');
        isTokenValidationInProgress = false;
        return false;
      }
      
      // Reset validation state
      isTokenValidationInProgress = false;
      lastTokenValidationResult = false;
      lastTokenValidationTime = Date.now();
      
      return clearAllAuthData();
    }
  } catch (error) {
    console.error('Error in clearInvalidSession:', error);
    isTokenValidationInProgress = false;
    return clearAllAuthData();
  }
};

export default clearAllAuthData; 