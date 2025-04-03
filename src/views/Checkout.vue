<template>
  <div class="checkout-page py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">Thanh toán</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Form thanh toán -->
        <div class="md:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1">Họ</label>
                <input v-model="customerInfo.firstName" type="text" class="w-full border rounded-md p-2" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Tên</label>
                <input v-model="customerInfo.lastName" type="text" class="w-full border rounded-md p-2" />
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="customerInfo.email" type="email" class="w-full border rounded-md p-2" />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Số điện thoại</label>
              <input v-model="customerInfo.phone" type="tel" class="w-full border rounded-md p-2" />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Địa chỉ</label>
              <input v-model="customerInfo.address" type="text" class="w-full border rounded-md p-2" />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea v-model="customerInfo.notes" class="w-full border rounded-md p-2" rows="3"></textarea>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <input type="radio" id="cod" name="payment" class="mr-2" v-model="paymentMethod" value="cod" checked />
                <label for="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div class="flex items-center mb-2">
                <input type="radio" id="bank" name="payment" class="mr-2" v-model="paymentMethod" value="bank" />
                <label for="bank">Chuyển khoản ngân hàng</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="card" name="payment" class="mr-2" v-model="paymentMethod" value="card" />
                <label for="card">Thẻ tín dụng/Ghi nợ</label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tóm tắt đơn hàng -->
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
            
            <div v-if="cartItems.length === 0" class="text-center py-4 border-t border-b text-gray-500">
              Giỏ hàng của bạn đang trống
            </div>
            
            <div v-else class="border-t border-b py-4 mb-4">
              <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center mb-3">
                <div>
                  <p class="font-medium">{{ item.name }}</p>
                  <p class="text-sm text-gray-500">SL: {{ item.quantity }}</p>
                </div>
                <p>{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="flex justify-between mb-2">
                <p>Tạm tính</p>
                <p>{{ formatPrice(cartTotal) }}</p>
              </div>
              <div class="flex justify-between mb-2">
                <p>Phí vận chuyển</p>
                <p>{{ formatPrice(shippingFee) }}</p>
              </div>
              <div class="flex justify-between font-bold">
                <p>Tổng cộng</p>
                <p>{{ formatPrice(cartTotal + shippingFee) }}</p>
              </div>
            </div>
            
            <button 
              @click="placeOrder" 
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              :disabled="cartItems.length === 0"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import cart from '@/store/cart'

const router = useRouter()

const cartItems = computed(() => cart.cartItems.value)
const cartTotal = computed(() => cart.cartTotal.value)
const shippingFee = ref(30000) // Phí vận chuyển cố định

const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})

const paymentMethod = ref('cod')

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

// Đặt hàng
const placeOrder = () => {
  if (cartItems.value.length === 0) {
    alert('Giỏ hàng của bạn đang trống')
    return
  }
  
  // TODO: Gửi thông tin đơn hàng đến server
  alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.')
  cart.clearCart()
  router.push('/')
}
</script> 