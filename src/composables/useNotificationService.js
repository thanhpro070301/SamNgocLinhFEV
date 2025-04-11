import { ref, reactive } from 'vue'
import eventBus from '@/utils/eventBus'

// Create a simple notification service that emits events
export function useNotificationService() {
  const defaultOptions = {
    timeout: 5000,
    type: 'info',
    title: '',
    position: 'top-right'
  }

  // Show a notification
  const show = (message, options = {}) => {
    const notificationOptions = {
      ...defaultOptions,
      ...options,
      message,
      id: Date.now()
    }

    // Emit the notification event
    eventBus.emit('notification:show', notificationOptions)
    
    return notificationOptions.id
  }

  // Show a success notification
  const showSuccess = (message, options = {}) => {
    return show(message, { ...options, type: 'success' })
  }

  // Show an error notification
  const showError = (message, options = {}) => {
    return show(message, { ...options, type: 'error' })
  }

  // Show a warning notification
  const showWarning = (message, options = {}) => {
    return show(message, { ...options, type: 'warning' })
  }

  // Hide a notification by ID
  const hide = (id) => {
    eventBus.emit('notification:hide', id)
  }

  // Clear all notifications
  const clearAll = () => {
    eventBus.emit('notification:clear')
  }

  return {
    show,
    showSuccess,
    showError,
    showWarning,
    hide,
    clearAll
  }
}

// Create a singleton instance for global use
const notificationService = useNotificationService()
export default notificationService 