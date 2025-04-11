<template>
  <div class="api-status relative">
    <button 
      @click="toggleDetails"
      class="px-2 py-1 rounded-md text-xs flex items-center transition-colors duration-200"
      :class="statusStyle"
    >
      <!-- API Status indicator -->
      <span class="relative mr-1.5 flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="pingColor"></span>
        <span class="relative inline-flex rounded-full h-2 w-2" :class="dotColor"></span>
      </span>
      
      <span class="whitespace-nowrap">API: {{ statusText }}</span>
    </button>
    
    <div 
      v-if="showDetailsValue && showDetails" 
      class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4"
      style="top: 100%"
    >
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-medium text-gray-700">API Status</h3>
        <button @click="checkApiStatus" class="text-xs text-blue-600 hover:text-blue-800">
          <i class="fas fa-sync-alt mr-1"></i> Kiểm tra lại
        </button>
      </div>
      
      <div class="text-xs space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Trạng thái:</span>
          <span class="px-1.5 py-0.5 rounded-full text-xs" :class="statusStyle">{{ statusText }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Endpoint:</span>
          <span class="text-gray-800 font-medium">{{ shortEndpoint }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Kiểm tra lần cuối:</span>
          <span class="text-gray-800">{{ lastChecked }}</span>
        </div>
        
        <!-- Thông tin chi tiết từ API -->
        <div v-if="apiDetails && apiDetails.data" class="mt-3 pt-3 border-t border-gray-100">
          <div class="text-gray-700 font-medium mb-1">Thông tin từ API:</div>
          
          <div v-if="apiDetails.data.version" class="flex justify-between">
            <span class="text-gray-600">Phiên bản:</span>
            <span class="text-gray-800">{{ apiDetails.data.version }}</span>
          </div>
          
          <div v-if="apiDetails.data.status" class="flex justify-between">
            <span class="text-gray-600">Trạng thái hệ thống:</span>
            <span class="text-gray-800">{{ apiDetails.data.status }}</span>
          </div>
          
          <div v-if="apiDetails.data.timestamp" class="flex justify-between">
            <span class="text-gray-600">Thời gian server:</span>
            <span class="text-gray-800">{{ formatTimestamp(apiDetails.data.timestamp) }}</span>
          </div>
          
          <!-- System info nếu có -->
          <div v-if="apiDetails.data.systemInfo" class="mt-2">
            <div class="text-xs text-blue-600 cursor-pointer" @click="toggleSystemInfo">
              {{ showSystemInfo ? 'Ẩn thông tin hệ thống' : 'Xem thông tin hệ thống' }}
            </div>
            
            <div v-if="showSystemInfo" class="mt-1 p-2 bg-gray-50 rounded-md text-xs">
              <div v-for="(value, key) in apiDetails.data.systemInfo" :key="key" class="flex justify-between mb-1">
                <span class="text-gray-500">{{ formatKey(key) }}:</span>
                <span class="text-gray-700">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  showDetails: {
    type: Boolean,
    default: false
  }
})

// State
const apiStatus = ref('online') // 'online', 'offline', 'slow'
const showDetailsValue = ref(false)
const lastCheckedDate = ref(new Date())
const apiDetails = ref(null)
const showSystemInfo = ref(false)

// Computed
const statusText = computed(() => {
  return apiStatus.value.charAt(0).toUpperCase() + apiStatus.value.slice(1)
})

const statusStyle = computed(() => {
  switch (apiStatus.value) {
    case 'online':
      return 'bg-green-100 text-green-800'
    case 'offline':
      return 'bg-red-100 text-red-800'
    case 'slow':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const dotColor = computed(() => {
  switch (apiStatus.value) {
    case 'online':
      return 'bg-green-500' 
    case 'offline':
      return 'bg-red-500'
    case 'slow':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
})

const pingColor = computed(() => {
  switch (apiStatus.value) {
    case 'online':
      return 'bg-green-400' 
    case 'offline':
      return 'bg-red-400'
    case 'slow':
      return 'bg-yellow-400'
    default:
      return 'bg-gray-400'
  }
})

const apiEndpoint = computed(() => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
})

// Hiển thị endpoint ngắn gọn
const shortEndpoint = computed(() => {
  const url = apiEndpoint.value
  try {
    // Nếu là URL đầy đủ, chỉ hiển thị hostname
    if (url.startsWith('http')) {
      const urlObj = new URL(url)
      return urlObj.hostname
    }
    // Nếu là đường dẫn tương đối, hiển thị path
    return url.split('/').pop() || url
  } catch (e) {
    return url
  }
})

// Danh sách các endpoints thay thế để kiểm tra
const healthEndpoints = computed(() => [
  `${apiEndpoint.value}/health`,
  `${apiEndpoint.value}/api/health`,
  `${apiEndpoint.value}/status`,
  `${apiEndpoint.value}`  // Fallback to root API
])

const lastChecked = computed(() => {
  return lastCheckedDate.value.toLocaleTimeString()
})

// Methods
const toggleDetails = () => {
  showDetailsValue.value = !showDetailsValue.value
}

// Check API status
const checkApiStatus = async () => {
  let isApiAvailable = false;
  let responseDetails = null;
  
  // Thử kiểm tra từng endpoint cho đến khi thành công
  for (const endpoint of healthEndpoints.value) {
    try {
      console.log('Kiểm tra API status:', endpoint);
      const startTime = Date.now();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 giây timeout
      
      const response = await fetch(endpoint, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      
      // Thử đọc response body nếu response.ok
      let responseBody = null;
      if (response.ok) {
        try {
          responseBody = await response.json();
        } catch (e) {
          console.warn('Không thể parse response JSON:', e);
        }
      }
      
      console.log(`API response từ ${endpoint}:`, {
        status: response.status,
        ok: response.ok,
        responseTime: `${responseTime}ms`,
        body: responseBody
      });
      
      // Nếu có phản hồi thành công và chứa success: true
      if (response.ok && (!responseBody || responseBody.success !== false)) {
        isApiAvailable = true;
        responseDetails = responseBody;
        
        // Cập nhật trạng thái dựa trên thời gian phản hồi
        if (responseTime > 1000) {
          apiStatus.value = 'slow';
        } else {
          apiStatus.value = 'online';
        }
        
        // Tìm thấy endpoint hoạt động, dừng vòng lặp
        break;
      }
    } catch (error) {
      console.warn(`Lỗi khi kiểm tra endpoint ${endpoint}:`, error);
      // Tiếp tục thử endpoint khác
    }
  }
  
  // Nếu tất cả các endpoint đều không phản hồi
  if (!isApiAvailable) {
    console.error('Tất cả các API endpoints đều không phản hồi');
    apiStatus.value = 'offline';
    responseDetails = null;
    
    // Optional: If you want to show API as online even if health checks fail
    // Comment this out if you want accurate status checking
    // apiStatus.value = 'online'; // Force online status for development
  }
  
  // Lưu thông tin API cho component
  apiDetails.value = responseDetails;
  lastCheckedDate.value = new Date();
}

// Lifecycle
onMounted(() => {
  checkApiStatus()
  // Check every 60 seconds
  const interval = setInterval(checkApiStatus, 60000)
  
  // Clean up
  onUnmounted(() => {
    clearInterval(interval)
  })
})

// System info methods
const toggleSystemInfo = () => {
  showSystemInfo.value = !showSystemInfo.value
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

const formatKey = (key) => {
  // Implement your formatting logic here based on the key
  return key;
}
</script>

<style scoped>
.api-status {
  position: relative;
}
</style> 