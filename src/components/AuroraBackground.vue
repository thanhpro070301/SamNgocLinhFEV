<template>
  <div class="aurora-background fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div 
      v-for="(blob, index) in blobs" 
      :key="index" 
      class="blob absolute rounded-full opacity-20 blur-3xl" 
      :style="{
        width: `${blob.size}px`,
        height: `${blob.size}px`,
        left: `${blob.x}%`,
        top: `${blob.y}%`,
        backgroundColor: blob.color,
        animation: `float-${index} ${blob.duration}s ease-in-out infinite`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const blobs = ref([
  { 
    x: 20, y: 10, size: 400, 
    color: 'rgba(134, 239, 172, 0.7)', // green-300
    duration: 25 
  },
  { 
    x: 70, y: 30, size: 350, 
    color: 'rgba(187, 247, 208, 0.5)', // green-200 
    duration: 30 
  },
  { 
    x: 40, y: 70, size: 500, 
    color: 'rgba(220, 252, 231, 0.6)', // green-100
    duration: 35 
  },
  { 
    x: 60, y: 50, size: 450, 
    color: 'rgba(134, 239, 172, 0.4)', // green-300 with less opacity
    duration: 40 
  },
]);

onMounted(() => {
  // Add random keyframe animations
  const styleSheet = document.createElement('style');
  
  blobs.value.forEach((_, index) => {
    const keyframes = `
      @keyframes float-${index} {
        0% {
          transform: translate(0, 0) scale(1);
        }
        50% {
          transform: translate(${Math.random() * 10 - 5}%, ${Math.random() * 10 - 5}%) scale(${1 + Math.random() * 0.2});
        }
        100% {
          transform: translate(0, 0) scale(1);
        }
      }
    `;
    styleSheet.appendChild(document.createTextNode(keyframes));
  });
  
  document.head.appendChild(styleSheet);
});
</script>

<style scoped>
.aurora-background {
  background: linear-gradient(to bottom right, rgba(240, 253, 244, 0.3), rgba(255, 255, 255, 0.6));
}

.blob {
  will-change: transform;
  filter: blur(40px);
  mix-blend-mode: normal;
  transition: all 0.3s ease;
}
</style> 