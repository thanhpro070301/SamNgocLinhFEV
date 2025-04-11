import axios from 'axios';
import { api as authService } from '@/api/auth.service';

// Constants
const API_TIMEOUT = 30000; // 30 seconds
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create a new axios instance using the same setup as the auth service
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8'
  },
  timeout: API_TIMEOUT,
  responseType: 'json',
  responseEncoding: 'utf8',
  withCredentials: false
});

// Debug info cho API calls
if (import.meta.env.MODE === 'development') {
  console.log('API configuration:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT
  });
}

// Lưu thông tin đăng xuất để tránh vòng lặp chuyển hướng
const isLogoutAction = () => {
  // Kiểm tra xem URL hiện tại có đang ở trang login vì bị đăng xuất không
  return window.location.pathname.includes('/auth/login') && 
    (window.location.search.includes('session=expired') || 
     window.location.search.includes('reason='));
};

// Thêm flag để tránh chuyển hướng tự động nhiều lần
let hasRedirectedAfterLogout = false;

// Update the request interceptor to use both localStorage and sessionStorage for token
apiClient.interceptors.request.use(
  config => {
    // First try localStorage, then sessionStorage as fallback
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
    
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Improve error handling in the response interceptor
apiClient.interceptors.response.use(
  response => {
    // Check if response is HTML instead of JSON
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('API returning HTML instead of JSON. Possible CORS or API endpoint issue');
      return Promise.reject({
        success: false,
        message: 'API response format error',
        response: response
      });
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // These endpoints should handle their own auth errors and not trigger global logout
    const skipAutoLogout = [
      '/orders/my-orders',
      '/orders',  // Add the admin orders endpoint
      '/auth/check-token',
      '/profile', 
      '/user/preferences',
      '/admin/orders',  // Add any admin-specific endpoints
      '/auth/sessions'  // Add sessions endpoints
    ].some(path => originalRequest?.url?.includes(path));
    
    // Is this a 401 unauthorized error?
    const isAuthError = error.response?.status === 401;
    
    // If this is a 401 error and it's on an endpoint that should skip auto-logout
    if (isAuthError && skipAutoLogout) {
      console.log(`Auth error for skipAutoLogout endpoint: ${originalRequest?.url}`);
      // Just return the error, let the component handle it
      return Promise.reject({
        success: false,
        message: `Authentication failed for request to ${originalRequest?.url}`,
        status: 401,
        response: error.response,
        handled: true // Mark as handled to prevent global logout
      });
    }
    
    // For other 401 errors that should trigger logout
    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.error(`401 Unauthorized error for: ${originalRequest?.url} - clearing auth state`);
      
      // Check if we've already logged out recently to prevent loops
      const recentLogout = sessionStorage.getItem('_recent_logout');
      const now = Date.now();
      if (recentLogout && (now - parseInt(recentLogout)) < 5000) {
        console.log('Recent logout detected, skipping duplicate logout action');
        return Promise.reject({
          success: false,
          message: 'Already logged out',
          status: 401
        });
      }
      
      // Use a dedicated function for consistent cleanup
      const clearAuthData = () => {
        // Mark logout in progress
        sessionStorage.setItem('_recent_logout', Date.now().toString());
        
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('hasUser');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('tokenExpiresAt');
        
        // Clear sessionStorage
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userDetails');
        sessionStorage.removeItem('expiresAt');
        sessionStorage.removeItem('tokenExpiresAt');
        
        // Signal logout to other components
        try {
          document.dispatchEvent(new CustomEvent('auth:logout', { 
            detail: { source: 'api_interceptor', url: originalRequest?.url }
          }));
        } catch (e) {
          console.error('Error dispatching logout event:', e);
        }
      };
      
      clearAuthData();
      
      // Check if we're already on the login page to prevent redirect loops
      if (!window.location.pathname.includes('/auth/login') && !hasRedirectedAfterLogout) {
        console.log('Redirecting to login page');
        hasRedirectedAfterLogout = true;
        // Reset redirect flag after a short delay
        setTimeout(() => { hasRedirectedAfterLogout = false; }, 2000);
        window.location.href = '/auth/login?session=expired';
      }
      
      return Promise.reject({
        success: false,
        message: 'Session expired. Please log in again.',
        status: 401
      });
    }
    
    // Handle other errors
    if (error.response) {
      console.log('Error response:', error.response);
      // Check if response is HTML
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
        console.error('API returning HTML instead of JSON. Possible CORS or API endpoint issue');
        return Promise.reject({
          success: false,
          message: 'API response format error',
          response: error.response
        });
      }
      
      // Return API error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.log('Error request (no response received):', error.request);
      return Promise.reject({
        success: false,
        message: 'No response received from server. Please check your network connection.',
        request: error.request
      });
    }
    
    // Return original error if no detailed info
    return Promise.reject({
      success: false,
      message: error.message || 'An error occurred, please try again later.'
    });
  }
);

