import { ref } from 'vue'

const TOAST_LIMIT = 3
const toasts = ref([])

// Remove a toast from the list
const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Add a new toast
const addToast = (options) => {
  // Create unique ID for this toast
  const id = Date.now().toString()

  // If we're at the limit, remove the oldest toast
  if (toasts.value.length >= TOAST_LIMIT) {
    removeToast(toasts.value[0].id)
  }

  // Add new toast to the list
  const newToast = {
    id,
    ...options
  }
  
  toasts.value.push(newToast)
  
  // Return the ID so it can be closed manually if needed
  return id
}

// Toast types
const success = (message, options = {}) => {
  return addToast({
    type: 'success',
    title: options.title || 'Thành công!',
    message,
    duration: options.duration || 3000
  })
}

const error = (message, options = {}) => {
  return addToast({
    type: 'error',
    title: options.title || 'Lỗi!',
    message,
    duration: options.duration || 5000
  })
}

const warning = (message, options = {}) => {
  return addToast({
    type: 'warning',
    title: options.title || 'Cảnh báo!',
    message,
    duration: options.duration || 4000
  })
}

const info = (message, options = {}) => {
  return addToast({
    type: 'info',
    title: options.title || 'Thông báo!',
    message,
    duration: options.duration || 3000
  })
}

// Close a toast manually
const close = (id) => {
  removeToast(id)
}

export default {
  toasts,
  success,
  error,
  warning,
  info,
  close
} 