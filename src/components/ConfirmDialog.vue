<template>
  <transition name="confirm-dialog">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/30">
      <div class="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full mx-4 scale-animation">
        <!-- Header -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-600 p-4 flex items-center justify-between">
          <h3 class="text-white font-bold">{{ title }}</h3>
          <button @click="cancel" class="text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div class="flex mb-6">
            <div class="mr-4 text-yellow-500 text-2xl">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <p class="text-gray-700">{{ message }}</p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button 
              @click="cancel" 
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="confirm" 
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Xác nhận'
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện hành động này?'
  },
  confirmText: {
    type: String,
    default: 'Xác nhận'
  },
  cancelText: {
    type: String,
    default: 'Huỷ'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.scale-animation {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.confirm-dialog-enter-active, .confirm-dialog-leave-active {
  transition: all 0.3s ease;
}

.confirm-dialog-enter-from, .confirm-dialog-leave-to {
  opacity: 0;
}

.confirm-dialog-enter-from .scale-animation {
  transform: scale(0.8);
}

.confirm-dialog-leave-to .scale-animation {
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
</style> 