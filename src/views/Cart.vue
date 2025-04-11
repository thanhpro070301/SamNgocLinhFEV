<template>
  <div class="cart-page py-10 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <div class="container mx-auto px-4 sm:px-6">
      <h1 class="text-3xl font-bold mb-8 text-slate-800 dark:text-white tracking-tight">Giỏ hàng của bạn</h1>
      
      <!-- Empty cart state -->
      <div v-if="cartItems.length === 0" class="glassmorphism-card p-8 text-center max-w-md mx-auto">
        <div class="mb-6">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-glass">
            <i class="fas fa-shopping-cart text-slate-400 dark:text-slate-300 text-3xl"></i>
          </div>
        </div>
        <h2 class="text-2xl font-medium text-slate-700 dark:text-white mb-4">Giỏ hàng của bạn đang trống</h2>
        <p class="text-slate-500 dark:text-slate-300 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán.</p>
        <router-link to="/products" class="glass-button-primary inline-flex items-center">
          <i class="fas fa-shopping-basket mr-2"></i> Tiếp tục mua sắm
        </router-link>
      </div>
      
      <!-- Cart with items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Left side: Product list -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glassmorphism-card overflow-hidden">
            <div class="p-6 border-b border-white/10 dark:border-slate-700/30 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-slate-800 dark:text-white">Sản phẩm ({{ cartItemCount }})</h2>
            </div>
            
            <ul class="divide-y divide-white/10 dark:divide-slate-700/30">
              <li v-for="item in cartItems" :key="item.id" class="p-6 transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5">
                <div class="flex flex-col sm:flex-row sm:items-center">
                  <!-- Product image -->
                  <div class="w-full sm:w-24 h-24 bg-white/30 dark:bg-slate-700/30 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 shadow-glass">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                  </div>
                  
                  <!-- Product details -->
                  <div class="flex-grow">
                    <!-- Name and price -->
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <h3 class="font-medium text-slate-800 dark:text-white text-lg mb-1 sm:mb-0">{{ item.name }}</h3>
                      <div class="text-green-600 dark:text-green-400 font-bold">{{ formatPrice(item.price * item.quantity) }}</div>
                    </div>
                    
                    <!-- Unit price -->
                    <div class="flex-grow text-sm text-slate-500 dark:text-slate-400 mb-4">{{ formatPrice(item.price) }} / sản phẩm</div>
                    
                    <!-- Quantity and actions -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm rounded-lg p-1 shadow-glass">
                        <button 
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                          :disabled="item.quantity <= 1"
                          :class="{'opacity-50 cursor-not-allowed': item.quantity <= 1}"
                        >
                          <i class="fas fa-minus text-xs"></i>
                        </button>
                        <input 
                          type="number" 
                          :value="item.quantity" 
                          min="1"
                          @input="e => updateQuantity(item.id, parseInt(e.target.value) || 1)"
                          class="w-12 h-8 bg-transparent text-center text-slate-800 dark:text-white font-medium focus:outline-none" 
                        />
                        <button 
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                        >
                          <i class="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                      
                      <button 
                        @click="removeItem(item.id)"
                        class="mt-3 sm:mt-0 text-red-500 dark:text-red-400 text-sm hover:text-red-600 dark:hover:text-red-300 flex items-center transition-all backdrop-blur-sm rounded-lg px-3 py-1.5 bg-white/10 dark:bg-slate-700/20 border border-white/10 dark:border-slate-700/30"
                      >
                        <i class="fas fa-trash mr-1.5"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Actions: Continue shopping and Clear all -->
          <div class="flex justify-between">
            <router-link to="/products" class="glass-button-outline flex items-center">
              <i class="fas fa-arrow-left mr-2"></i> Tiếp tục mua sắm
            </router-link>
            
            <button 
              @click="clearCart"
              class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium flex items-center px-4 py-2 rounded-lg transition-all bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm border border-white/10 dark:border-slate-700/30 shadow-sm"
            >
              <i class="fas fa-trash mr-2"></i> Xóa tất cả
            </button>
          </div>
        </div>
        
        <!-- Right side: Order summary -->
        <div class="lg:col-span-1">
          <div class="glassmorphism-card overflow-hidden">
            <div class="p-6 border-b border-white/10 dark:border-slate-700/30">
              <h2 class="text-xl font-semibold text-slate-800 dark:text-white">Tóm tắt đơn hàng</h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-5">
                <div class="flex justify-between">
                  <div class="text-slate-600 dark:text-slate-300">Tạm tính</div>
                  <div class="font-medium text-slate-800 dark:text-white">{{ formatPrice(cartTotal) }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-slate-600 dark:text-slate-300">Phí vận chuyển</div>
                  <div class="font-medium text-green-600 dark:text-green-400">Miễn phí</div>
                </div>
                
                <div class="pt-4 border-t border-white/10 dark:border-slate-700/30">
                  <div class="flex justify-between items-center">
                    <div class="font-medium text-slate-700 dark:text-slate-200">Tổng cộng</div>
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatPrice(cartTotal) }}</div>
                  </div>
                </div>
                
                <button 
                  @click="checkout" 
                  class="w-full mt-6 glass-button-primary flex items-center justify-center py-3.5"
                >
                  <i class="fas fa-credit-card mr-2"></i> Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirm Dialogs -->
    <ConfirmDialog
      :show="showRemoveItemDialog"
      title="Xoá sản phẩm"
      message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
      @confirm="confirmRemoveItem"
      @cancel="cancelRemoveItem"
    />
    
    <ConfirmDialog
      :show="showClearCartDialog"
      title="Xoá tất cả sản phẩm"
      message="Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
      @confirm="confirmClearCart"
      @cancel="cancelClearCart"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import cart from '@/store/cart'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()

