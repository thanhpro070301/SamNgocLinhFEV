import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: '/api', // Use relative URL with Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Interceptor thêm token vào header nếu có
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('admin_current_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error setting Authorization header:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor kiểm tra response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      // Nếu token hết hạn (401 Unauthorized), tự động logout
      if (error.response && error.response.status === 401) {
        // Import không thể đặt ở đầu file vì sẽ gây lỗi circular dependency
        const auth = require('@/store/auth').default;
        auth.logout(false);
        window.location.href = '/admin/login';
      }
    } catch (err) {
      console.error('Error in response interceptor:', err);
    }
    return Promise.reject(error);
  }
);

// API authentication
export const authApi = {
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },
  sendOtp(email) {
    return apiClient.post('/auth/send-otp', email);
  },
  verifyOtp(email, otp) {
    return apiClient.post('/auth/verify-otp', null, { params: { email, otp } });
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  logout() {
    return apiClient.post('/auth/logout');
  }
};

// API users
export const userApi = {
  getUsers() {
    return apiClient.get('/users');
  },
  getUser(id) {
    return apiClient.get(`/users/${id}`);
  },
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData);
  }
};

// API sessions
export const sessionApi = {
  getSessions() {
    return apiClient.get('/account/sessions');
  },
  removeSession(sessionId) {
    return apiClient.delete(`/account/sessions/${sessionId}`);
  },
  removeOtherSessions() {
    return apiClient.delete('/account/sessions/other-devices');
  },
  removeAllSessions() {
    return apiClient.delete('/account/sessions/all');
  }
};

// API products
export const productApi = {
  getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },
  getProduct(id) {
    return apiClient.get(`/products/${id}`);
  },
  createProduct(productData) {
    return apiClient.post('/products', productData);
  },
  updateProduct(id, productData) {
    return apiClient.put(`/products/${id}`, productData);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  }
};

// API categories
export const categoryApi = {
  getCategories() {
    return apiClient.get('/categories');
  },
  getCategory(id) {
    return apiClient.get(`/categories/${id}`);
  },
  getCategoryProducts(id, params = {}) {
    return apiClient.get(`/categories/${id}/products`, { params });
  },
  createCategory(categoryData) {
    return apiClient.post('/categories', categoryData);
  },
  updateCategory(id, categoryData) {
    return apiClient.put(`/categories/${id}`, categoryData);
  },
  deleteCategory(id) {
    return apiClient.delete(`/categories/${id}`);
  }
};

// API orders
export const orderApi = {
  getOrders() {
    return apiClient.get('/orders');
  },
  getOrder(id) {
    return apiClient.get(`/orders/${id}`);
  },
  getMyOrders() {
    return apiClient.get('/orders/my-orders');
  },
  createOrder(orderData) {
    return apiClient.post('/orders', orderData);
  },
  updateOrderStatus(id, status) {
    return apiClient.put(`/orders/${id}/status`, null, { params: { status } });
  },
  updatePaymentStatus(id, paymentStatus) {
    return apiClient.put(`/orders/${id}/payment`, null, { params: { paymentStatus } });
  },
  cancelOrder(id) {
    return apiClient.post(`/orders/${id}/cancel`);
  },
  checkOrderStatus(id) {
    return apiClient.get(`/orders/public/${id}`);
  }
};

// API news
export const newsApi = {
  getNewsList(params = {}) {
    return apiClient.get('/news', { params });
  },
  getNews(id) {
    return apiClient.get(`/news/${id}`);
  },
  createNews(newsData) {
    return apiClient.post('/news', newsData);
  },
  updateNews(id, newsData) {
    return apiClient.put(`/news/${id}`, newsData);
  },
  deleteNews(id) {
    return apiClient.delete(`/news/${id}`);
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