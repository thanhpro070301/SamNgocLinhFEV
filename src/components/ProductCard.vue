<template>
  <div 
    class="product-card relative w-full h-full group transform transition-all duration-300 hover:-translate-y-1"
    :class="{'out-of-stock': product.stock <= 0}"
  >
    <!-- Discount badge -->
    <div 
      v-if="hasDiscount" 
      class="absolute -left-2 top-4 z-20 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-r-md shadow-md"
    >
      -{{ discountPercent }}%
    </div>
    
    <!-- Main card container -->
    <div class="card-inner h-full flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <!-- Image container -->
      <div class="relative pt-4 px-4 mb-2">
        <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-slate-700 aspect-square">
          <!-- Product Image -->
          <img 
            :src="getImageSrc(product.image)" 
            :alt="product.name" 
            class="w-full h-full object-contain transition-all duration-500 hover:scale-105"
            loading="lazy"
            @error="e => e.target.src = '/assets/images/products/sam-tuoi.png'"
          >
          
          <!-- Out of stock overlay -->
          <div v-if="product.stock <= 0" class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-20">
            <span class="px-3 py-1.5 bg-red-500 text-white font-medium rounded-lg text-sm">Hết hàng</span>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="absolute right-6 top-6 flex flex-col gap-2 z-20">
          <button 
            @click="navigateToProduct" 
            class="action-btn bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-green-500 hover:text-white"
            aria-label="Xem chi tiết"
          >
            <i class="fas fa-eye"></i>
          </button>
          
          <button 
            class="action-btn bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-red-500 hover:text-white" 
            aria-label="Yêu thích"
          >
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="px-5 pb-5 flex-grow flex flex-col">
        <!-- Product name -->
        <h3 class="font-medium text-gray-800 dark:text-white mb-2 line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors text-[15px] leading-tight min-h-[2.8rem]">
          <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
        </h3>
        
        <!-- Rating -->
        <div class="flex items-center mb-3">
          <div class="flex gap-0.5">
            <i v-for="i in 5" :key="i" class="fas fa-star text-xs" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"></i>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
            ({{ product.sold || '0' }})
          </span>
        </div>
        
        <!-- Price section -->
        <div class="mt-auto">
          <div class="flex items-baseline gap-2 mb-3">
            <span class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="product.originalPrice" class="text-xs text-gray-500 dark:text-gray-400 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
          </div>
          
          <!-- Add to cart button or Contact button for out of stock -->
          <button 
            v-if="product.stock > 0"
            @click="addToCartAction"
            class="w-full py-2 px-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            <i class="fas fa-shopping-cart mr-2"></i> Thêm vào giỏ
          </button>
          <button 
            v-else
            @click="contactForOrder"
            class="w-full py-2 px-3 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            <i class="fas fa-phone-alt mr-2"></i> Liên hệ đặt hàng
          </button>
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
}

const getImageSrc = (image) => {
  if (!image) return ''; // Return empty if no image
  
  // Check if it's already a base64 image
  if (image.startsWith('data:image')) {
    return image;
  }
  
  // Check if it's a relative path that needs the base URL
  if (image.startsWith('images/')) {
    // Use import.meta.env.BASE_URL or just prepend / depending on your setup
    return `/${image}`;
  }
  
  // Otherwise return as is
  return image;
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
    router.push(`/product/${props.product.id}`)
  }
}

const addToCartAction = (event) => {
  event.stopPropagation(); // Prevent event bubbling
  if (props.product.stock > 0) {
    cart.addToCart(props.product, 1)
    emits('add-to-cart', props.product)
    
    // Emit global event
    eventBus.emit('product-added-to-cart', props.product)
    
    // Show notification
    notificationService.cart(props.product)
  }
}

const contactForOrder = (event) => {
  event.stopPropagation();
  // You could open a modal, redirect to contact page, or show a notification
  notificationService.show('Vui lòng gọi số 0123456789 để đặt hàng sản phẩm này', {
    title: 'Sản phẩm tạm hết hàng',
    type: 'info'
  });
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

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Action buttons */
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transform: translateX(50px);
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .action-btn {
  transform: translateX(0);
  opacity: 1;
}

.action-btn:nth-child(2) {
  transition-delay: 0.05s;
}

/* Out of stock styling */
.out-of-stock img {
  opacity: 0.7;
}
</style> 