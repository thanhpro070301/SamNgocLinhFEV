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
    
    <!-- Order Success Modal -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white">
              <div class="flex flex-col items-center p-6 pt-8">
                <!-- Success animation -->
                <div class="success-checkmark mb-4">
                  <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                  </div>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-2" id="modal-title">Đặt hàng thành công!</h3>
                <p class="text-gray-500 text-center mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.</p>
                
                <div class="border border-gray-200 rounded-lg p-5 w-full mb-6 bg-gray-50">
                  <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Mã đơn hàng:</span>
                    <span class="font-semibold">#{{ orderId }}</span>
                  </div>
                  <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Tổng tiền:</span>
                    <span class="font-semibold">{{ formatPrice(cartTotal + shippingFee) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phương thức thanh toán:</span>
                    <span class="font-semibold">{{ getPaymentMethod(paymentMethod) }}</span>
                  </div>
                </div>
                
                <div class="flex flex-col gap-2 w-full">
                  <button @click="closeSuccessModal" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Tiếp tục mua sắm
                  </button>
                  <button @click="viewOrders" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Xem đơn hàng của tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
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
const showSuccessModal = ref(false)
const orderId = ref(Math.floor(Math.random() * 1000000)) // Random order ID for demo
let redirectTimeout = null

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

// Get readable payment method
const getPaymentMethod = (method) => {
  switch(method) {
    case 'cod': return 'Thanh toán khi nhận hàng (COD)'
    case 'bank': return 'Chuyển khoản ngân hàng'
    case 'card': return 'Thẻ tín dụng/Ghi nợ'
    default: return 'Thanh toán khi nhận hàng (COD)'
  }
}

// Đặt hàng
const placeOrder = () => {
  if (cartItems.value.length === 0) {
    alert('Giỏ hàng của bạn đang trống')
    return
  }
  
  // TODO: Gửi thông tin đơn hàng đến server
  // Hiển thị modal thành công
  showSuccessModal.value = true
  
  // Xóa giỏ hàng
  cart.clearCart()
  
  // Set up auto-redirect after 8 seconds
  redirectTimeout = setTimeout(() => {
    closeSuccessModal()
  }, 8000)
}

// Đóng modal và chuyển về trang chủ
const closeSuccessModal = () => {
  showSuccessModal.value = false
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
  }
  router.push('/')
}

// Chuyển đến trang đơn hàng của tôi
const viewOrders = () => {
  showSuccessModal.value = false
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
  }
  router.push('/my-orders')
}

// Clean up timeout
onBeforeUnmount(() => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
  }
})
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Success Checkmark Animation */
.success-checkmark {
  width: 80px;
  height: 80px;
  position: relative;
}

.success-checkmark .check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #16a34a;
}

.success-checkmark .check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.success-checkmark .check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.success-checkmark .check-icon::before,
.success-checkmark .check-icon::after {
  content: '';
  height: 100px;
  position: absolute;
  background: #FFFFFF;
  transform: rotate(-45deg);
}

.success-checkmark .check-icon .icon-line {
  height: 5px;
  background-color: #16a34a;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.success-checkmark .check-icon .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.success-checkmark .check-icon .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

.success-checkmark .check-icon .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid #16a34a;
  opacity: 0.5;
  animation: circle-fill-anim 1s;
}

.success-checkmark .check-icon .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: white;
}

@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 46px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

@keyframes circle-fill-anim {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}
</style> 