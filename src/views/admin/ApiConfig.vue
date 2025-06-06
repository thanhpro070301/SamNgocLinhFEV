<template>
  <div class="api-config-admin-page min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-4 sm:py-8">
      <div class="mb-4 sm:mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Cấu hình API</h1>
        <p class="text-gray-600 mt-1">Quản lý cấu hình kết nối API</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div class="mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">API Status</h2>
          <ApiStatus :show-details="true" />
        </div>
        
        <div class="mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Current Configuration</h2>
          
          <div class="bg-gray-50 p-3 sm:p-4 rounded-md">
            <div class="mb-3 sm:mb-4">
              <div class="text-sm font-medium text-gray-700">API URL:</div>
              <div class="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                {{ apiUrl }}
              </div>
            </div>
            
            <div class="mb-3 sm:mb-4">
              <div class="text-sm font-medium text-gray-700">Environment:</div>
              <div class="mt-1">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="isProd ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ isProd ? 'Production' : 'Development' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-4 sm:mb-6">
          <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Test API Connection</h2>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                @click="testGetProducts" 
                class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :disabled="isLoading"
              >
                Test Get Products
              </button>
              
              <button 
                @click="testGetCategories" 
                class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                :disabled="isLoading"
              >
                Test Get Categories
              </button>
            </div>
            
            <div v-if="isLoading" class="flex items-center space-x-2 py-2">
              <div class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <span class="text-sm text-gray-700">Testing API connection...</span>
            </div>
            
            <div v-if="testResult" class="mt-3 sm:mt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Result:</div>
              <div 
                class="p-3 sm:p-4 rounded-md text-sm"
                :class="testSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'"
              >
                <div class="font-medium mb-2">{{ testSuccess ? 'Success!' : 'Error!' }}</div>
                <pre class="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-48 sm:max-h-60 rounded-md bg-white bg-opacity-50 p-2">{{ testResult }}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4 sm:pt-6">
          <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Actions</h2>
          
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              @click="clearLocalStorage" 
              class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Clear Local Storage
            </button>
            
            <button 
              @click="goToLogin" 
              class="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ApiStatus from '@/components/ApiStatus.vue';

const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;
const isLoading = ref(false);
const testResult = ref('');
const testSuccess = ref(false);

async function testGetProducts() {
  isLoading.value = true;
  testResult.value = '';
  testSuccess.value = false;
  
  try {
    const response = await axios.get(`${apiUrl}/products`, {
      params: { page: 0, size: 2 },
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    testSuccess.value = true;
    testResult.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    testSuccess.value = false;
    testResult.value = `Error: ${error.message}${error.response ? `\n\nResponse: ${JSON.stringify(error.response.data, null, 2)}` : ''}`;
  } finally {
    isLoading.value = false;
  }
}

async function testGetCategories() {
  isLoading.value = true;
  testResult.value = '';
  testSuccess.value = false;
  
  try {
    const response = await axios.get(`${apiUrl}/categories`, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    testSuccess.value = true;
    testResult.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    testSuccess.value = false;
    testResult.value = `Error: ${error.message}${error.response ? `\n\nResponse: ${JSON.stringify(error.response.data, null, 2)}` : ''}`;
  } finally {
    isLoading.value = false;
  }
}

function clearLocalStorage() {
  localStorage.clear();
  alert('Local storage has been cleared. You will be redirected to the login page.');
  router.push('/auth/login');
}

function goToLogin() {
  router.push('/auth/login');
}
</script>

<style scoped>
/* Improve touch targets for mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
  }
  
  .api-config-admin-page {
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
  
  pre {
    -webkit-overflow-scrolling: touch;
  }
}
</style> 