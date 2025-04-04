<template>
  <div class="fixed z-50 top-4 right-4 flex flex-col gap-3 max-w-md">
    <div v-for="toast in toasts" :key="toast.id" class="toast-item overflow-hidden">
      <Toast
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        :show="true"
        @close="closeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Toast from './Toast.vue'
import toastService from '@/utils/toastService'

const toasts = computed(() => toastService.toasts.value)

const closeToast = (id) => {
  toastService.close(id)
}
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style> 