<template>
  <transition name="notification">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/30">
      <div class="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full mx-4 scale-animation">
        <!-- Success icon with animation -->
        <div class="bg-gradient-to-r from-green-600 to-green-500 p-6 flex items-center justify-center">
          <div class="cart-animation">
            <i class="fas fa-shopping-cart text-white text-3xl"></i>
            <span class="bg-white text-green-500 text-xs font-bold absolute rounded-full w-6 h-6 flex items-center justify-center cart-badge">+1</span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6 text-center">
          <h3 class="text-xl font-bold text-gray-800 mb-3">{{ title }}</h3>
          <p class="text-gray-600 text-base mb-6">{{ message }}</p>
          <button 
            @click="closeNotification" 
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Thêm vào giỏ hàng'
  },
  message: {
    type: String,
    default: 'Sản phẩm đã được thêm vào giỏ hàng của bạn.'
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const show = ref(props.show)
let timeoutId = null

const closeNotification = () => {
  show.value = false
  emit('close')
}

const startTimer = () => {
  if (timeoutId) clearTimeout(timeoutId)
  
  timeoutId = setTimeout(() => {
    closeNotification()
  }, props.duration)
}

watch(() => props.show, (newVal) => {
  show.value = newVal
  if (newVal) {
    startTimer()
  }
})

onMounted(() => {
  if (show.value) {
    startTimer()
  }
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.scale-animation {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.cart-animation {
  position: relative;
  animation: bounce 1.2s ease infinite;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  animation: pulse 1.5s ease infinite;
}

.notification-enter-active, .notification-leave-active {
  transition: all 0.4s ease;
}

.notification-enter-from, .notification-leave-to {
  opacity: 0;
}

.notification-enter-from .scale-animation {
  transform: scale(0.8);
}

.notification-leave-to .scale-animation {
  transform: scale(0.8);
}

@keyframes pop-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-8px) rotate(-5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-4px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
</style> 