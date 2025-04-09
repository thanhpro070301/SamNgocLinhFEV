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
import Login from '@/views/admin/Login.vue'
import Register from '@/views/admin/Register.vue'
import VerifyOtp from '@/views/admin/VerifyOtp.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import AdminProducts from '@/views/admin/Products.vue'
import AdminServices from '@/views/admin/Services.vue'
import Users from '@/views/admin/Users.vue'
import AdminNews from '@/views/admin/News.vue'
import Categories from '@/views/admin/Categories.vue'
import Orders from '@/views/admin/Orders.vue'
import Sessions from '@/views/admin/Sessions.vue'
import ApiConfig from '@/views/admin/ApiConfig.vue'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'

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
    meta: { requiresAuth: false }
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
    path: '/admin/login',
    name: 'AdminLogin',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin/verify-otp',
    name: 'VerifyOtp',
    component: VerifyOtp,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/services',
    name: 'AdminServices',
    component: AdminServices,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: Categories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/news',
    name: 'AdminNews',
    component: AdminNews,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: Orders,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/sessions',
    name: 'AdminSessions',
    component: Sessions,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/api-config',
    name: 'AdminApiConfig',
    component: ApiConfig,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Luôn cuộn lên đầu trang khi chuyển route
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Cập nhật hoạt động khi chuyển trang nếu đã đăng nhập
  if (auth.isAuthenticated.value) {
    auth.updateActivity()
  }
  
  // Kiểm tra nếu route yêu cầu xác thực
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Kiểm tra token
    const token = localStorage.getItem('admin_current_token')
    
    if (!token) {
      // Không có token, chuyển hướng đến trang đăng nhập
      next({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // Có token, cho phép truy cập
      next()
    }
  } else {
    // Route không yêu cầu xác thực
    next()
  }
})

// Cập nhật meta cho các route admin để yêu cầu xác thực
const adminRoutes = router.getRoutes().filter(route => 
  route.path.startsWith('/admin') && 
  !route.path.includes('/login') && 
  !route.path.includes('/register')
)

adminRoutes.forEach(route => {
  route.meta.requiresAuth = true
})

export default router 