<template>
  <div class="cart-page py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div v-if="cartItems.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mb-4">
          <i class="fas fa-shopping-cart text-gray-300 text-6xl"></i>
        </div>
        <h2 class="text-2xl font-medium text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
        <p class="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán.</p>
        <router-link to="/products" class="inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-500 transition-colors">
          Tiếp tục mua sắm
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Danh sách sản phẩm -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">Sản phẩm ({{ cartItemCount }})</h2>
            </div>
            
            <ul class="divide-y divide-gray-200">
              <li v-for="item in cartItems" :key="item.id" class="p-6">
                <div class="flex flex-col sm:flex-row">
                  <div class="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                  </div>
                  
                  <div class="flex-grow">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      <h3 class="font-medium text-gray-800 mb-1 sm:mb-0">{{ item.name }}</h3>
                      <div class="text-green-600 font-bold">{{ formatPrice(item.price * item.quantity) }}</div>
                    </div>
                    
                    <div class="flex-grow text-sm text-gray-600 mb-4">{{ formatPrice(item.price) }} / sản phẩm</div>
                    
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center">
                        <button 
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l text-gray-500 hover:bg-gray-100"
                        >
                          <i class="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          :value="item.quantity" 
                          min="1"
                          @input="e => updateQuantity(item.id, parseInt(e.target.value) || 1)"
                          class="w-12 h-8 border-t border-b border-gray-300 text-center" 
                        />
                        <button 
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r text-gray-500 hover:bg-gray-100"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                      
                      <button 
                        @click="removeItem(item.id)"
                        class="mt-2 sm:mt-0 text-red-500 text-sm hover:text-red-700 flex items-center transition-colors"
                      >
                        <i class="fas fa-trash mr-1"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="flex justify-between">
            <router-link to="/products" class="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors">
              <i class="fas fa-arrow-left mr-2"></i> Tiếp tục mua sắm
            </router-link>
            
            <button 
              @click="clearCart"
              class="text-red-500 hover:text-red-700 font-medium flex items-center transition-colors"
            >
              <i class="fas fa-trash mr-2"></i> Xóa tất cả
            </button>
          </div>
        </div>
        
        <!-- Tóm tắt đơn hàng -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between">
                  <div class="text-gray-600">Tạm tính</div>
                  <div class="font-medium">{{ formatPrice(cartTotal) }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-gray-600">Phí vận chuyển</div>
                  <div class="font-medium">Miễn phí</div>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                  <div class="flex justify-between">
                    <div class="font-medium text-gray-800">Tổng cộng</div>
                    <div class="text-xl font-bold text-green-600">{{ formatPrice(cartTotal) }}</div>
                  </div>
                </div>
                
                <button 
                  @click="checkout" 
                  class="w-full mt-4 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-credit-card mr-2"></i> Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import cart from '@/store/cart'

const router = useRouter()

const cartItems = computed(() => cart.cartItems.value)
const cartTotal = computed(() => cart.cartTotal.value)
const cartItemCount = computed(() => cart.cartItemCount.value)

// Cập nhật số lượng sản phẩm
function updateQuantity(productId, newQuantity) {
  cart.updateCartItemQuantity(productId, newQuantity)
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(productId) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    cart.removeFromCart(productId)
  }
}

// Xóa tất cả sản phẩm khỏi giỏ hàng
function clearCart() {
  if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")) {
    cart.clearCart()
  }
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
</style> 