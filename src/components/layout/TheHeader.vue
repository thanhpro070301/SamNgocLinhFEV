<template>
  <header class="header">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between py-4">
        <router-link to="/" class="logo">
          <img src="https://via.placeholder.com/150x50" alt="Sâm Ngọc Linh" class="h-12">
        </router-link>
        
        <div class="nav-links hidden md:flex space-x-6">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="nav-link hover:text-green-600"
          >
            {{ item.name }}
          </router-link>
        </div>

        <button 
          class="mobile-menu-btn md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="sr-only">Menu</span>
          <i class="fas fa-bars"></i>
        </button>
      </nav>

      <!-- Mobile menu -->
      <div 
        v-show="isMenuOpen" 
        class="mobile-menu md:hidden"
      >
        <router-link 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="block py-2 hover:text-green-600"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const menuItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Sản phẩm', path: '/products' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Dịch vụ', path: '/services' },
  { name: 'Tin tức', path: '/news' },
  { name: 'Liên hệ', path: '/contact' }
]
</script>

<style lang="scss" scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.mobile-menu-btn {
  padding: 0.5rem;
  font-size: 1.5rem;
}

.mobile-menu {
  padding: 1rem 0;
  border-top: 1px solid #eee;
}
</style> 