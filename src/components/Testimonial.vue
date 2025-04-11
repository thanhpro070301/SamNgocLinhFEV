<template>
  <div 
    class="testimonial-card clay-card relative transition-all duration-500"
    :class="{ 'highlighted': highlight }"
  >
    <!-- Clay card styling -->
    <div class="clay-inner bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-10 h-full relative overflow-hidden border border-white/30 dark:border-slate-700/30 shadow-xl">
      <!-- Quote icon -->
      <div class="quote-icon absolute right-6 top-6 text-green-200 dark:text-green-900/50 opacity-50">
        <i class="fas fa-quote-right text-6xl"></i>
      </div>
      
      <!-- Star rating -->
      <div class="flex items-center mb-6">
        <div class="rating flex space-x-1">
          <i v-for="star in 5" :key="star" class="fas fa-star" :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"></i>
        </div>
        <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ testimonial.rating }}.0</span>
      </div>
      
      <!-- Testimonial text -->
      <p class="testimonial-text text-gray-600 dark:text-gray-300 italic mb-8 relative z-10 min-h-[100px]">
        "{{ testimonial.text }}"
      </p>
      
      <!-- Author info -->
      <div class="testimonial-author flex items-center">
        <div class="author-avatar w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white dark:border-slate-600 shadow-md">
          <img 
            :src="testimonial.avatar || '/images/avatar-placeholder.png'" 
            :alt="testimonial.name" 
            class="w-full h-full object-cover"
          >
        </div>
        
        <div class="author-details">
          <h4 class="font-bold text-gray-800 dark:text-white">{{ testimonial.name }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.title }}</p>
        </div>
      </div>
      
      <!-- Background decoration elements -->
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-green-100/50 dark:bg-green-900/20 rounded-full blur-2xl opacity-60 mix-blend-screen dark:mix-blend-multiply"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  testimonial: {
    type: Object,
    required: true,
    validator: (testimonial) => {
      return (
        testimonial.name && 
        testimonial.text && 
        testimonial.rating &&
        testimonial.rating >= 1 &&
        testimonial.rating <= 5
      );
    }
  },
  highlight: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.clay-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.clay-inner {
  transform: translateZ(0);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, box-shadow;
}

.testimonial-card:hover .clay-inner {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.1),
    0 10px 15px -5px rgba(0, 0, 0, 0.05);
}

.dark .testimonial-card:hover .clay-inner {
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.5),
    0 10px 15px -5px rgba(0, 0, 0, 0.2);
}

.testimonial-text {
  font-size: 1.125rem;
  line-height: 1.7;
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Highlighted testimonial */
.highlighted .clay-inner {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.9), rgba(240, 253, 244, 0.8));
  border-color: rgba(134, 239, 172, 0.3);
}

.dark .highlighted .clay-inner {
  background: linear-gradient(135deg, rgba(6, 78, 59, 0.8), rgba(6, 95, 70, 0.6));
  border-color: rgba(16, 185, 129, 0.3);
}

.highlighted .clay-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #4ade80, #10b981);
  border-radius: 4px 4px 0 0;
}

/* Animation when hovering */
.testimonial-card:hover .quote-icon {
  transform: rotate(10deg);
}

.quote-icon {
  transition: transform 0.5s ease;
}
</style> 