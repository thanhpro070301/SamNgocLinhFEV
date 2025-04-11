import axios from 'axios';
import { clearAllAuthData } from '@/utils/clearAuth';

// Thông tin API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Logging helper
function logApiConfig() {
  console.log('Auth Service API Configuration:', {
    baseURL: API_URL,
    timeout: 10000
  });
}

// Log API config in development
if (import.meta.env.MODE === 'development') {
  logApiConfig();
}

// Base API client setup
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Trích xuất baseURL để tránh endpoints trùng lặp
const baseUrlHasApi = API_URL.endsWith('/api');

// Request interceptor - adds token to all requests
api.interceptors.request.use(
  config => {
    // Use both localStorage and sessionStorage like in index.js
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Ensure token is synchronized between storages
      if (!localStorage.getItem('authToken') && sessionStorage.getItem('authToken')) {
        localStorage.setItem('authToken', sessionStorage.getItem('authToken'));
        localStorage.setItem('isAuthenticated', 'true');
      } else if (!sessionStorage.getItem('authToken') && localStorage.getItem('authToken')) {
        sessionStorage.setItem('authToken', localStorage.getItem('authToken'));
        sessionStorage.setItem('isAuthenticated', 'true');
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handles auth errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Use the clearAllAuthData utility to ensure all auth data is cleared
      clearAllAuthData();
      
      // Redirect to login
      window.location.href = '/auth/login?session=expired';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Login function
async function login(email, password, rememberMe = false) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      rememberMe
    });
    
    if (response.data.success) {
      const authData = response.data.data;
      
      // Clear any existing auth data first
      clearAllAuthData();
      
      // Set default expiration time if not provided by the server
      const now = Date.now();
      
      // Ensure we're handling the expiration time correctly
      let expiresAt;
      if (authData.expiresAt) {
        // Convert string to number if needed
        if (typeof authData.expiresAt === 'string') {
          // Try to parse as ISO date string
          const parsedDate = new Date(authData.expiresAt).getTime();
          
          // Validate if the parsed date is valid and in the future
          if (!isNaN(parsedDate) && parsedDate > now) {
            expiresAt = parsedDate;
          } else {
            // Try to parse as a numeric timestamp
            const numericExpiry = parseInt(authData.expiresAt, 10);
            if (!isNaN(numericExpiry) && numericExpiry > now) {
              expiresAt = numericExpiry;
            } else {
              // Use default if date is invalid or in the past
              expiresAt = now + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
            }
          }
        } else if (typeof authData.expiresAt === 'number') {
          // If it's already a number, validate it's in the future
          expiresAt = authData.expiresAt > now ? authData.expiresAt : now + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
        } else {
          // Default for any other cases
          expiresAt = now + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
        }
      } else {
        // No expiresAt provided, use default
        expiresAt = now + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
      }
      
      console.log('Setting token expiry to:', new Date(expiresAt).toISOString(), `(${Math.round((expiresAt - now) / 1000 / 60)} minutes from now)`);
      
      // Save auth data to localStorage
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('expiresAt', expiresAt.toString());
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      localStorage.setItem('isAuthenticated', 'true');
      
      // Save same data to sessionStorage for redundancy
      sessionStorage.setItem('authToken', authData.token);
      sessionStorage.setItem('expiresAt', expiresAt.toString());
      sessionStorage.setItem('tokenExpiresAt', expiresAt.toString());
      sessionStorage.setItem('isAuthenticated', 'true');
      
      // Save user data if available
      if (authData.user) {
        localStorage.setItem('hasUser', 'true');
        localStorage.setItem('userDetails', JSON.stringify(authData.user));
        
        // Also save to sessionStorage for consistency
        sessionStorage.setItem('userDetails', JSON.stringify(authData.user));
      }
      
      console.log('Login successful - token stored in localStorage and sessionStorage with expiry:', new Date(expiresAt).toISOString());
      
      // Return both token and user data for immediate use
      return { 
        success: true,
        token: authData.token,
        user: authData.user,
        expiresAt: expiresAt
      };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Lỗi kết nối máy chủ'
    };
  }
}

