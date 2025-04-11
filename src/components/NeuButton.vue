<template>
  <button
    class="neu-button relative overflow-hidden group"
    :class="[
      variant === 'primary' ? 'neu-primary' : 
      variant === 'secondary' ? 'neu-secondary' : 
      variant === 'accent' ? 'neu-accent' : 'neu-primary',
      size === 'sm' ? 'neu-sm' : 
      size === 'lg' ? 'neu-lg' : 'neu-md',
      disabled ? 'neu-disabled' : '',
      { 'w-full': fullWidth }
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <div class="neu-button-content flex items-center justify-center relative z-10">
      <slot name="icon-left"></slot>
      <span><slot></slot></span>
      <slot name="icon-right"></slot>
    </div>
    <div class="neu-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
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

const emit = defineEmits(['click']);

const onClick = (event) => {
  emit('click', event);
};
</script>

<style scoped>
.neu-button {
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateY(0);
}

.neu-button:active:not(.neu-disabled) {
  transform: translateY(2px);
}

/* Primary Variant */
.neu-primary {
  background: #f0fdf4;
  color: #16a34a;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.1),
    -6px -6px 12px rgba(255, 255, 255, 0.8);
}

.neu-primary:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.neu-primary .neu-glow {
  background: radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
}

/* Secondary Variant */
.neu-secondary {
  background: #ffffff;
  color: #16a34a;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.9);
}

.neu-secondary:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px rgba(255, 255, 255, 0.9);
}

.neu-secondary .neu-glow {
  background: radial-gradient(circle at center, rgba(220, 252, 231, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
}

/* Accent Variant */
.neu-accent {
  background: #dcfce7;
  color: #15803d;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.1),
    -6px -6px 12px rgba(255, 255, 255, 0.8);
}

.neu-accent:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.neu-accent .neu-glow {
  background: radial-gradient(circle at center, rgba(134, 239, 172, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
}

/* Sizes */
.neu-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.neu-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.neu-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Disabled state */
.neu-disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
  background: #f3f4f6;
  color: #9ca3af;
}

/* Dark mode support */
:global(.dark) .neu-primary {
  background: #1e293b;
  color: #4ade80;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.3),
    -6px -6px 12px rgba(30, 41, 59, 0.4);
}

:global(.dark) .neu-primary:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.3),
    inset -2px -2px 5px rgba(30, 41, 59, 0.4);
}

:global(.dark) .neu-secondary {
  background: #0f172a;
  color: #4ade80;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.4),
    -6px -6px 12px rgba(15, 23, 42, 0.3);
}

:global(.dark) .neu-secondary:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.4),
    inset -2px -2px 5px rgba(15, 23, 42, 0.3);
}

:global(.dark) .neu-accent {
  background: #0f766e;
  color: #f0fdfa;
  box-shadow: 
    6px 6px 12px rgba(0, 0, 0, 0.3),
    -6px -6px 12px rgba(15, 118, 110, 0.3);
}

:global(.dark) .neu-accent:active:not(.neu-disabled) {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.3),
    inset -2px -2px 5px rgba(15, 118, 110, 0.3);
}

:global(.dark) .neu-disabled {
  background: #1e293b;
  color: #64748b;
}

/* Button Content styles */
.neu-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style> 