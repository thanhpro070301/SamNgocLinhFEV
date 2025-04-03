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
import Dashboard from '@/views/admin/Dashboard.vue'
import AdminProducts from '@/views/admin/Products.vue'
import AdminServices from '@/views/admin/Services.vue'
import Users from '@/views/admin/Users.vue'
import AdminNews from '@/views/admin/News.vue'
import auth from '@/store/auth'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Luôn cuộn lên đầu trang khi chuyển route
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Kiểm tra xem route yêu cầu đăng nhập không
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  // Kiểm tra xác thực hiện tại
  const isAuthenticated = auth.isAuthenticated.value
  const isAdmin = auth.isAdmin.value
  
  // Nếu route yêu cầu đăng nhập nhưng chưa đăng nhập
  if (requiresAuth && !isAuthenticated) {
    next({ path: '/admin/login' })
  } 
  // Nếu route yêu cầu quyền admin nhưng không phải admin
  else if (requiresAdmin && !isAdmin) {
    next({ path: '/admin/login' })
  }
  // Nếu route chỉ dành cho khách (như trang đăng nhập) nhưng đã đăng nhập
  else if (requiresGuest && isAuthenticated) {
    next({ path: '/admin/dashboard' })
  }
  // Các trường hợp khác, cho phép tiếp tục
  else {
    next()
  }
})

export default router 