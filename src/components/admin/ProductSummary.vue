<template>
  <div class="glassmorphism-card rounded-xl overflow-hidden">
    <div class="p-6 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ title }}</h3>
      <slot name="actions"></slot>
    </div>
    
    <div v-if="!products || products.length === 0" class="px-6 pb-6 text-center text-gray-500 flex flex-col items-center">
      <svg class="h-10 w-10 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <span>Không có dữ liệu sản phẩm</span>
    </div>
    
    <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <div v-for="(product, index) in products" :key="index" 
           class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all duration-200">
        <div class="flex items-center space-x-3">
          <div v-if="product.image" class="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
            <img :src="product.image" :alt="product.name" class="h-full w-full object-cover">
          </div>
          <div v-else class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
            <div v-if="product.category" class="text-xs text-gray-500 dark:text-gray-400">{{ product.category }}</div>
          </div>
        </div>
        
        <div class="flex space-x-6">
          <div class="text-right">
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Đã bán</div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.sold }}</div>
          </div>
          
          <div class="text-right min-w-[80px]">
            <div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Tồn kho</div>
            <div class="text-sm font-medium" 
                 :class="getStockStatusColor(product.stock)">
              {{ product.stock }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer">
        <div class="flex justify-end">
          <button @click="$emit('view-all')" 
                  class="neumorph-btn inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-green-600 dark:text-green-400 transition-all duration-200">
            Quản lý sản phẩm
            <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Thống kê sản phẩm'
  },
  products: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view-all']);

// Determine color based on stock level
const getStockStatusColor = (stock) => {
  if (stock <= 0) {
    return 'text-red-600 dark:text-red-400';
  } else if (stock < 10) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-green-600 dark:text-green-400';
  }
};
</script>

<style scoped>
.glassmorphism-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dark .glassmorphism-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(30, 41, 59, 0.2);
}

.neumorph-btn {
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
  background: #f0f4f8;
  border: none;
  font-weight: 600;
}

.neumorph-btn:hover {
  transform: translateY(-1px);
}

.neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
  transform: translateY(0);
}

.dark .neumorph-btn {
  box-shadow: 3px 3px 6px #151A23, -3px -3px 6px #242B38;
  background: #1e293b;
}

.dark .neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #151A23, inset -2px -2px 5px #242B38;
}
</style> 