// Logout function with improved error handling
async function logout(token = null) {
  // Kiểm tra nếu token không được cung cấp, thử lấy từ storage
  if (!token) {
    token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  
  // Nếu không có token, không cần gọi API
  if (!token) {
    console.log('No token available for logout');
    clearAllAuthData();
    return { success: true, message: 'Logged out (no token)' };
  }
  
  console.log('Calling logout API with token:', token ? `${token.substring(0, 10)}...` : 'no token');
  
  try {
    // Đảm bảo không có /api trùng lặp trong URL
    const endpoint = baseUrlHasApi ? '/auth/logout' : '/api/auth/logout';
    console.log('Logout API endpoint:', endpoint);
    
    // Call logout API
    const response = await api.post(endpoint, { token });
    console.log('Logout API response success:', response.data);
    
    // Clear auth state
    clearAllAuthData();
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout API error:', error.response || error);
    
    // Still clear auth state even if API call fails
    clearAllAuthData();
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error during logout'
    };
  } finally {
    console.log('Logout process completed');
  }
}

// Rate limiting variables for token validation
let lastTokenValidation = 0;
const TOKEN_VALIDATION_COOLDOWN = 5000; // 5 seconds between validation attempts
let validationAttempts = 0;
const MAX_VALIDATION_ATTEMPTS = 3; // Maximum 3 attempts before backing off longer
let isBackingOff = false;

// Validate token function
async function validateToken() {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) return false;
  
  // Implement rate limiting to prevent 429 errors
  const now = Date.now();
  if (now - lastTokenValidation < TOKEN_VALIDATION_COOLDOWN) {
    console.log(`Rate limiting token validation (tried ${validationAttempts + 1} times in ${now - lastTokenValidation}ms)`);
    
    // If we've made multiple attempts in a short time, back off longer
    if (++validationAttempts >= MAX_VALIDATION_ATTEMPTS) {
      console.log('Too many validation attempts, backing off for 30 seconds');
      isBackingOff = true;
      setTimeout(() => {
        isBackingOff = false;
        validationAttempts = 0;
      }, 30000); // Back off for 30 seconds
      
      // Return false to avoid more API calls, but don't clear auth state
      return false;
    }
    
    // Use cached result if we're in cooldown period
    const cachedAuth = localStorage.getItem('isAuthenticated') === 'true';
    return cachedAuth;
  }
  
  // If in long backoff period, return cached result
  if (isBackingOff) {
    console.log('In backoff period, skipping token validation');
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  // Reset attempt counter if enough time has passed
  if (now - lastTokenValidation > TOKEN_VALIDATION_COOLDOWN * 2) {
    validationAttempts = 0;
  }
  
  // Update last validation timestamp
  lastTokenValidation = now;
  
  try {
    // Đảm bảo gọi đúng path API không bị trùng lặp
    const endpoint = baseUrlHasApi ? '/auth/check-token' : '/api/auth/check-token';
    const response = await api.post(endpoint, { token });
    
    // Tăng cường xử lý lỗi
    if (!response.data) {
      console.error('Invalid response format from check-token endpoint');
      return false;
    }
    
    const data = response.data.data || {};
    const isValid = data.valid === true;
    
    // Reset attempt counter on successful validation
    validationAttempts = 0;
    
    // If token is invalid, clear all auth data
    if (!isValid) {
      console.warn('Token validation failed:', data.error || 'unknown reason');
      clearAllAuthData();
      return false;
    }
    
    // Đồng bộ hóa thông tin token giữa localStorage và sessionStorage
    const localToken = localStorage.getItem('authToken');
    const sessionToken = sessionStorage.getItem('authToken');
    
    // Đảm bảo token tồn tại trong cả hai storage
    if (localToken && !sessionToken) {
      sessionStorage.setItem('authToken', localToken);
      sessionStorage.setItem('isAuthenticated', 'true');
    } else if (sessionToken && !localToken) {
      localStorage.setItem('authToken', sessionToken);
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    // Cập nhật thông tin expiresAt nếu server trả về
    if (data.expiresAt) {
      const serverExpiresAt = new Date(data.expiresAt).getTime();
      
      // Nếu thời gian hết hạn từ server hợp lệ, cập nhật cả hai storage
      if (!isNaN(serverExpiresAt) && serverExpiresAt > Date.now()) {
        localStorage.setItem('expiresAt', serverExpiresAt.toString());
        sessionStorage.setItem('expiresAt', serverExpiresAt.toString());
        console.log('Updated token expiry from server:', new Date(serverExpiresAt).toISOString());
      }
    }
    
    return isValid;
  } catch (error) {
    console.error('Token validation error:', error);
    
    // Check if error is 429 (Too Many Requests)
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded (429), backing off token validation');
      isBackingOff = true;
      setTimeout(() => {
        isBackingOff = false;
        validationAttempts = 0;
      }, 60000); // Back off for 1 minute on 429 error
      
      // Don't clear auth state on rate limit errors, just return cached state
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    
    // Clear auth data for other errors
    clearAllAuthData();
    return false;
  }
}

// Reset auth state
function resetAuth() {
  clearAllAuthData();
}

// Rate limiting for initAuth function
let lastInitAuth = 0;
const INIT_AUTH_COOLDOWN = 5000; // 5 seconds between initialization attempts
let initAuthAttempts = 0;
const MAX_INIT_ATTEMPTS = 2; // Maximum attempts before using cached state

// Initialize auth on app start
async function initAuth() {
  const now = Date.now();
  
  // Apply rate limiting to prevent rapid initialization attempts
  if (now - lastInitAuth < INIT_AUTH_COOLDOWN) {
    console.log(`Rate limiting auth initialization (tried ${initAuthAttempts + 1} times in ${now - lastInitAuth}ms)`);
    
    if (++initAuthAttempts >= MAX_INIT_ATTEMPTS) {
      console.log('Too many init attempts, using cached authentication state');
      // Use cached auth state instead of making API calls
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      return { 
        success: isAuthenticated, 
        message: isAuthenticated ? 'Using cached auth state' : 'No active session'
      };
    }
  } else {
    // Reset attempts if enough time has passed
    initAuthAttempts = 0;
  }
  
  // Update timestamp
  lastInitAuth = now;
  
  const localToken = localStorage.getItem('authToken');
  const sessionToken = sessionStorage.getItem('authToken');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Sync between localStorage and sessionStorage if they have different values
  if (localToken && (!sessionToken || sessionToken !== localToken)) {
    console.log('Syncing token from localStorage to sessionStorage');
    sessionStorage.setItem('authToken', localToken);
    sessionStorage.setItem('isAuthenticated', 'true');
    
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      sessionStorage.setItem('expiresAt', expiresAt);
    }
    
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      sessionStorage.setItem('userDetails', userDetails);
    }
  } else if (sessionToken && (!localToken || localToken !== sessionToken)) {
    console.log('Syncing token from sessionStorage to localStorage');
    localStorage.setItem('authToken', sessionToken);
    localStorage.setItem('isAuthenticated', 'true');
    
    const expiresAt = sessionStorage.getItem('expiresAt');
    if (expiresAt) {
      localStorage.setItem('expiresAt', expiresAt);
    }
    
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      localStorage.setItem('userDetails', userDetails);
    }
  }
  
  if (isAuthenticated) {
    // Use token validation with built-in rate limiting
    const isValid = await validateToken();
    if (!isValid) {
      // Don't automatically redirect when rate limited
      if (!isBackingOff) {
        clearAllAuthData();
        window.location.href = '/auth/login?session=invalid';
      }
      return { success: false, message: 'Session expired' };
    }
    return { success: true, message: 'Valid session' };
  }
  
  return { success: false, message: 'No active session' };
}

