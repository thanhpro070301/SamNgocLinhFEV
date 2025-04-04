// Thêm route cho trang quản lý phiên đăng nhập
import Sessions from '@/views/admin/Sessions.vue'

const adminRoutes = [
  // ... Các routes khác giữ nguyên
  
  // Route Sessions - thêm vào
  {
    path: '/admin/sessions',
    name: 'AdminSessions',
    component: Sessions,
    meta: {
      requiresAuth: true,
      adminOnly: true
    }
  },
  
  // ... Các routes khác giữ nguyên
] 