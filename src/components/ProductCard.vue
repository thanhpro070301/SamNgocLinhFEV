<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative h-full">
    <!-- Badge giảm giá -->
    <div v-if="hasDiscount" class="absolute left-0 top-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-r-full shadow-md">
      -{{ discountPercent }}%
    </div>
    
    <div class="h-full flex flex-col">
      <div class="h-48 overflow-hidden group">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      
      <div class="p-4 flex-grow flex flex-col">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600">
          <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
        </h3>
        
        <!-- Star rating -->
        <div class="flex items-center mb-3">
          <div class="flex">
            <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
          </div>
          <span class="text-sm text-gray-500 ml-1">
            <span v-if="product.sold">{{ product.sold }} đã bán</span>
            <span v-else>Chưa có đánh giá</span>
          </span>
        </div>
        
        <!-- Mô tả ngắn -->
        <p v-if="product.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ product.description }}
        </p>
        
        <div class="mt-auto">
          <div v-if="product.stock > 0" class="flex items-baseline mb-4">
            <span class="text-xl font-bold text-green-600">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through ml-2">
              {{ formatPrice(product.originalPrice) }}
            </span>
          </div>
          
          <div class="product-actions">
            <div v-if="product.stock > 0" class="button-container">
              <button 
                @click="addToCartAction"
                class="btn-cart"
              >
                <span class="icon"><i class="fas fa-cart-plus"></i></span>
                <span class="label">Thêm vào giỏ</span>
              </button>
              <button 
                @click="navigateToProduct"
                class="btn-buy"
              >
                <span class="icon"><i class="fas fa-shopping-bag"></i></span>
                <span class="label">Mua ngay</span>
              </button>
            </div>
            <div v-else>
              <div class="text-center text-red-500 text-sm mb-2">
                <i class="fas fa-exclamation-circle mr-1"></i> Hết hàng
              </div>
              <button 
                @click="contactUs"
                class="btn-contact w-full"
              >
                <span class="icon"><i class="fas fa-phone"></i></span>
                <span class="label">Liên hệ đặt hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import cart from '@/store/cart'

const router = useRouter()
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['add-to-cart'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
}

const hasDiscount = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > props.product.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const discount = ((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100
  return Math.round(discount)
})

const navigateToProduct = () => {
  if (props.product.stock > 0) {
    router.push(`/product/${props.product.id}`)
  }
}

const addToCartAction = (event) => {
  event.stopPropagation(); // Prevent event bubbling
  if (props.product.stock > 0) {
    cart.addToCart(props.product, 1)
    emits('add-to-cart', props.product)
  }
}

const contactUs = () => {
  // Có thể chuyển người dùng đến trang liên hệ hoặc hiển thị thông tin liên hệ
  router.push('/contact')
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-actions {
  margin-top: auto;
}

.button-container {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 8px;
}

.btn-cart, .btn-buy {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: $border-radius-sm;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 36px;
  font-size: 13px;
  text-transform: none;
}

.btn-cart {
  background-color: #f0fdf4;
  color: $primary-color;
  border: 1px solid #dcfce7;
}

.btn-buy {
  background-color: $primary-color;
  color: $white;
  box-shadow: 0 4px 6px rgba(22, 163, 74, 0.15);
}

.btn-cart:hover {
  background-color: #dcfce7;
  transform: translateY(-2px);
}

.btn-buy:hover {
  background-color: $primary-dark;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(22, 163, 74, 0.2);
}

.btn-cart:active, .btn-buy:active {
  transform: translateY(0);
}

.btn-cart:disabled, .btn-buy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.icon {
  margin-right: 4px;
  font-size: 12px;
}

@media (max-width: $breakpoint-sm) {
  .label {
    display: none;
  }
  
  .icon {
    margin-right: 0;
    font-size: 14px;
  }
  
  .btn-cart, .btn-buy {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

.btn-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: $border-radius-sm;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 36px;
  font-size: 13px;
  text-transform: none;
  background-color: #f59e0b;
  color: $white;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.15);
}

.btn-contact:hover {
  background-color: #d97706;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(245, 158, 11, 0.2);
}

.btn-contact:active {
  transform: translateY(0);
}
</style> 