<template>
  <div class="glassmorphism-card rounded-xl overflow-hidden">
    <div v-if="!orders || orders.length === 0" class="p-10 text-center text-gray-500 flex flex-col items-center">
      <svg class="h-12 w-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h14.625c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5L5.625 14.25m0 0l1.5-1.5M5.625 14.25l-1.5-1.5m1.5 1.5a1.125 1.125 0 01-1.125-1.125V6.75m14.625 6L18.375 14.25m0 0l-1.5-1.5m1.5 1.5l1.5-1.5m-1.5 1.5a1.125 1.125 0 00-1.125-1.125V6.75m-3 7.5l-1.5-1.5M15 14.25l1.5-1.5" />
      </svg>
      <span>Không có đơn hàng nào</span>
    </div>
    
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th v-for="header in headers" :key="header.value" 
                  :class="[
                    'px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider',
                    header.class ? header.class : '',
                    header.align === 'right' ? 'text-right' : 'text-left',
                    'text-gray-500 dark:text-gray-300'
                  ]"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-slate-800/50 dark:divide-gray-700">
            <tr v-for="order in orders" :key="order.id" 
                class="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all duration-150 cursor-pointer"
                @click="$emit('order-click', order.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  #{{ order.id }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ order.shippingName }}
                </div>
              </td>
              
              <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(order.createdAt) }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="status-badge px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusColor(order.status)"
                  @mouseover="showTooltip($event, getStatusDescription(order.status))"
                  @mouseout="hideTooltip"
                >
                  {{ getStatusName(order.status) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 text-right">
                {{ formatCurrency(order.totalAmount) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button 
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none"
                  @click.stop="$emit('view-detail', order.id)"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 flex border-t border-gray-200 dark:border-gray-700">
        <slot name="actions">
          <div class="flex justify-end w-full">
            <button 
              @click="$emit('view-all')"
              class="neumorph-btn inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-green-600 dark:text-green-400 transition-all duration-200"
            >
              Xem tất cả đơn hàng
              <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </slot>
      </div>
      
      <!-- Tooltip -->
      <div v-show="tooltip.visible" ref="tooltipEl" class="tooltip" :style="tooltip.style">
        {{ tooltip.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => [
      { text: 'ID', value: 'id' },
      { text: 'Khách hàng', value: 'shippingName' },
      { text: 'Ngày đặt', value: 'createdAt', class: 'hidden sm:table-cell' },
      { text: 'Trạng thái', value: 'status' },
      { text: 'Giá trị', value: 'totalAmount', align: 'right' },
      { text: '', value: 'actions', align: 'right' }
    ]
  }
});

const emit = defineEmits(['view-all', 'view-detail', 'order-click']);
const tooltipEl = ref(null);
const tooltip = reactive({
  visible: false,
  text: '',
  style: {
    top: '0px',
    left: '0px'
  }
});

// Format VND currency
const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  });
  return formatter.format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Get status name
const getStatusName = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
};

// Get status description 
const getStatusDescription = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Đơn hàng đã được đặt nhưng chưa được xác nhận';
    case 'PROCESSING':
      return 'Đơn hàng đang được xử lý và chuẩn bị giao';
    case 'COMPLETED':
      return 'Đơn hàng đã giao thành công';
    case 'CANCELLED':
      return 'Đơn hàng đã bị hủy';
    default:
      return '';
  }
};

// Show tooltip
const showTooltip = (event, text) => {
  tooltip.text = text;
  tooltip.visible = true;
  
  // Position the tooltip
  const rect = event.target.getBoundingClientRect();
  tooltip.style = {
    top: `${rect.bottom + window.scrollY + 10}px`,
    left: `${rect.left + window.scrollX - 50}px`
  };
};

// Hide tooltip
const hideTooltip = () => {
  tooltip.visible = false;
};
</script>

<style scoped>
.glassmorphism-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dark .glassmorphism-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(30, 41, 59, 0.2);
}

.status-badge {
  transition: all 0.2s ease;
}

.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.neumorph-btn {
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
  background: #f0f4f8;
  border: none;
  font-weight: 600;
}

.neumorph-btn:hover {
  transform: translateY(-1px);
}

.neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
  transform: translateY(0);
}

.dark .neumorph-btn {
  box-shadow: 3px 3px 6px #151A23, -3px -3px 6px #242B38;
  background: #1e293b;
}

.dark .neumorph-btn:active {
  box-shadow: inset 2px 2px 5px #151A23, inset -2px -2px 5px #242B38;
}

.tooltip {
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  max-width: 300px;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
</style> 