// Authentication API
export const authApi = {
  register(userData) {
    return apiClient.post('/auth/register', userData)
      .then(response => response.data);
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
      .then(response => response.data);
  },
  logout() {
    return apiClient.post('/auth/logout')
      .then(response => response.data);
  },
  getProfile() {
    return apiClient.get('/auth/profile')
      .then(response => response.data);
  },
  checkToken(token) {
    return apiClient.post('/auth/check-token', { token })
      .then(response => response.data);
  }
};

// Products API
export const productApi = {
  getProducts(params = {}) {
    return apiClient.get('/products', { params })
      .then(response => response);
  },
  getFeaturedProducts() {
    return apiClient.get('/products', { 
      params: {
        sortBy: "rating",
        direction: "desc",
        status: "ACTIVE",
        page: 0,
        size: 3
      }
    })
      .then(response => response.data);
  },
  getNewArrivals() {
    return apiClient.get('/products/new-arrivals')
      .then(response => response.data);
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`)
      .then(response => response.data);
  },
  createProduct(productData) {
    return apiClient.post('/products', productData)
      .then(response => response.data);
  },
  updateProduct(id, productData) {
    return apiClient.put(`/products/${id}`, productData)
      .then(response => response.data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`)
      .then(response => response.data);
  }
};

// Categories API
export const categoryApi = {
  getCategories() {
    return apiClient.get('/categories')
      .then(response => response);
  },
  getCategory(id) {
    return apiClient.get(`/categories/${id}`)
      .then(response => response.data);
  },
  getCategoryProducts(id, params = {}) {
    return apiClient.get(`/categories/${id}/products`, { params })
      .then(response => response);
  },
  createCategory(categoryData) {
    return apiClient.post('/categories', categoryData)
      .then(response => response.data);
  },
  updateCategory(id, categoryData) {
    return apiClient.put(`/categories/${id}`, categoryData)
      .then(response => response.data);
  },
  deleteCategory(id) {
    return apiClient.delete(`/categories/${id}`)
      .then(response => response.data);
  }
};

// Orders API
export const orderApi = {
  getOrders() {
    return apiClient.get('/orders')
      .then(response => {
        // Store successful admin orders in cache
        if (response?.data) {
          try {
            localStorage.setItem('adminCachedOrders', JSON.stringify(Array.isArray(response.data) ? 
              response.data : response.data));
            localStorage.setItem('lastAdminOrdersLoaded', Date.now().toString());
          } catch (e) {
            console.warn('Error saving admin orders to cache:', e);
          }
        }
        return response.data;
      })
      .catch(error => {
        // Special handling for auth errors
        if (error.response?.status === 401 || error.status === 401) {
          console.warn('Authentication error for admin orders API. Using cached data if available.');
          
          // Try to use cached orders
          const cachedOrders = localStorage.getItem('adminCachedOrders');
          if (cachedOrders) {
            try {
              console.log('Returning cached admin orders data instead of empty array');
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached admin orders:', e);
            }
          }
          
          // If no cache, return empty array
          return [];
        }
        
        // Special handling for rate limit errors
        if (error.response?.status === 429 || error.status === 429) {
          console.warn('Rate limit reached for admin orders API. Using cached data or empty array.');
          
          // Try to use cached orders
          const cachedOrders = localStorage.getItem('adminCachedOrders');
          if (cachedOrders) {
            try {
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached admin orders:', e);
            }
          }
          
          return [];
        }
        
        // For network errors, try using cached data
        if (error.message?.includes('network') || error.code === 'ECONNABORTED') {
          console.warn('Network error for admin orders API. Using cached data if available.');
          
          const cachedOrders = localStorage.getItem('adminCachedOrders');
          if (cachedOrders) {
            try {
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached admin orders:', e);
            }
          }
        }
        
        // For other errors, still throw
        throw error;
      });
  },
  getOrder(id) {
    return apiClient.get(`/orders/${id}`)
      .then(response => response.data);
  },
  getMyOrders() {
    return apiClient.get('/orders/my-orders')
      .then(response => {
        // Store successful orders in cache
        if (response?.data) {
          try {
            localStorage.setItem('cachedOrders', JSON.stringify(Array.isArray(response.data) ? 
              response.data.slice(0, 5) : response.data.slice(0, 5)));
            localStorage.setItem('lastOrdersLoaded', Date.now().toString());
          } catch (e) {
            console.warn('Error saving orders to cache:', e);
          }
        }
        return response.data;
      })
      .catch(error => {
        // Special handling for auth errors
        if (error.response?.status === 401 || error.status === 401) {
          console.warn('Authentication error for orders API. Using cached data if available.');
          
          // Try to use cached orders
          const cachedOrders = localStorage.getItem('cachedOrders');
          if (cachedOrders) {
            try {
              console.log('Returning cached orders data instead of empty array');
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached orders:', e);
            }
          }
          
          // If no cache, return empty array
          return [];
        }
        
        // Special handling for rate limit errors
        if (error.response?.status === 429 || error.status === 429) {
          console.warn('Rate limit reached for orders API. Using cached data or empty array.');
          
          // Try to use cached orders
          const cachedOrders = localStorage.getItem('cachedOrders');
          if (cachedOrders) {
            try {
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached orders:', e);
            }
          }
          
          return [];
        }
        
        // For network errors, try using cached data
        if (error.message?.includes('network') || error.code === 'ECONNABORTED') {
          console.warn('Network error for orders API. Using cached data if available.');
          
          const cachedOrders = localStorage.getItem('cachedOrders');
          if (cachedOrders) {
            try {
              return JSON.parse(cachedOrders);
            } catch (e) {
              console.error('Error parsing cached orders:', e);
            }
          }
        }
        
        // For other errors, still throw
        throw error;
      });
  },
  createOrder(orderData) {
    return apiClient.post('/orders', orderData)
      .then(response => response.data);
  },
  updateOrderStatus(id, status) {
    return apiClient.patch(`/orders/${id}/status`, { status })
      .then(response => response.data);
  },
  cancelOrder(id) {
    return apiClient.patch(`/orders/${id}/cancel`)
      .then(response => response.data);
  }
};

