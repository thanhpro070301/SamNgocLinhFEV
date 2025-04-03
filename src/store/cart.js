import { ref, computed } from 'vue'

// Sử dụng localStorage để lưu giỏ hàng
const CART_STORAGE_KEY = 'sam-ngoc-linh-cart'

// Tạo state và methods với Composition API
const cartItems = ref(loadCartFromStorage() || [])

// Lưu giỏ hàng xuống localStorage
function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
}

// Đọc giỏ hàng từ localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  return savedCart ? JSON.parse(savedCart) : []
}

// Tính tổng tiền giỏ hàng
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// Số lượng sản phẩm trong giỏ hàng
const cartItemCount = computed(() => {
  return cartItems.value.reduce((count, item) => count + item.quantity, 0)
})

// Thêm sản phẩm vào giỏ hàng
function addToCart(product, quantity = 1) {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  
  if (existingItem) {
    // Sản phẩm đã có trong giỏ hàng, tăng số lượng
    existingItem.quantity += quantity
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    cartItems.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    })
  }
  
  saveCartToStorage()
}

// Cập nhật số lượng sản phẩm
function updateCartItemQuantity(productId, newQuantity) {
  const item = cartItems.value.find(item => item.id === productId)
  
  if (item) {
    if (newQuantity <= 0) {
      // Nếu số lượng ≤ 0, xóa sản phẩm khỏi giỏ hàng
      removeFromCart(productId)
    } else {
      item.quantity = newQuantity
      saveCartToStorage()
    }
  }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  const index = cartItems.value.findIndex(item => item.id === productId)
  
  if (index !== -1) {
    cartItems.value.splice(index, 1)
    saveCartToStorage()
  }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  cartItems.value = []
  saveCartToStorage()
}

export default {
  cartItems,
  cartTotal,
  cartItemCount,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} 