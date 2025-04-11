<template>
  <div class="fixed z-50 top-4 right-4 flex flex-col gap-3 w-full max-w-md pointer-events-none">
    <transition-group name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="notification-item pointer-events-auto"
      >
        <div 
          class="bg-white rounded-lg shadow-lg border-l-4 p-4 flex items-start"
          :class="getNotificationTypeClass(notification.type)"
        >
          <div class="flex-shrink-0 mr-3">
            <i class="fas" :class="getNotificationIconClass(notification.type)"></i>
          </div>
          <div class="flex-1 mr-2">
            <h4 class="text-sm font-medium" :class="getNotificationTextClass(notification.type)">
              {{ notification.title || getDefaultTitle(notification.type) }}
            </h4>
            <p class="mt-1 text-sm text-gray-600">{{ notification.message }}</p>
          </div>
          <button 
            @click="removeNotification(notification.id)" 
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import eventBus from '@/utils/eventBus'

const notifications = ref([])
const MAX_NOTIFICATIONS = 3

// Add notification
const addNotification = (notification) => {
  // Limit number of notifications displayed
  if (notifications.value.length >= MAX_NOTIFICATIONS) {
    notifications.value.shift()
  }
  
  // Add new notification
  notifications.value.push(notification)
  
  // Auto-remove after timeout
  if (notification.timeout > 0) {
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.timeout)
  }
}

// Remove notification
const removeNotification = (id) => {
  notifications.value = notifications.value.filter(item => item.id !== id)
}

// Clear all notifications
const clearNotifications = () => {
  notifications.value = []
}

// Get default title based on notification type
const getDefaultTitle = (type) => {
  switch (type) {
    case 'success': return 'Thành công!'
    case 'error': return 'Lỗi!'
    case 'warning': return 'Cảnh báo!'
    case 'info': return 'Thông tin'
    default: return 'Thông báo'
  }
}

// Get border color class based on notification type
const getNotificationTypeClass = (type) => {
  switch (type) {
    case 'success': return 'border-green-500'
    case 'error': return 'border-red-500'
    case 'warning': return 'border-yellow-500'
    case 'info': return 'border-blue-500'
    default: return 'border-gray-500'
  }
}

// Get icon class based on notification type
const getNotificationIconClass = (type) => {
  switch (type) {
    case 'success': return 'fa-check-circle text-green-500'
    case 'error': return 'fa-exclamation-circle text-red-500'
    case 'warning': return 'fa-exclamation-triangle text-yellow-500'
    case 'info': return 'fa-info-circle text-blue-500'
    default: return 'fa-bell text-gray-500'
  }
}

// Get text color class based on notification type
const getNotificationTextClass = (type) => {
  switch (type) {
    case 'success': return 'text-green-800'
    case 'error': return 'text-red-800'
    case 'warning': return 'text-yellow-800'
    case 'info': return 'text-blue-800'
    default: return 'text-gray-800'
  }
}

// Event listeners
onMounted(() => {
  eventBus.on('notification:show', addNotification)
  eventBus.on('notification:hide', removeNotification)
  eventBus.on('notification:clear', clearNotifications)
})

onUnmounted(() => {
  eventBus.off('notification:show', addNotification)
  eventBus.off('notification:hide', removeNotification)
  eventBus.off('notification:clear', clearNotifications)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 