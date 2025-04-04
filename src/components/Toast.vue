<template>
  <div v-show="isVisible" class="toast flex items-center p-4 bg-white rounded-lg shadow-lg border-l-4" :class="toastTypeClass">
    <div class="toast-icon mr-3">
      <i class="fas" :class="toastIconClass"></i>
    </div>
    <div class="toast-content flex-grow">
      <h4 class="toast-title text-sm font-medium" :class="toastTitleClass">{{ title }}</h4>
      <p class="toast-message text-sm text-gray-600">{{ message }}</p>
    </div>
    <button @click="closeToast" class="ml-3 text-gray-400 hover:text-gray-600">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: value => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
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

const isVisible = ref(props.show)
let timeoutId = null

const toastTypeClass = computed(() => {
  switch (props.type) {
    case 'success': return 'border-green-500'
    case 'error': return 'border-red-500'
    case 'warning': return 'border-yellow-500'
    case 'info': return 'border-blue-500'
    default: return 'border-green-500'
  }
})

const toastIconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'fa-check-circle text-green-500'
    case 'error': return 'fa-exclamation-circle text-red-500'
    case 'warning': return 'fa-exclamation-triangle text-yellow-500'
    case 'info': return 'fa-info-circle text-blue-500'
    default: return 'fa-check-circle text-green-500'
  }
})

const toastTitleClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-700'
    case 'error': return 'text-red-700'
    case 'warning': return 'text-yellow-700'
    case 'info': return 'text-blue-700'
    default: return 'text-green-700'
  }
})

const closeToast = () => {
  isVisible.value = false
  emit('close')
}

const startTimer = () => {
  if (timeoutId) clearTimeout(timeoutId)
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      closeToast()
    }, props.duration)
  }
}

watch(() => props.show, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    startTimer()
  }
})

onMounted(() => {
  if (isVisible.value) {
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
.toast {
  animation: slide-in 0.3s ease-out forwards;
}

@keyframes slide-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 