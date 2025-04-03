import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Products from '../views/admin/Products.vue'
import Users from '../views/admin/Users.vue'
import Services from '../views/admin/Services.vue'
import News from '../views/admin/News.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/admin',
    name: 'admin',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/admin/DashboardHome.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: Products
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'services',
        name: 'services',
        component: Services
      },
      {
        path: 'news',
        name: 'news',
        component: News
      }
    ]
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/views/Services.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 