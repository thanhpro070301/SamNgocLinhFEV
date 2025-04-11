<template>
  <div class="glassmorphism-card p-6 rounded-xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ title }}</h3>
      <div class="flex space-x-2">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div class="chart-container" :style="{ height: height }">
      <!-- Placeholder chart with actual visual elements -->
      <div v-if="!hasSlotContent" class="w-full h-full flex flex-col">
        <!-- Simple bar chart placeholder -->
        <div class="flex-1 flex items-end justify-between px-6 pb-6">
          <div v-for="(value, index) in sampleData" :key="index" 
               class="chart-bar-container flex flex-col items-center">
            <div class="text-xs text-gray-500 mb-3">{{ formatValue(value) }}</div>
            <div class="chart-bar bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
                 :style="{ height: `${value/maxValue * 100}%`, width: '24px' }"></div>
            <div class="text-xs text-gray-500 mt-3">{{ getMonthLabel(index) }}</div>
          </div>
        </div>
        
        <!-- X-axis line -->
        <div class="h-px w-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
      </div>
      
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  height: {
    type: String,
    default: '300px'
  },
  data: {
    type: Array,
    default: () => []
  },
  isRevenue: {
    type: Boolean,
    default: false
  }
});

const slots = useSlots();
const hasSlotContent = computed(() => !!slots.default);

// Sample data for placeholder chart
const sampleData = ref([58, 78, 95, 71, 89, 83]);
const maxValue = computed(() => Math.max(...sampleData.value));

// Get month label for x-axis
function getMonthLabel(index) {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
  return months[index];
}

// Format values, especially for currency
function formatValue(value) {
  // Check if it's a large number (likely revenue)
  if (value > 10000) {
    // Format as currency
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }
  // Otherwise format as regular number
  return value.toLocaleString();
}

// Initialize with random data on mount
onMounted(() => {
  // Use provided data or generate random data
  if (props.data && props.data.length > 0) {
    sampleData.value = props.data;
  } else {
    // Generate random sample data between 40 and 100
    sampleData.value = Array.from({length: 6}, () => Math.floor(Math.random() * 60) + 40);
  }
});
</script>

<style scoped>
.glassmorphism-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glassmorphism-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.dark .glassmorphism-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(30, 41, 59, 0.2);
}

.chart-container {
  transition: all 0.5s ease;
  position: relative;
  margin-top: 1rem;
}

.chart-bar {
  transition: height 1s ease-out;
  min-height: 4px;
}

.chart-bar-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.5rem;
}

/* Add spacing between bars */
.chart-bar-container + .chart-bar-container {
  margin-left: 1rem;
}
</style> 