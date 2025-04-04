<template>
  <div class="admin-sessions min-h-screen bg-gray-50">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Sessions title and actions -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">QUẢN LÝ PHIÊN ĐĂNG NHẬP</h1>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <button 
              @click="logoutOtherDevices" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              :disabled="isLoading"
            >
              <i class="fas fa-sign-out-alt"></i>
              <span>Đăng xuất tất cả thiết bị khác</span>
            </button>
          </div>
        </div>
        
        <!-- Current session info -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Phiên đăng nhập hiện tại</h2>
          
          <div v-if="currentSession" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="bg-green-100 p-3 rounded-full mr-4">
                <i class="fas fa-desktop text-green-600 text-xl"></i>
              </div>
              <div class="flex-grow">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ getDeviceName(currentSession.device) }}</h3>
                    <p class="text-xs text-gray-600 mt-1">
                      <i class="fas fa-map-marker-alt mr-1"></i> 
                      {{ currentSession.ipAddress }} · 
                      <i class="fas fa-clock mr-1"></i> 
                      {{ formatDate(currentSession.lastActivity) }}
                    </p>
                  </div>
                  <div class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    <i class="fas fa-circle text-green-500 mr-1 text-[8px]"></i>
                    Đang hoạt động
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  <p>
                    <span class="font-medium">User Agent:</span> 
                    {{ currentSession.device.userAgent.substring(0, 100) }}{{ currentSession.device.userAgent.length > 100 ? '...' : '' }}
                  </p>
                  <p>
                    <span class="font-medium">Đăng nhập lúc:</span> 
                    {{ formatDate(currentSession.createdAt) }}
                  </p>
                  <p>
                    <span class="font-medium">Hết hạn:</span> 
                    {{ formatDate(currentSession.expiresAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other sessions -->
        <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Phiên đăng nhập khác</h2>
            <p class="text-sm text-gray-500 mt-1">Danh sách tất cả các phiên đăng nhập của bạn trên các thiết bị khác nhau.</p>
          </div>
          
          <div v-if="otherSessions.length === 0" class="p-6 text-center">
            <i class="fas fa-tablet-alt text-gray-300 text-4xl mb-3"></i>
            <p class="text-gray-500">Không có phiên đăng nhập nào khác</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div 
              v-for="session in otherSessions" 
              :key="session.tokenId"
              class="p-4 sm:p-6 hover:bg-gray-50"
            >
              <div class="flex items-start">
                <div class="bg-gray-100 p-3 rounded-full mr-4">
                  <i class="fas fa-desktop text-gray-600 text-xl"></i>
                </div>
                <div class="flex-grow">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">{{ getDeviceName(session.device) }}</h3>
                      <p class="text-xs text-gray-600 mt-1">
                        <i class="fas fa-map-marker-alt mr-1"></i> 
                        {{ session.ipAddress }} · 
                        <i class="fas fa-clock mr-1"></i> 
                        {{ formatDate(session.lastActivity) }}
                      </p>
                    </div>
                    <button 
                      @click="logoutDevice(session.tokenId)" 
                      class="px-3 py-1 border border-red-300 text-red-600 text-xs rounded-md hover:bg-red-50 transition-colors inline-flex items-center"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-sign-out-alt mr-1"></i>
                      Đăng xuất
                    </button>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    <p>
                      <span class="font-medium">User Agent:</span> 
                      {{ session.device.userAgent.substring(0, 100) }}{{ session.device.userAgent.length > 100 ? '...' : '' }}
                    </p>
                    <p>
                      <span class="font-medium">Đăng nhập lúc:</span> 
                      {{ formatDate(session.createdAt) }}
                    </p>
                    <p>
                      <span class="font-medium">Hết hạn:</span> 
                      {{ formatDate(session.expiresAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security tips -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 class="text-md font-medium text-gray-900">Lời khuyên bảo mật</h3>
              <ul class="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>Đăng xuất khỏi các thiết bị mà bạn không còn sử dụng.</li>
                <li>Thay đổi mật khẩu định kỳ để tăng cường bảo mật.</li>
                <li>Không chia sẻ tài khoản của bạn với người khác.</li>
                <li>Sử dụng mật khẩu mạnh và khác nhau cho mỗi tài khoản.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import auth from '@/store/auth'
import sessionToken from '@/store/sessionToken'

const router = useRouter()
const isLoading = ref(false)

// Chuyển hướng nếu chưa đăng nhập
if (!auth.isAuthenticated.value) {
  router.push('/admin/login')
}

// Lấy phiên đăng nhập hiện tại
const currentSession = computed(() => sessionToken.getCurrentSession())

// Lấy các phiên đăng nhập khác
const otherSessions = computed(() => {
  const currentTokenId = sessionToken.currentToken.value
  return auth.getUserSessions.value.filter(
    session => session.tokenId !== currentTokenId
  )
})

// Đăng xuất khỏi một thiết bị
async function logoutDevice(tokenId) {
  isLoading.value = true
  try {
    // Mô phỏng gọi API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    auth.removeSession(tokenId)
    // Nếu token được xóa là token hiện tại, chuyển hướng về trang đăng nhập
    if (tokenId === sessionToken.currentToken.value) {
      router.push('/admin/login')
    }
  } catch (error) {
    console.error('Error logging out device:', error)
  } finally {
    isLoading.value = false
  }
}

// Đăng xuất khỏi tất cả thiết bị khác
async function logoutOtherDevices() {
  isLoading.value = true
  try {
    // Mô phỏng gọi API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    auth.removeOtherSessions()
  } catch (error) {
    console.error('Error logging out other devices:', error)
  } finally {
    isLoading.value = false
  }
}

// Định dạng ngày tháng
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

// Lấy tên thiết bị từ user agent
function getDeviceName(device) {
  const ua = device.userAgent.toLowerCase()
  
  // Kiểm tra hệ điều hành
  let os = 'Unknown OS'
  if (ua.includes('windows')) {
    os = 'Windows'
  } else if (ua.includes('mac os')) {
    os = 'MacOS'
  } else if (ua.includes('android')) {
    os = 'Android'
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  }
  
  // Kiểm tra trình duyệt
  let browser = 'Unknown Browser'
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome'
  } else if (ua.includes('firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari'
  } else if (ua.includes('edg')) {
    browser = 'Edge'
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera'
  }
  
  return `${browser} trên ${os} (${device.platform})`
}

// Cập nhật hoạt động định kỳ
const activityInterval = setInterval(() => {
  auth.updateActivity()
}, 60000) // Cập nhật mỗi phút

// Dọn dẹp khi component bị hủy
onUnmounted(() => {
  clearInterval(activityInterval)
})

// Khởi tạo
onMounted(() => {
  // Cập nhật hoạt động khi mở trang
  auth.updateActivity()
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