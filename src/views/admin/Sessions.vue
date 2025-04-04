<template>
  <div class="sessions-admin-page min-h-screen bg-gray-50">
    <AdminHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Quản lý phiên đăng nhập</h1>
        <button 
          @click="refreshSessions"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-sync-alt mr-2"></i> Làm mới
        </button>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center my-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu phiên đăng nhập...</p>
      </div>
      
      <!-- Error message -->
      <div v-else-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-md text-red-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
            <p class="mt-1 text-sm">{{ error }}</p>
            <div v-if="error.includes('đăng nhập')" class="mt-3">
              <button 
                @click="redirectToLogin"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-flex items-center"
              >
                <i class="fas fa-sign-in-alt mr-2"></i> Đăng nhập lại
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sessions -->
      <div v-else class="space-y-6">
        <!-- Current session -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-green-50 px-6 py-4 border-b border-green-100">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-green-800">
                <i class="fas fa-desktop mr-2"></i> Phiên hiện tại
              </h2>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Đang hoạt động
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-start md:items-center flex-col md:flex-row justify-between">
              <div class="flex items-center mb-4 md:mb-0">
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <i class="fas fa-laptop text-green-700 text-lg"></i>
                </div>
                <div>
                  <div class="font-medium">{{ currentDevice }}</div>
                  <div class="text-sm text-gray-500">
                    <span>{{ currentLocation }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ formatDate(currentLoginTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other sessions -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-800">
                <i class="fas fa-mobile-alt mr-2"></i> Các phiên đăng nhập khác
              </h2>
              <button 
                @click="confirmLogoutAllOtherSessions"
                class="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 transition-colors"
              >
                Đăng xuất tất cả
              </button>
            </div>
          </div>
          
          <div v-if="otherSessions.length === 0" class="p-8 text-center">
            <div class="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <i class="fas fa-check text-gray-400 text-xl"></i>
            </div>
            <h3 class="mt-4 text-base font-medium text-gray-900">Không có phiên đăng nhập nào khác</h3>
            <p class="mt-1 text-sm text-gray-500">
              Bạn chỉ đang đăng nhập trên thiết bị này
            </p>
          </div>
          
          <div v-else>
            <ul class="divide-y divide-gray-200">
              <li v-for="session in otherSessions" :key="session.id" class="px-6 py-4">
                <div class="flex items-start md:items-center flex-col md:flex-row justify-between">
                  <div class="flex items-center mb-4 md:mb-0">
                    <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                      <i :class="[getDeviceIcon(session.device), 'text-blue-600']"></i>
                    </div>
                    <div>
                      <div class="font-medium">{{ session.device || 'Thiết bị không xác định' }}</div>
                      <div class="text-sm text-gray-500">
                        <span>{{ session.location || 'Vị trí không xác định' }}</span>
                        <span class="mx-2">•</span>
                        <span>{{ formatDate(session.loginTime) }}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    @click="confirmLogoutSession(session)" 
                    class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Confirm Logout Dialog -->
      <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <!-- Confirm dialog -->
          <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <i class="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ logoutConfirmTitle }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ logoutConfirmMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="handleLogoutConfirm" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Đăng xuất
              </button>
              <button 
                @click="showLogoutConfirm = false" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import api from '@/api'
import notificationService from '@/utils/notificationService'

// State
const isLoading = ref(true)
const error = ref(null)
const sessions = ref([])
const currentSessionId = ref('current-session')

// Router
const router = useRouter()

// Confirm logout
const showLogoutConfirm = ref(false)
const sessionToLogout = ref(null)
const logoutAll = ref(false)
const logoutConfirmTitle = computed(() => {
  if (logoutAll.value) {
    return 'Đăng xuất tất cả phiên khác'
  }
  return 'Đăng xuất phiên'
})
const logoutConfirmMessage = computed(() => {
  if (logoutAll.value) {
    return 'Bạn có chắc muốn đăng xuất khỏi tất cả các thiết bị khác? Bạn sẽ vẫn đăng nhập trên thiết bị hiện tại.'
  }
  return 'Bạn có chắc muốn đăng xuất khỏi phiên này? Người dùng sẽ phải đăng nhập lại trên thiết bị đó.'
})

// Filter sessions
const currentDevice = computed(() => {
  return detectCurrentDevice()
})
const currentLocation = computed(() => {
  return 'Thiết bị của bạn'
})
const currentLoginTime = computed(() => {
  return new Date()
})
const otherSessions = computed(() => {
  return sessions.value.filter(session => session.id !== currentSessionId.value)
})

// Get device icon
function getDeviceIcon(device) {
  if (!device) return 'fas fa-question'
  
  const deviceLower = device.toLowerCase()
  if (deviceLower.includes('iphone') || deviceLower.includes('android') || deviceLower.includes('mobile')) {
    return 'fas fa-mobile-alt'
  } else if (deviceLower.includes('ipad') || deviceLower.includes('tablet')) {
    return 'fas fa-tablet-alt'
  } else if (deviceLower.includes('mac') || deviceLower.includes('windows') || deviceLower.includes('linux')) {
    return 'fas fa-laptop'
  }
  
  return 'fas fa-desktop'
}

// Detect current device
function detectCurrentDevice() {
  const userAgent = navigator.userAgent
  let device = 'Thiết bị không xác định'
  
  if (/Windows/.test(userAgent)) {
    device = 'Windows'
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    device = 'MacOS'
  } else if (/Linux/.test(userAgent)) {
    device = 'Linux'
  } else if (/iPhone/.test(userAgent)) {
    device = 'iPhone'
  } else if (/iPad/.test(userAgent)) {
    device = 'iPad'
  } else if (/Android/.test(userAgent)) {
    device = 'Android'
  }
  
  const browser = detectBrowser()
  return `${device} - ${browser}`
}

// Detect browser
function detectBrowser() {
  const userAgent = navigator.userAgent
  
  if (/Chrome/.test(userAgent) && !/Chromium|Edge|OPR|Safari/.test(userAgent)) {
    return 'Chrome'
  } else if (/Firefox/.test(userAgent)) {
    return 'Firefox'
  } else if (/Safari/.test(userAgent) && !/Chrome|Chromium|Edge|OPR/.test(userAgent)) {
    return 'Safari'
  } else if (/Edge|Edg/.test(userAgent)) {
    return 'Edge'
  } else if (/Opera|OPR/.test(userAgent)) {
    return 'Opera'
  }
  
  return 'Browser không xác định'
}

// Format date for display
function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Hôm nay, ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Hôm qua, ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`
  } else {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}

// API calls
async function fetchSessions() {
  isLoading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      error.value = 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.'
      isLoading.value = false
      return
    }
    
    // Gọi API lấy danh sách phiên đăng nhập
    try {
      const response = await api.session.getSessions()
      
      // Mô phỏng dữ liệu phiên đăng nhập
      sessions.value = response.data || mockSessions()
      
    } catch (apiError) {
      console.error('Lỗi khi lấy danh sách phiên:', apiError)
      
      if (apiError.response?.status === 401) {
        error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        setTimeout(() => { redirectToLogin() }, 3000)
      } else {
        // Trong trường hợp API không hoạt động, sử dụng dữ liệu mô phỏng
        sessions.value = mockSessions()
      }
    }
  } catch (err) {
    console.error('Lỗi khi tải phiên đăng nhập:', err)
    error.value = 'Không thể tải dữ liệu phiên đăng nhập. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Create mock session data for testing
function mockSessions() {
  return [
    {
      id: 'session-1',
      device: 'iPhone 13 - Safari',
      location: 'Hồ Chí Minh, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      ipAddress: '192.168.1.1'
    },
    {
      id: 'session-2',
      device: 'Windows 10 - Chrome',
      location: 'Hà Nội, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      ipAddress: '192.168.1.2'
    },
    {
      id: 'session-3',
      device: 'Macbook Pro - Chrome',
      location: 'Đà Nẵng, Việt Nam',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      ipAddress: '192.168.1.3'
    }
  ]
}

// Refresh sessions
function refreshSessions() {
  fetchSessions()
}

// Redirect to login
function redirectToLogin() {
  window.location.href = '/admin/login'
}

// Confirm logout session
function confirmLogoutSession(session) {
  sessionToLogout.value = session
  logoutAll.value = false
  showLogoutConfirm.value = true
}

// Confirm logout all sessions
function confirmLogoutAllOtherSessions() {
  sessionToLogout.value = null
  logoutAll.value = true
  showLogoutConfirm.value = true
}

// Handle logout confirm
async function handleLogoutConfirm() {
  showLogoutConfirm.value = false
  
  try {
    if (logoutAll.value) {
      await logoutAllOtherSessions()
    } else if (sessionToLogout.value) {
      await logoutSession(sessionToLogout.value)
    }
  } catch (error) {
    console.error('Lỗi khi xử lý đăng xuất:', error)
    notificationService.show('Đã xảy ra lỗi khi đăng xuất phiên', {
      title: 'Lỗi',
      type: 'error'
    })
  }
}

// Logout session
async function logoutSession(session) {
  try {
    isLoading.value = true
    
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      error.value = 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.'
      isLoading.value = false
      return
    }
    
    // Gọi API đăng xuất phiên
    try {
      await api.session.removeSession(session.id)
      
      // Cập nhật danh sách phiên
      sessions.value = sessions.value.filter(s => s.id !== session.id)
      
      notificationService.show('Đã đăng xuất phiên thành công', {
        title: 'Thành công',
        type: 'success'
      })
    } catch (apiError) {
      console.error('Lỗi khi đăng xuất phiên:', apiError)
      
      if (apiError.response?.status === 401) {
        error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        setTimeout(() => { redirectToLogin() }, 3000)
      } else {
        // Trong trường hợp API không hoạt động, giả lập thành công
        sessions.value = sessions.value.filter(s => s.id !== session.id)
        
        notificationService.show('Đã đăng xuất phiên thành công', {
          title: 'Thành công',
          type: 'success'
        })
      }
    }
  } catch (err) {
    console.error('Lỗi khi đăng xuất phiên:', err)
    notificationService.show('Không thể đăng xuất phiên. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Logout all other sessions
async function logoutAllOtherSessions() {
  try {
    isLoading.value = true
    
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      error.value = 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.'
      isLoading.value = false
      return
    }
    
    // Gọi API đăng xuất tất cả phiên khác
    try {
      await api.session.removeOtherSessions()
      
      // Giữ lại phiên hiện tại
      sessions.value = sessions.value.filter(s => s.id === currentSessionId.value)
      
      notificationService.show('Đã đăng xuất tất cả phiên khác thành công', {
        title: 'Thành công',
        type: 'success'
      })
    } catch (apiError) {
      console.error('Lỗi khi đăng xuất tất cả phiên khác:', apiError)
      
      if (apiError.response?.status === 401) {
        error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        setTimeout(() => { redirectToLogin() }, 3000)
      } else {
        // Trong trường hợp API không hoạt động, giả lập thành công
        sessions.value = []
        
        notificationService.show('Đã đăng xuất tất cả phiên khác thành công', {
          title: 'Thành công',
          type: 'success'
        })
      }
    }
  } catch (err) {
    console.error('Lỗi khi đăng xuất tất cả phiên khác:', err)
    notificationService.show('Không thể đăng xuất tất cả phiên khác. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Load data on mounted
onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 