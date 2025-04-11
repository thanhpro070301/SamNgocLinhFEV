<template>
  <div 
    class="glassmorphism-card relative p-6 rounded-xl transition-all duration-300 hover:translate-y-[-4px]"
    :class="[color]"
  >
    <div class="flex items-center">
      <div 
        class="flex-shrink-0 rounded-lg p-4 flex items-center justify-center"
        :class="[iconBgColor]"
      >
        <slot name="icon">
          <svg class="h-7 w-7" :class="[iconColor]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.536a2.25 2.25 0 002.242 0l.879-.536M15 16.182l.879.536a2.25 2.25 0 002.242 0l.879-.536M15 16.182V13.5a2.25 2.25 0 00-4.5 0v2.682m6.75-6.512l.879.536a2.25 2.25 0 012.242 0l.879-.536M15 9.682V6.75a2.25 2.25 0 00-4.5 0v2.932" />
          </svg>
        </slot>
      </div>
      <div class="ml-5 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
            {{ title }}
          </dt>
          <dd>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ value }}
            </div>
          </dd>
        </dl>
      </div>
    </div>
    
    <div 
      v-if="trend !== null" 
      class="mt-3 flex justify-end" 
      :class="{ 'text-green-500': trend > 0, 'text-red-500': trend < 0, 'text-gray-400': trend === 0 }"
    >
      <div class="flex items-center text-sm font-medium">
        <svg 
          v-if="trend > 0" 
          class="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <svg 
          v-else-if="trend < 0" 
          class="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        </svg>
        <span v-if="trend !== 0">{{ Math.abs(trend) }}% {{ trend > 0 ? 'tăng' : 'giảm' }}</span>
        <span v-else>Không đổi</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'bg-white dark:bg-slate-800'
  },
  iconBgColor: {
    type: String,
    default: 'bg-green-100 dark:bg-green-900/30'
  },
  iconColor: {
    type: String,
    default: 'text-green-600 dark:text-green-400'
  },
  trend: {
    type: Number,
    default: null
  }
})
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
</style> 