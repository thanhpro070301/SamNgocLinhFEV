<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative h-full">
    <!-- Badge giảm giá -->
    <div v-if="hasDiscount" class="absolute left-0 top-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-r-full shadow-md">
      -{{ discountPercent }}%
    </div>
    
    <div class="h-full flex flex-col">
      <div class="product-image-container relative group">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
        
        <!-- Wishlist button -->
        <button class="wishlist-button">
          <i class="far fa-heart"></i>
        </button>
        
        <!-- Quick view button -->
        <button @click="navigateToProduct" class="quick-view-button">
          <i class="fas fa-eye"></i>
        </button>
        
        <!-- Add to Cart Button - fixed position at bottom -->
        <div class="add-to-cart-container">
          <button 
            @click="addToCartAction"
            class="add-to-cart-button"
          >
            Add To Cart
          </button>
        </div>
      </div>
      
      <div class="p-4 flex-grow flex flex-col">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600">
          <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
        </h3>
        
        <!-- Star rating -->
        <div class="flex items-center mb-2">
          <div class="flex gap-1">
            <i v-for="i in 5" :key="i" class="fas fa-star text-sm" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
          </div>
          <span class="text-sm text-gray-500 ml-1">
            ({{ product.sold || '0' }})
          </span>
        </div>
        
        <div class="mt-auto">
          <!-- Price -->
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-bold text-red-500">${{ formatSimplePrice(product.price) }}</span>
            <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through ml-2">
              ${{ formatSimplePrice(product.originalPrice) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import cart from '@/store/cart'
import eventBus from '@/utils/eventBus'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['add-to-cart'])
const showAddedAnimation = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
}

// Simple price format for the exact design
const formatSimplePrice = (price) => {
  return price;
}

const hasDiscount = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > props.product.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const discount = ((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100
  return Math.round(discount)
})

const navigateToProduct = (event) => {
  event.stopPropagation();
  if (props.product.stock > 0) {
    router.push(`/product/${product.id}`)
  }
}

const addToCartAction = (event) => {
  event.stopPropagation(); // Prevent event bubbling
  if (props.product.stock > 0) {
    cart.addToCart(props.product, 1)
    emits('add-to-cart', props.product)
    
    // Show animation
    showAddedAnimation.value = true
    
    // Hide animation after 1.5 seconds
    setTimeout(() => {
      showAddedAnimation.value = false
    }, 1500)
    
    // Emit global event
    eventBus.emit('product-added-to-cart', props.product)
    
    // Show notification
    notificationService.cart(props.product)
  }
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

/* Product Image Container */
.product-image-container {
  position: relative;
  overflow: hidden;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
}

/* Quick view and wishlist buttons */
.quick-view-button, .wishlist-button {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10;
}

.wishlist-button {
  top: 10px;
  left: 10px;
}

.quick-view-button {
  top: 10px;
  right: 10px;
}

.group:hover .quick-view-button,
.group:hover .wishlist-button {
  opacity: 1;
}

.quick-view-button:hover, 
.wishlist-button:hover {
  background-color: $primary-color;
  color: white;
}

/* Add To Cart Button */
.add-to-cart-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 5;
}

.group:hover .add-to-cart-container {
  transform: translateY(0);
}

.add-to-cart-button {
  width: 100%;
  background-color: #16a34a;
  color: #fff;
  font-weight: 500;
  padding: 12px 0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-to-cart-button:hover {
  background-color: #15803d;
}
</style> 