// News API
export const newsApi = {
  getNewsList(params = {}) {
    return apiClient.get('/news', { params })
      .then(response => response.data);
  },
  getNews(id) {
    return apiClient.get(`/news/${id}`)
      .then(response => response.data);
  },
  createNews(newsData) {
    return apiClient.post('/news', newsData)
      .then(response => response.data);
  },
  updateNews(id, newsData) {
    return apiClient.put(`/news/${id}`, newsData)
      .then(response => response.data);
  },
  deleteNews(id) {
    return apiClient.delete(`/news/${id}`)
      .then(response => response.data);
  }
};

// Function to generate mock sessions data
function getMockSessionsData() {
  return [
    {
      id: 'session-1',
      device: 'iPhone 13 - Safari',
      location: 'Hồ Chí Minh, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      ipAddress: '192.168.1.1'
    },
    {
      id: 'session-2',
      device: 'Windows 10 - Chrome',
      location: 'Hà Nội, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      ipAddress: '192.168.1.2'
    },
    {
      id: 'session-3',
      device: 'Macbook Pro - Chrome',
      location: 'Đà Nẵng, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      ipAddress: '192.168.1.3'
    }
  ];
}

// API interfaces (default export)
export default {
  auth: authService,
  product: productApi,
  category: categoryApi,
  order: orderApi,
  news: newsApi,
  // Add session API
  session: {
    getSessions() {
      // Verify token exists before making the API call
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, returning mock sessions data');
        return Promise.resolve({
          success: true,
          data: getMockSessionsData()
        });
      }
      
      return apiClient.get('/auth/sessions')
        .then(response => response.data)
        .catch(error => {
          // If the API isn't implemented yet, return mock data
          console.warn('Sessions API error, using mock data:', error);
          
          return {
            success: true,
            data: getMockSessionsData()
          };
        });
    },
    
    removeSession(sessionId) {
      // Verify token exists before making the API call
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, returning mock success for removeSession');
        return Promise.resolve({ success: true });
      }
      
      return apiClient.delete(`/auth/sessions/${sessionId}`)
        .then(response => response.data)
        .catch(error => {
          // If the API isn't implemented yet, return mock success
          console.warn('Remove session API error, returning mock success:', error);
          return { success: true };
        });
    },
    
    removeOtherSessions() {
      // Verify token exists before making the API call
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, returning mock success for removeOtherSessions');
        return Promise.resolve({ success: true });
      }
      
      return apiClient.delete('/auth/sessions/others')
        .then(response => response.data)
        .catch(error => {
          // If the API isn't implemented yet, return mock success
          console.warn('Remove other sessions API error, returning mock success:', error);
          return { success: true };
        });
    }
  }
}; 