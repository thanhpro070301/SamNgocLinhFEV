import { ref } from 'vue'

const showNotification = ref(false)
const notificationData = ref({
  title: '',
  message: '',
  duration: 3000
})

// Product-specific cart confirmation
const showCartConfirmation = ref(false)
const cartConfirmationData = ref({
  product: null,
  duration: 3000
})

// Show notification
const show = (message, options = {}) => {
  notificationData.value = {
    title: options.title || 'Thông báo',
    message: message,
    duration: options.duration || 3000,
    type: options.type || 'info'
  }
  
  showNotification.value = true
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, notificationData.value.duration)
  })
}

// Hide notification
const hide = () => {
  showNotification.value = false
}

// Show product added to cart confirmation
const showCartAdded = (product, options = {}) => {
  cartConfirmationData.value = {
    product: product,
    duration: options.duration || 3000
  }
  
  showCartConfirmation.value = true
  
  return new Promise(resolve => {
    setTimeout(() => {
      hideCartAdded()
      resolve()
    }, cartConfirmationData.value.duration)
  })
}

// Hide cart confirmation
const hideCartAdded = () => {
  showCartConfirmation.value = false
}

// Shortcut methods
const cart = (product, quantity = 1) => {
  // Using the new cart confirmation for single products
  if (quantity === 1) {
    return showCartAdded(product, { duration: 3000 })
  }
  
  // Fallback to text notification for multiple quantities
  const quantityText = `${quantity} sản phẩm`;
  
  return show(`Đã thêm ${quantityText} "${product.name}" vào giỏ hàng!`, {
    title: 'Thêm vào giỏ hàng thành công',
    type: 'success',
    duration: 2000
  })
}

// Show error message
const showError = (message, options = {}) => {
  return show(message, {
    ...options,
    title: options.title || 'Lỗi',
    type: 'error'
  })
}

export default {
  showNotification,
  notificationData,
  showCartConfirmation,
  cartConfirmationData,
  show,
  hide,
  showCartAdded,
  hideCartAdded,
  cart,
  showError
} 