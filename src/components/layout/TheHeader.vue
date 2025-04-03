<template>
  <header class="header">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between py-4">
        <router-link to="/" class="logo flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-full overflow-hidden flex-shrink-0 mr-2">
            <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
          </div>
          <span class="text-xl font-bold text-green-700">Sâm Ngọc Linh</span>
        </router-link>
        
        <div class="nav-links hidden md:flex space-x-6">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="nav-link hover:text-green-600 transition-colors"
            :class="{ 'text-green-600 font-bold': isActive(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Cart Icon -->
          <router-link to="/cart" class="relative">
            <i class="fas fa-shopping-cart text-xl hover:text-green-600 transition-colors"></i>
            <span 
              v-if="cartItemCount > 0" 
              class="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
            >
              {{ cartItemCount > 99 ? '99+' : cartItemCount }}
            </span>
          </router-link>
          
          <button 
            class="mobile-menu-btn md:hidden"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span class="sr-only">Menu</span>
            <i class="fas fa-bars"></i>
          </button>
        </div>
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
          class="block py-2 hover:text-green-600 transition-colors"
          :class="{ 'text-green-600 font-bold': isActive(item.path) }"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import cart from '@/store/cart'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const route = useRoute()
const isMenuOpen = ref(false)

const cartItemCount = computed(() => cart.cartItemCount.value)

const isActive = (path) => {
  if (path === '/') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

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
  
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background-color: #059669;
    transition: width 0.3s ease;
    margin-top: 2px;
  }
  
  &.text-green-600::after {
    width: 100%;
  }
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