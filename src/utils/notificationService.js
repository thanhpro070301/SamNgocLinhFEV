import { ref } from 'vue'

const showNotification = ref(false)
const notificationData = ref({
  title: '',
  message: '',
  duration: 3000
})

// Show notification
const show = (message, options = {}) => {
  notificationData.value = {
    title: options.title || 'Thông báo',
    message: message,
    duration: options.duration || 3000
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

// Shortcut methods
const cart = (product, quantity = 1) => {
  const quantityText = quantity > 1 ? `${quantity} sản phẩm` : 'sản phẩm';
  
  return show(`Đã thêm ${quantityText} "${product.name}" vào giỏ hàng!`, {
    title: 'Thêm vào giỏ hàng thành công',
    duration: 2000
  })
}

export default {
  showNotification,
  notificationData,
  show,
  hide,
  cart
} 