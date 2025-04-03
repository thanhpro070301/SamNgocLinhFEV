<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
    <!-- Badge giảm giá -->
    <div v-if="hasDiscount" class="absolute left-0 top-4 bg-red-500 text-white px-3 py-1 text-sm font-medium">
      -{{ discountPercent }}%
    </div>
    
    <div class="p-1">
      <div class="h-48 overflow-hidden">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors mb-2">
          {{ product.name }}
        </h3>
        
        <!-- Star rating -->
        <div class="flex items-center mb-2">
          <div class="flex">
            <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
          </div>
          <span class="text-sm text-gray-500 ml-1">({{ product.sold || 0 }} đánh giá)</span>
        </div>
        
        <div class="flex items-baseline">
          <span class="text-xl font-bold text-green-600">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through ml-2">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        
        <div class="mt-4">
          <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition-colors flex items-center justify-center">
            <i class="fas fa-shopping-cart mr-2"></i> Mua ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

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
</script> 