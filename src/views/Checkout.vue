<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Page Title -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Thanh toán</h1>
        <p class="text-gray-600">Hoàn tất thông tin đặt hàng của bạn</p>
      </div>
      
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Shipping Information (Left Side) - Takes 2/3 width on large screens -->
        <div class="lg:col-span-2">
          <div class="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Thông tin giao hàng</h2>
            
            <form @submit.prevent="submitOrder">
              <!-- Name fields (2 columns) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Họ <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="firstName" 
                    type="text" 
                    required
                    class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                    placeholder="Nhập họ của bạn"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="lastName" 
                    type="text" 
                    required
                    class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                    placeholder="Nhập tên của bạn"
                  >
                </div>
              </div>
              
              <!-- Email & Phone -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="email" 
                  type="email" 
                  required
                  class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  placeholder="Nhập email của bạn"
                >
              </div>
              
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="phone" 
                  type="tel" 
                  required
                  class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  placeholder="Nhập số điện thoại của bạn"
                >
              </div>
              
              <!-- Address -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="address" 
                  type="text" 
                  required
                  class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  placeholder="Nhập địa chỉ của bạn"
                >
              </div>
              
              <!-- Notes -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea 
                  v-model="notes" 
                  rows="3"
                  class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm border border-green-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  placeholder="Thêm ghi chú về đơn hàng của bạn (không bắt buộc)"
                ></textarea>
              </div>
              
              <!-- Payment Methods -->
              <div class="mt-8 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
                
                <div class="space-y-4">
                  <label class="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-300 cursor-pointer transition-all hover:shadow-md" :class="{'bg-blue-50/70 border-blue-400': paymentMethod === 'cod'}">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      v-model="paymentMethod"
                      class="h-5 w-5 text-blue-500 focus:ring-blue-400"
                    >
                    <div class="ml-3">
                      <span class="block text-gray-800 font-medium" :class="{'text-blue-700': paymentMethod === 'cod'}">Thanh toán khi nhận hàng (COD)</span>
                      <span class="text-gray-500 text-sm">Thanh toán bằng tiền mặt khi nhận hàng</span>
                    </div>
                  </label>
                  
                  <label class="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-300 cursor-pointer transition-all hover:shadow-md" :class="{'bg-blue-50/70 border-blue-400': paymentMethod === 'bank'}">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank" 
                      v-model="paymentMethod"
                      class="h-5 w-5 text-blue-500 focus:ring-blue-400"
                    >
                    <div class="ml-3">
                      <span class="block text-gray-800 font-medium" :class="{'text-blue-700': paymentMethod === 'bank'}">Chuyển khoản ngân hàng</span>
                      <span class="text-gray-500 text-sm">Thanh toán qua chuyển khoản ngân hàng</span>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Order Summary (Right Side) - Takes 1/3 width on large screens -->
        <div>
          <div class="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 sticky top-24">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
            
            <!-- Order Items -->
            <div class="divide-y divide-gray-200/60">
              <div v-if="cartItems.length === 0" class="py-4 text-gray-500 text-center">
                Giỏ hàng trống
              </div>
              
              <div v-for="item in cartItems" :key="item.id" class="py-4 flex items-center space-x-4">
                <div class="w-16 h-16 flex-shrink-0 bg-white/70 rounded-lg overflow-hidden border border-green-200">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">SL: {{ item.quantity }}</p>
                </div>
                <div class="text-sm font-medium text-gray-800">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
            
            <!-- Order Total -->
            <div class="mt-6 space-y-4">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(subTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="border-t border-gray-200/60 my-2 pt-4 flex justify-between items-center">
                <span class="text-gray-800 font-medium">Tổng cộng:</span>
                <span class="text-green-600 font-bold text-xl">{{ formatPrice(grandTotal) }}</span>
              </div>
              
              <!-- Place Order Button -->
              <button 
                @click="submitOrder"
                :disabled="isSubmitting || cartItems.length === 0"
                class="w-full py-3 px-4 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <i class="fas fa-shopping-bag mr-2"></i>
                {{ isSubmitting ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>
              
              <!-- Back to Cart Button -->
              <router-link 
                to="/cart" 
                class="w-full py-2 px-4 mt-3 bg-white/70 hover:bg-white/90 text-gray-700 font-medium rounded-xl shadow-sm border border-green-200 transition-all flex items-center justify-center text-sm"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Quay lại giỏ hàng
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import cart from '@/store/cart';
import notificationService from '@/utils/notificationService';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();

// Form Data
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const notes = ref('');
const paymentMethod = ref('cod');
const isSubmitting = ref(false);

// Cart Data
const cartItems = computed(() => cart.cartItems.value);
const subTotal = computed(() => cart.cartTotal.value);
const shippingFee = computed(() => {
  // Free shipping for orders over 1,000,000 VND
  return subTotal.value > 1000000 ? 0 : 30000;
});
const grandTotal = computed(() => subTotal.value + shippingFee.value);

// Format price to VND currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price);
};

// Submit Order
const submitOrder = async () => {
  try {
    if (cartItems.value.length === 0) {
      notificationService.showError('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }
    
    isSubmitting.value = true;
    
    // Simulate API request with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create order object
    const order = {
      customerInfo: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        notes: notes.value
      },
      items: cartItems.value,
      paymentMethod: paymentMethod.value,
      subtotal: subTotal.value,
      shippingFee: shippingFee.value,
      total: grandTotal.value,
      orderDate: new Date().toISOString()
    };
    
    console.log('Order placed:', order);
    
    // Clear cart
    cart.clearCart();
    
    // Show success notification
    notificationService.show('Đơn hàng của bạn đã được đặt thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.', {
      title: 'Đặt hàng thành công',
      type: 'success',
      duration: 4000
    });
    
    // Redirect to success page
    router.push('/order-success');
  } catch (error) {
    console.error('Order submission error:', error);
    notificationService.showError('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
  } finally {
    isSubmitting.value = false;
  }
};

// Load user data if authenticated
onMounted(async () => {
  if (auth.isAuthenticated) {
    // Ensure we have the latest user profile
    await auth.fetchUserProfile();
    
    if (auth.user) {
      const user = auth.user;
      
      // Check for name in various possible formats
      if (user.firstName) {
        firstName.value = user.firstName;
      } else if (user.fname) {
        firstName.value = user.fname;
      } else if (user.first_name) {
        firstName.value = user.first_name;
      }
      
      if (user.lastName) {
        lastName.value = user.lastName;
      } else if (user.lname) {
        lastName.value = user.lname;
      } else if (user.last_name) {
        lastName.value = user.last_name;
      } else if (user.surname) {
        lastName.value = user.surname;
      }
      
      // Log user info to check structure
      console.log('User info for checkout:', user);
      
      // Handle possible name in a single field
      if ((!firstName.value || !lastName.value) && user.name) {
        const nameParts = user.name.split(' ');
        if (nameParts.length > 1) {
          lastName.value = nameParts.pop();
          firstName.value = nameParts.join(' ');
        } else if (nameParts.length === 1) {
          lastName.value = nameParts[0];
        }
      }
      
      if (user.email) email.value = user.email;
      if (user.phone) phone.value = user.phone;
      // Address and notes are left empty for manual entry
    }
  }
  
  // If cart is empty, redirect back to cart page
  if (cartItems.value.length === 0) {
    notificationService.show('Giỏ hàng của bạn đang trống', {
      title: 'Không thể thanh toán',
      type: 'info',
      duration: 3000
    });
    router.push('/cart');
  }
});
</script>

<style scoped>
/* Custom focus styling for radio buttons */
input[type="radio"]:checked {
  background-color: #8b5cf6; /* purple-500 */
  border-color: #8b5cf6;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white\/30, .bg-white\/40, .bg-white\/50, .bg-white\/60, .bg-white\/70 {
  animation: fadeIn 0.5s ease-out;
}

/* Hover effects for payment methods */
input[type="radio"]:checked + div {
  color: #7c3aed; /* purple-600 */
}

/* Add hover effect to form inputs */
input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25); /* purple-500 with opacity */
  border-color: #8b5cf6 !important; /* purple-500 */
  outline: none;
}

/* Improve the aesthetics of form inputs on hover */
input:hover, textarea:hover {
  border-color: #a78bfa; /* purple-400 */
}

/* Ensure address field stands out since it needs manual entry */
input[type="text"][placeholder="Nhập địa chỉ của bạn"] {
  background-color: rgba(255, 255, 255, 0.7);
  border-color: rgba(139, 92, 246, 0.5); /* purple-500 with opacity */
}

input[type="text"][placeholder="Nhập địa chỉ của bạn"]:focus {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #8b5cf6 !important; /* purple-500 */
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}

/* Add a glow effect on focus for all inputs */
input:focus, textarea:focus {
  animation: focusGlow 0.3s ease forwards;
}

@keyframes focusGlow {
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25); }
}
</style> 