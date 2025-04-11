<template>
  <Transition name="cart-added">
    <div v-if="show" class="fixed top-24 right-6 z-50 max-w-sm overflow-hidden lg:top-32 lg:right-10">
      <div class="flex flex-col items-center p-4 bg-white/40 backdrop-blur-sm shadow-xl rounded-2xl border border-white/50">
        <!-- Product image -->
        <div class="relative w-full max-w-[160px] mb-3">
          <img :src="product.image" :alt="product.name" class="w-full h-auto object-contain rounded-xl">
          
          <!-- Sparkles effect -->
          <div class="absolute -top-2 -right-2 animate-ping-slow opacity-70">
            <i class="fas fa-sparkles text-yellow-400 text-lg"></i>
          </div>
          <div class="absolute -bottom-1 -left-2 animate-ping-slow opacity-70 animation-delay-300">
            <i class="fas fa-sparkles text-yellow-400 text-lg"></i>
          </div>
        </div>
        
        <!-- Success checkmark -->
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg mb-3 animate-bounce-small">
            <i class="fas fa-check text-2xl"></i>
          </div>
          
          <!-- Confirmation text -->
          <p class="font-semibold text-green-700 text-center">Đã thêm vào giỏ hàng!</p>
          
          <!-- View cart button -->
          <router-link 
            to="/cart" 
            class="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-300"
          >
            Xem giỏ hàng
          </router-link>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: () => ({
      name: 'Sản phẩm',
      image: '/assets/images/products/sam-tuoi.png'
    })
  },
  autoDismiss: {
    type: Boolean,
    default: true
  },
  dismissTime: {
    type: Number,
    default: 3000 // 3 seconds
  }
});

const emit = defineEmits(['close']);

let dismissTimer = null;

onMounted(() => {
  if (props.autoDismiss && props.show) {
    startDismissTimer();
  }
});

onUnmounted(() => {
  if (dismissTimer) clearTimeout(dismissTimer);
});

function startDismissTimer() {
  if (dismissTimer) clearTimeout(dismissTimer);
  dismissTimer = setTimeout(() => {
    emit('close');
  }, props.dismissTime);
}
</script>

<style scoped>
.cart-added-enter-active,
.cart-added-leave-active {
  transition: all 0.5s ease;
}

.cart-added-enter-from,
.cart-added-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.animate-bounce-small {
  animation: bounce-small 1s ease-in-out;
}

.animate-ping-slow {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

@keyframes bounce-small {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes ping {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style> 