// Register function
async function register(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Lỗi kết nối máy chủ'
    };
  }
}

// Send OTP to email for verification
async function sendOtp(email) {
  try {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  } catch (error) {
    // Handle rate limit errors specifically
    if (error.response?.status === 429) {
      return {
        success: false,
        message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
      };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Lỗi khi gửi mã OTP, vui lòng thử lại sau.'
    };
  }
}

// Verify OTP code
async function verifyOtp(email, otp) {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    // Handle rate limit errors specifically
    if (error.response?.status === 429) {
      return {
        success: false,
        message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
      };
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.'
    };
  }
}

// Get user profile
async function getProfile() {
  try {
    const response = await api.get('/auth/profile');
    
    if (response.data.success && response.data.data) {
      // Update stored user data with fresh data
      localStorage.setItem('userDetails', JSON.stringify(response.data.data));
      sessionStorage.setItem('userDetails', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('XHR failed loading: GET "/auth/profile"', error);
    
    // Check if we have cached user data
    const userStr = localStorage.getItem('userDetails');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return { 
          success: true, 
          message: 'Using cached profile data',
          data: userData
        };
      } catch (e) {
        console.error('Error parsing cached user data:', e);
      }
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error retrieving profile'
    };
  }
}

// Export all functions
export { 
  api,
  login, 
  logout, 
  validateToken, 
  resetAuth, 
  initAuth,
  register,
  getProfile,
  sendOtp,
  verifyOtp
}; 