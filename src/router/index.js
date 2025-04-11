import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import Products from '@/views/Products.vue'
import About from '@/views/About.vue'
import Services from '@/views/Services.vue'
import News from '@/views/News.vue'
import Contact from '@/views/Contact.vue'
import OrderTracking from '@/views/OrderTracking.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import BlogDetail from '@/views/BlogDetail.vue'
import NotFound from '@/views/NotFound.vue'
import AuthTester from '@/components/AuthTester.vue'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'
import { clearAllAuthData } from '@/utils/clearAuth'
import { validateToken } from '@/api/auth.service'

// Giả định rằng ForgotPassword component sẽ được tạo sau
const ForgotPassword = { template: '<div>Trang khôi phục mật khẩu sẽ được triển khai sau</div>' }

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: false }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: false }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: false }
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
    meta: { requiresAuth: false }
  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: { requiresAuth: false }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: false }
  },
  {
    path: '/order-tracking',
    name: 'OrderTracking',
    component: OrderTracking,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth-test',
    name: 'AuthTester',
    component: AuthTester,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('@/views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'UserOrders',
    component: () => import('@/views/auth/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/Products.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'services',
        name: 'AdminServices',
        component: () => import('@/views/admin/Services.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/Categories.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'news',
        name: 'AdminNews',
        component: () => import('@/views/admin/News.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'sessions',
        name: 'AdminSessions',
        component: () => import('@/views/admin/Sessions.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'api-config',
        name: 'AdminApiConfig',
        component: () => import('@/views/admin/ApiConfig.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'auth-debug',
        name: 'AuthDebugger',
        component: () => import('@/views/admin/AuthDebugger.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Token validation state để tránh kiểm tra quá nhiều lần
let lastValidationTime = 0;
let lastValidationResult = null;
const VALIDATION_CACHE_DURATION = 30000; // 30 seconds

// Kiểm tra token dựa trên localStorage và sessionStorage
async function isAuthenticated() {
  // Check for stored auth state first - fast path
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt') || 
                 sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt');
  const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true' || 
                    sessionStorage.getItem('isAuthenticated') === 'true';
  
  // Debug specific issue - if token exists but isAuthenticated flag is false
  if (token && !isAuthFlag) {
    console.warn('Token exists but isAuthenticated flag is false - fixing inconsistency');
    localStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('isAuthenticated', 'true');
  }
  
  if (!token) {
    console.log('No token found - not authenticated');
    return false;
  }
  
  // Kiểm tra thời hạn token (client-side)
  if (expiresAt) {
    const now = Date.now();
    const expiry = parseInt(expiresAt, 10);
    if (!isNaN(expiry) && now >= expiry) {
      console.log('Token expired according to client-side data');
      return false;
    }
  }
  
  // Use cached validation result if fresh enough
  const now = Date.now();
  if (lastValidationResult !== null && now - lastValidationTime < VALIDATION_CACHE_DURATION) {
    console.log(`Using cached auth result (${Math.round((now - lastValidationTime)/1000)}s old): ${lastValidationResult ? 'authenticated' : 'not authenticated'}`);
    return lastValidationResult;
  }
  
  // Only make API call if necessary
  try {
    // Use simple presence check first to avoid API call
    if (token && isAuthFlag && expiresAt) {
      const expiry = parseInt(expiresAt, 10);
      // If token isn't expired and we have a valid lastValidationResult, return that
      if (!isNaN(expiry) && now < expiry) {
        console.log('Token looks valid client-side, setting cached result to true');
        lastValidationTime = now;
        lastValidationResult = true;
        return true;
      }
    }
    
    // Only validate with API when necessary
    console.log('Validating token with API call');
    const isValid = await validateToken();
    
    // Lưu kết quả để tránh kiểm tra lại quá nhanh
    lastValidationTime = now;
    lastValidationResult = isValid;
    
    return isValid;
  } catch (error) {
    console.error('Error validating token:', error);
    // On error, only cache negative results briefly
    lastValidationTime = now;
    lastValidationResult = false;
    return false;
  }
}

// Router navigation guard
router.beforeEach(async (to, from, next) => {
  // Đánh dấu thời gian bắt đầu để đo thời gian xử lý
  const startTime = Date.now();
  console.log(`Navigation guard started for ${to.path} from ${from.path}`);

  // Kiểm tra và ngăn chặn vòng lặp chuyển hướng
  const isLoginRedirect = from.path === '/profile' && to.path === '/auth/login';
  const isProfileRedirect = from.path === '/auth/login' && to.path === '/profile';
  
  if ((isLoginRedirect || isProfileRedirect) && sessionStorage.getItem('redirect_count')) {
    const redirectCount = parseInt(sessionStorage.getItem('redirect_count'));
    
    if (redirectCount > 5) {
      console.warn('Detected redirect loop between profile and login, breaking the loop');
      // Reset redirect counter
      sessionStorage.removeItem('redirect_count');
      
      // Force clear all auth data
      clearAllAuthData({
        notifyOtherTabs: true,
        forceClean: true
      });
      
      // Reset auth store
      const authStore = useAuthStore();
      authStore.isAuthenticated = false;
      authStore.user = null;
      
      next({
        path: '/auth/login',
        query: { reason: 'loop_broken', t: Date.now() }
      });
      return;
    } else {
      // Increment redirect count
      sessionStorage.setItem('redirect_count', (redirectCount + 1).toString());
    }
  } else if (isLoginRedirect || isProfileRedirect) {
    // Start counting redirects
    sessionStorage.setItem('redirect_count', '1');
  }

  // Tải Pinia store để sử dụng
  const authStore = useAuthStore();

  // Skip authentication check for login/register pages
  if (to.path === '/auth/login' || to.path === '/auth/register' || to.path === '/auth/forgot-password') {
    // // Get token directly from storage for faster check - REMOVED, rely on store
    // const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    // const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true' || 
    //                   sessionStorage.getItem('isAuthenticated') === 'true';
    
    // If user is already authenticated (check store state), redirect them away from auth pages
    if (authStore.isAuthenticated && !to.query.force && !to.query.logout) {
      // Kiểm tra nếu mới đăng xuất thì không tự động chuyển hướng
      const recentLogout = sessionStorage.getItem('_recent_logout');
      const isRecentlyLoggedOut = recentLogout && (Date.now() - parseInt(recentLogout)) < 5000; // 5 giây
      
      // Kiểm tra nếu URL có query param liên quan đến session expired
      const hasSessionRelatedParams = to.query.session || to.query.reason;
      
      if (!isRecentlyLoggedOut && !hasSessionRelatedParams) {
        console.log('User is authenticated (store), redirecting away from auth pages');
        const redirectPath = to.query.redirect || '/profile';
        next(redirectPath);
        return;
      } else {
        console.log('Recently logged out or has session params, allowing access to auth page');
        // Xóa dấu hiệu đăng xuất để lần sau hoạt động bình thường
        sessionStorage.removeItem('_recent_logout');
      }
    }
    
    // Continue to auth page
    console.log('Proceeding to guest route:', to.path);
    next();
    return;
  }
  
  // // Đồng bộ localStorage và sessionStorage để đảm bảo nhất quán - REMOVED, handled by store
  // const localToken = localStorage.getItem('authToken');
  // const sessionToken = sessionStorage.getItem('authToken');
  // const localAuth = localStorage.getItem('isAuthenticated');
  // const sessionAuth = sessionStorage.getItem('isAuthenticated');
  
  // // Đồng bộ token giữa hai storage nếu không khớp
  // if (localToken && !sessionToken) {
  //   sessionStorage.setItem('authToken', localToken);
  //   sessionStorage.setItem('isAuthenticated', localAuth || 'true');
  // } else if (sessionToken && !localToken) {
  //   localStorage.setItem('authToken', sessionToken);
  //   localStorage.setItem('isAuthenticated', sessionAuth || 'true');
  // }
  
  // // Quick client-side check before making API call - REMOVED, rely on store
  // const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  // const isAuthFlag = localStorage.getItem('isAuthenticated') === 'true' || 
  //                   sessionStorage.getItem('isAuthenticated') === 'true';
  // const expiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt') || 
  //                 sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt');
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // // Quick check if token exists and isn't expired (client-side only) - REMOVED
    // let quickAuthCheck = false;
    // 
    // if (token && isAuthFlag && expiresAt) {
    //   const now = Date.now();
    //   const expiry = parseInt(expiresAt, 10);
    //   quickAuthCheck = !isNaN(expiry) && now < expiry;
    // }
    // 
    // // If quick check fails, do full authentication check - REMOVED
    // const authenticated = quickAuthCheck || await isAuthenticated();
    
    // Check authentication state directly from the Pinia store
    const authenticated = authStore.isAuthenticated;
    console.log(`Authentication check for ${to.path} (from store): ${authenticated}`);
    
    if (!authenticated) {
      console.log(`Access denied to ${to.path} - not authenticated (store). Redirecting to login.`);
      
      // Clear auth data using the store action (which calls clearAllAuthData)
      // No need to await here, just trigger the action
      authStore.logout(false); // Use false to prevent double redirect
      
      // Redirect to login with redirect URL
      next({
        path: '/auth/login',
        query: { 
          redirect: to.fullPath,
          reason: 'requires_auth' // Changed reason for clarity
        }
      });
      return;
    }
    
    // If route requires admin role
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      // Check admin role directly from the store
      const isAdmin = authStore.isAdmin;
      
      if (!isAdmin) {
        console.log('Access denied - requires admin role (store). Redirecting to profile.');
        next({ path: '/profile' }); // Redirect non-admins to profile
        return;
      }
    }
  } else if (to.matched.some(record => record.meta.requiresGuest) && authStore.isAuthenticated) {
    // If route requires guest but user is authenticated (check store), redirect to profile
    console.log('Authenticated user (store) tried to access guest route, redirecting to profile');
    next({ path: '/profile' });
    return;
  }
  
  // Cập nhật thời gian chuyển trang
  const processingTime = Date.now() - startTime;
  console.log(`Navigation guard for ${to.path} finished in ${processingTime}ms. Proceeding.`);
  
  next();
})

export default router 