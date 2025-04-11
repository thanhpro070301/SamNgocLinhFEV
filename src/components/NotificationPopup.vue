<template>
  <transition name="notification">
    <div v-if="show" class="fixed top-6 right-6 z-50 max-w-sm w-full">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden w-full scale-animation">
        <!-- Header with close button -->
        <div class="bg-gradient-to-r from-green-600 to-green-500 p-3 flex justify-between items-center">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-white mr-2"></i>
            <span class="text-white font-medium">{{ title }}</span>
          </div>
          <button @click="closeNotification" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-3 bg-white">
          <p class="text-gray-700 text-sm">{{ message }}</p>
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
  animation: slide-in 0.3s ease forwards;
}

.notification-enter-active, .notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from, .notification-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

@keyframes slide-in {
  0% {
    transform: translateX(50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 