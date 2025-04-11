<template>
  <button 
    :class="[
      'neumorph-btn flex items-center justify-center rounded-lg transition-all duration-200',
      size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2',
      variant === 'primary' ? 'text-green-600 dark:text-green-400' : 
      variant === 'secondary' ? 'text-blue-600 dark:text-blue-400' : 
      variant === 'danger' ? 'text-red-600 dark:text-red-400' : 
      'text-gray-700 dark:text-gray-300',
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      fullWidth ? 'w-full' : ''
    ]"
    :disabled="disabled"
    v-bind="$attrs"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
});

const isPressed = ref(false);

const handleMouseDown = (event) => {
  if (event.button === 0) { // Left mouse button
    isPressed.value = true;
    event.currentTarget.classList.add('neumorph-btn-pressed');
    event.currentTarget.classList.remove('neumorph-btn-released', 'hover:scale-[1.02]');
  }
};

const handleMouseUp = (event) => {
  if (isPressed.value) {
    event.currentTarget.classList.remove('neumorph-btn-pressed');
    event.currentTarget.classList.add('neumorph-btn-released', 'hover:scale-[1.02]');
    isPressed.value = false;
  }
};

const handleMouseLeave = (event) => {
  if (isPressed.value) {
    event.currentTarget.classList.remove('neumorph-btn-pressed');
    event.currentTarget.classList.add('neumorph-btn-released', 'hover:scale-[1.02]');
    isPressed.value = false;
  }
};
</script>

<style scoped>
.neumorph-btn {
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
  font-weight: 600;
  border: none;
  background: #f0f4f8;
}

.neumorph-btn:hover {
  transform: scale(1.02);
}

.neumorph-btn-pressed {
  box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
  transform: scale(0.98);
}

.neumorph-btn-released {
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
  animation: button-pop 0.25s ease-out;
}

/* Dark mode styles */
.dark .neumorph-btn {
  box-shadow: 5px 5px 10px #151A23, -5px -5px 10px #242B38;
  background: #1e293b;
}

.dark .neumorph-btn-pressed {
  box-shadow: inset 2px 2px 5px #151A23, inset -2px -2px 5px #242B38;
}

.dark .neumorph-btn-released {
  box-shadow: 5px 5px 10px #151A23, -5px -5px 10px #242B38;
}

@keyframes button-pop {
  0% {
    transform: scale(0.98);
  }
  40% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}
</style> 