const cartItems = computed(() => cart.cartItems.value)
const cartTotal = computed(() => cart.cartTotal.value)
const cartItemCount = computed(() => cart.cartItemCount.value)

// Confirm dialog states
const showRemoveItemDialog = ref(false)
const showClearCartDialog = ref(false)
const itemToRemove = ref(null)

// Cập nhật số lượng sản phẩm
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) newQuantity = 1
  cart.updateCartItemQuantity(productId, newQuantity)
}

// Xóa sản phẩm khỏi giỏ hàng - open dialog
function removeItem(productId) {
  itemToRemove.value = productId
  showRemoveItemDialog.value = true
}

// Confirm remove item
function confirmRemoveItem() {
  if (itemToRemove.value !== null) {
    cart.removeFromCart(itemToRemove.value)
    itemToRemove.value = null
  }
  showRemoveItemDialog.value = false
}

// Cancel remove item
function cancelRemoveItem() {
  itemToRemove.value = null
  showRemoveItemDialog.value = false
}

// Xóa tất cả sản phẩm - open dialog
function clearCart() {
  showClearCartDialog.value = true
}

// Confirm clear cart
function confirmClearCart() {
  cart.clearCart()
  showClearCartDialog.value = false
}

// Cancel clear cart
function cancelClearCart() {
  showClearCartDialog.value = false
}

// Tiến hành thanh toán
function checkout() {
  router.push('/checkout')
}

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.glassmorphism-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.dark) .glassmorphism-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shadow-glass {
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 2px 3px rgba(255, 255, 255, 0.2);
}

.glass-button-primary {
  background: linear-gradient(to right, #22c55e, #16a34a);
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.glass-button-primary:hover {
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3);
  transform: translateY(-2px);
}

.glass-button-outline {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: #22c55e;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.3);
  transition: all 0.3s ease;
}

.glass-button-outline:hover {
  background: rgba(34, 197, 94, 0.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.dark) .glass-button-outline {
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  background: rgba(15, 23, 42, 0.3);
}

:deep(.dark) .glass-button-outline:hover {
  background: rgba(74, 222, 128, 0.1);
}
</style> 