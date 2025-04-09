<template>
  <div class="api-status" :class="statusClass">
    <div class="api-status-indicator">
      <div class="status-dot"></div>
      <span class="status-text">{{ statusText }}</span>
    </div>
    <div v-if="showDetails" class="api-details">
      <p>API URL: {{ apiUrl }}</p>
      <button @click="checkApiStatus" class="check-button">Check Connection</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  showDetails: {
    type: Boolean,
    default: false
  }
});

const apiUrl = import.meta.env.VITE_API_URL;
const status = ref('checking');

const statusText = computed(() => {
  switch (status.value) {
    case 'online': return 'API Online';
    case 'offline': return 'API Offline';
    case 'checking': return 'Checking API...';
    case 'error': return 'API Error';
    default: return 'Unknown';
  }
});

const statusClass = computed(() => {
  return {
    'status-online': status.value === 'online',
    'status-offline': status.value === 'offline',
    'status-checking': status.value === 'checking',
    'status-error': status.value === 'error'
  };
});

async function checkApiStatus() {
  status.value = 'checking';
  
  try {
    const response = await axios.get(`${apiUrl}/health-check`, {
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.status === 200) {
      status.value = 'online';
    } else {
      status.value = 'error';
    }
  } catch (error) {
    console.error('API connection error:', error);
    status.value = 'offline';
  }
}

onMounted(() => {
  checkApiStatus();
});
</script>

<style scoped>
.api-status {
  display: inline-flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 8px;
}

.api-status-indicator {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-online .status-dot {
  background-color: #4caf50;
}

.status-offline .status-dot {
  background-color: #f44336;
}

.status-checking .status-dot {
  background-color: #ff9800;
  animation: pulse 1.5s infinite;
}

.status-error .status-dot {
  background-color: #ff9800;
}

.api-details {
  margin-top: 8px;
  font-size: 10px;
}

.check-button {
  padding: 3px 6px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  margin-top: 4px;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style> 