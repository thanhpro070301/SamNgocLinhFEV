<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Auth Debugger</h1>
      
      <!-- API Connection -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">1. API Connection</h2>
        <div class="flex items-center space-x-4 mb-4">
          <button 
            @click="checkApiConnection"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading.api"
          >
            <span v-if="loading.api">Checking...</span>
            <span v-else>Check API Connection</span>
          </button>
          <div v-if="results.api" class="flex-1">
            <div :class="results.api.success ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ results.api.message }}
            </div>
            <div class="text-sm text-gray-500">
              Status: {{ results.api.status || 'N/A' }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Current Auth State -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">2. Current Auth State</h2>
        <div class="flex items-center space-x-4 mb-4">
          <button 
            @click="checkTokenState"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading.token"
          >
            <span v-if="loading.token">Checking...</span>
            <span v-else>Check Token State</span>
          </button>
          <div v-if="results.token" class="flex-1">
            <div :class="results.token.success ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ results.token.message }}
            </div>
            <div v-if="results.token.tokenInfo" class="mt-2">
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="font-medium">Token:</div>
                <div>{{ results.token.tokenInfo.token }}</div>
                
                <div class="font-medium">Expires At:</div>
                <div>{{ results.token.tokenInfo.expiresAt }}</div>
                
                <div class="font-medium">Expired:</div>
                <div>{{ results.token.tokenInfo.isExpired ? 'Yes' : 'No' }}</div>
                
                <div class="font-medium">Time Left:</div>
                <div>{{ results.token.tokenInfo.timeLeftSeconds }} seconds</div>
                
                <div class="font-medium">Server Verified:</div>
                <div>{{ results.token.tokenInfo.serverVerified ? 'Yes' : 'No' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Storage Sync -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">3. Storage Sync</h2>
        <div class="flex items-center space-x-4 mb-4">
          <button 
            @click="checkStorageSync"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading.storage"
          >
            <span v-if="loading.storage">Checking...</span>
            <span v-else>Check Storage Sync</span>
          </button>
          <div v-if="results.storage" class="flex-1">
            <div :class="results.storage.success ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ results.storage.message }}
            </div>
            <div v-if="results.storage.differences" class="mt-2">
              <div v-for="(diff, key) in results.storage.differences" :key="key" class="mb-2">
                <div class="font-medium">{{ key }}:</div>
                <div class="ml-4 text-sm">
                  <div>localStorage: {{ diff.localStorage || 'null' }}</div>
                  <div>sessionStorage: {{ diff.sessionStorage || 'null' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Test Login -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">4. Test Login</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            v-model="loginTest.email" 
            class="w-full p-2 border rounded"
            placeholder="Enter email for testing"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            v-model="loginTest.password" 
            class="w-full p-2 border rounded"
            placeholder="Enter password"
          />
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="testLogin"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            :disabled="loading.login || !loginTest.email || !loginTest.password"
          >
            <span v-if="loading.login">Testing...</span>
            <span v-else>Test Login</span>
          </button>
          <div v-if="results.login" class="flex-1">
            <div :class="results.login.success ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ results.login.message }}
            </div>
            <div v-if="results.login.loginInfo" class="mt-2">
              <div v-if="results.login.success" class="text-sm">
                <div><strong>Token:</strong> {{ results.login.loginInfo.token }}</div>
                <div><strong>Expires:</strong> {{ results.login.loginInfo.expiresAt }}</div>
                <div v-if="results.login.loginInfo.user">
                  <strong>User:</strong> {{ results.login.loginInfo.user.name }} ({{ results.login.loginInfo.user.role }})
                </div>
              </div>
              <div v-else class="text-sm text-red-500">
                <pre>{{ JSON.stringify(results.login.loginInfo, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fix Auth State -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">5. Auth State Tools</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            @click="clearAllStorage"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear All Auth Storage
          </button>
          <button 
            @click="syncStorage"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Sync Storage
          </button>
          <button 
            @click="resetAuthStore"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Reset Auth Store
          </button>
          <button 
            @click="goToLogin"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go To Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import sessionToken from '@/store/sessionToken'
import apiTestHelper from '@/utils/apiTestHelper'

const router = useRouter()
const auth = useAuthStore()

// Trạng thái loading
const loading = reactive({
  api: false,
  token: false,
  storage: false,
  login: false
})

// Kết quả kiểm tra
const results = reactive({
  api: null,
  token: null,
  storage: null,
  login: null
})

// Dữ liệu test login
const loginTest = reactive({
  email: '',
  password: ''
})

// Kiểm tra kết nối API
async function checkApiConnection() {
  loading.api = true
  try {
    results.api = await apiTestHelper.checkApiConnection()
  } catch (error) {
    results.api = {
      success: false,
      message: `Error checking API: ${error.message}`,
      status: 0
    }
  } finally {
    loading.api = false
  }
}

// Kiểm tra trạng thái token
async function checkTokenState() {
  loading.token = true
  try {
    results.token = await apiTestHelper.checkCurrentToken()
  } catch (error) {
    results.token = {
      success: false,
      message: `Error checking token: ${error.message}`,
      tokenInfo: null
    }
  } finally {
    loading.token = false
  }
}

// Kiểm tra đồng bộ storage
function checkStorageSync() {
  loading.storage = true
  try {
    results.storage = apiTestHelper.checkStorageSync()
  } catch (error) {
    results.storage = {
      success: false,
      message: `Error checking storage: ${error.message}`,
      differences: null
    }
  } finally {
    loading.storage = false
  }
}

// Test đăng nhập
async function testLogin() {
  if (!loginTest.email || !loginTest.password) return
  
  loading.login = true
  try {
    results.login = await apiTestHelper.testLogin(loginTest.email, loginTest.password)
  } catch (error) {
    results.login = {
      success: false,
      message: `Error testing login: ${error.message}`,
      loginInfo: null
    }
  } finally {
    loading.login = false
  }
}

// Xóa tất cả storage
function clearAllStorage() {
  try {
    sessionToken.resetAll()
    
    // Double-check reset
    localStorage.removeItem('authToken')
    localStorage.removeItem('admin_current_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('tokenExpiresAt')
    
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('admin_current_token')
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('tokenExpiresAt')
    
    alert('All auth storage cleared successfully')
    
    // Refresh kết quả
    checkStorageSync()
    checkTokenState()
  } catch (error) {
    alert(`Error clearing storage: ${error.message}`)
  }
}

// Đồng bộ storage
function syncStorage() {
  try {
    // Đọc từ localStorage (ưu tiên) hoặc sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    const adminToken = localStorage.getItem('admin_current_token') || sessionStorage.getItem('admin_current_token')
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true'
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser')
    const expiresAt = localStorage.getItem('tokenExpiresAt') || sessionStorage.getItem('tokenExpiresAt')
    
    // Lưu vào cả hai storage
    if (token) {
      localStorage.setItem('authToken', token)
      sessionStorage.setItem('authToken', token)
    }
    
    if (adminToken) {
      localStorage.setItem('admin_current_token', adminToken)
      sessionStorage.setItem('admin_current_token', adminToken)
    }
    
    localStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : 'false')
    sessionStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : 'false')
    
    if (userStr) {
      localStorage.setItem('currentUser', userStr)
      sessionStorage.setItem('currentUser', userStr)
    }
    
    if (expiresAt) {
      localStorage.setItem('tokenExpiresAt', expiresAt)
      sessionStorage.setItem('tokenExpiresAt', expiresAt)
    }
    
    alert('Storage synchronized successfully')
    
    // Refresh kết quả
    checkStorageSync()
  } catch (error) {
    alert(`Error synchronizing storage: ${error.message}`)
  }
}

// Reset auth store
async function resetAuthStore() {
  try {
    auth.stopSessionCheck()
    await auth.init()
    auth.startSessionCheck()
    
    alert('Auth store reset and reinitialized')
    checkTokenState()
  } catch (error) {
    alert(`Error resetting auth store: ${error.message}`)
  }
}

// Chuyển đến trang login
function goToLogin() {
  router.push('/auth/login')
}
</script> 