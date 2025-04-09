import axios from 'axios';
import sessionToken from '@/store/sessionToken';

// Constants
const API_TIMEOUT = 30000; // 30 seconds

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Biến để theo dõi yêu cầu refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm đăng ký các hàm callback khi refresh token thành công
const subscribeTokenRefresh = (callback) => refreshSubscribers.push(callback);

// Hàm thông báo cho tất cả subscriber khi refresh token thành công
const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Interceptor thêm token vào header nếu có
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = sessionToken.currentToken.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Thêm CSRF token nếu có
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
    } catch (error) {
      console.error('Error setting headers:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor kiểm tra response
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error.config;
      
      // Nếu lỗi là 401 và chưa thử refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Nếu đang refresh, đăng ký callback để thử lại khi refresh xong
          return new Promise(resolve => {
            subscribeTokenRefresh(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        // Đánh dấu là đang refresh và đã thử refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Thử refresh token
          const refreshToken = sessionToken.refreshToken.value;
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await apiClient.post('/auth/refresh-token', { refreshToken });
          
          if (response.data?.success && response.data?.data?.token) {
            const newToken = response.data.data.token;
            const newRefreshToken = response.data.data.refreshToken;
            
            // Cập nhật token trong session
            sessionToken.currentToken.value = newToken;
            sessionToken.refreshToken.value = newRefreshToken;
            sessionToken.saveState();
            
            // Thông báo cho các request đang chờ
            onRefreshed(newToken);
            
            // Cập nhật token cho request hiện tại và thử lại
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } else {
            // Refresh token thất bại, đăng xuất
            sessionToken.resetAll();
            window.location.href = '/admin/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Lỗi khi refresh token, đăng xuất
          sessionToken.resetAll();
          window.location.href = '/admin/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Xử lý lỗi khác
      if (error.response && error.response.data) {
        // Trả về lỗi từ API
        return Promise.reject(error.response.data);
      }
      
      // Trả về lỗi gốc nếu không có thông tin chi tiết
      return Promise.reject({
        success: false,
        message: error.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.'
      });
    } catch (err) {
      console.error('Error in response interceptor:', err);
      return Promise.reject(error);
    }
  }
);

// API authentication
export const authApi = {
  register(userData) {
    return apiClient.post('/auth/register', userData)
      .then(response => response.data);
  },
  sendOtp(email) {
    return apiClient.post('/auth/send-otp', { email })
      .then(response => response.data);
  },
  verifyOtp(email, otp) {
    return apiClient.post('/auth/verify-otp', { email, otp })
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
  refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh-token', { refreshToken })
      .then(response => response.data);
  }
};

// API users
export const userApi = {
  getUsers() {
    return apiClient.get('/users')
      .then(response => response.data);
  },
  getUser(id) {
    return apiClient.get(`/users/${id}`)
      .then(response => response.data);
  },
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
      .then(response => response.data);
  }
};

// API sessions
export const sessionApi = {
  getSessions() {
    return apiClient.get('/account/sessions')
      .then(response => response.data);
  },
  removeSession(sessionId) {
    return apiClient.delete(`/account/sessions/${sessionId}`)
      .then(response => response.data);
  },
  removeOtherSessions() {
    return apiClient.delete('/account/sessions/other-devices')
      .then(response => response.data);
  },
  removeAllSessions() {
    return apiClient.delete('/account/sessions/all')
      .then(response => response.data);
  }
};

// API products
export const productApi = {
  getProducts(params = {}) {
    return apiClient.get('/products', { params })
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

// API categories
export const categoryApi = {
  getCategories() {
    return apiClient.get('/categories')
      .then(response => response.data);
  },
  getCategory(id) {
    return apiClient.get(`/categories/${id}`)
      .then(response => response.data);
  },
  getCategoryProducts(id, params = {}) {
    return apiClient.get(`/categories/${id}/products`, { params })
      .then(response => response.data);
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

// API orders
export const orderApi = {
  getOrders() {
    return apiClient.get('/orders')
      .then(response => response.data);
  },
  getOrder(id) {
    return apiClient.get(`/orders/${id}`)
      .then(response => response.data);
  },
  getMyOrders() {
    return apiClient.get('/orders/my-orders')
      .then(response => response.data);
  },
  createOrder(orderData) {
    return apiClient.post('/orders', orderData)
      .then(response => response.data);
  },
  updateOrderStatus(id, status) {
    return apiClient.put(`/orders/${id}/status`, null, { params: { status } })
      .then(response => response.data);
  },
  updatePaymentStatus(id, paymentStatus) {
    return apiClient.put(`/orders/${id}/payment`, null, { params: { paymentStatus } })
      .then(response => response.data);
  },
  cancelOrder(id) {
    return apiClient.post(`/orders/${id}/cancel`)
      .then(response => response.data);
  },
  checkOrderStatus(id) {
    return apiClient.get(`/orders/public/${id}`)
      .then(response => response.data);
  }
};

// API news
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

export default {
  auth: authApi,
  user: userApi,
  session: sessionApi,
  product: productApi,
  category: categoryApi,
  order: orderApi,
  news: newsApi
}; 