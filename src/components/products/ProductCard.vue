<template>
  <div class="product-card bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
    <!-- Discount Badge -->
    <div class="relative">
      <img :src="getImageSrc(product.image)" :alt="product.name" class="w-full h-48 object-cover">
      <span v-if="product.discount" class="absolute top-3 left-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
        -{{ product.discount }}%
      </span>
    </div>

    <div class="p-4 flex flex-col flex-1">
      <!-- Product Name -->
      <h3 class="text-lg font-medium text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
        <router-link :to="'/products/' + product.id">{{ product.name }}</router-link>
      </h3>

      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex">
          <i v-for="i in 5" :key="i" 
             :class="[
               'fas fa-star text-sm',
               i <= product.rating ? 'text-yellow-400' : 'text-gray-300'
             ]"
          ></i>
        </div>
        <span class="text-sm text-gray-500 ml-2">({{ product.reviews }} đánh giá)</span>
      </div>

      <div class="mt-auto">
        <!-- Price -->
        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-xl font-bold text-green-600">
            {{ formatPrice(product.price) }} đ
          </span>
          <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
            {{ formatPrice(product.originalPrice) }} đ
          </span>
        </div>

        <!-- Buy Button -->
        <button 
          @click="$emit('add-to-cart', product)"
          class="w-full bg-green-600 text-white h-11 rounded font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <i class="fas fa-shopping-cart text-sm"></i>
          Mua ngay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const getImageSrc = (image) => {
  if (!image) return ''; // Return empty if no image
  
  // Check if it's already a base64 image
  if (image.startsWith('data:image')) {
    return image;
  }
  
  // Check if it's a relative path that needs the base URL
  if (image.startsWith('images/')) {
    return `/${image}`;
  }
  
  // Otherwise return as is
  return image;
}
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 