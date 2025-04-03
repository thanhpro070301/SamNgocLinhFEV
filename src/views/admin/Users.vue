<template>
  <div>
    <!-- Actions Bar -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-4">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm người dùng..." 
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          >
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select class="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Tất cả vai trò</option>
          <option value="user">Khách hàng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
      >
        <i class="fas fa-user-plus"></i>
        Thêm người dùng
      </button>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NGƯỜI DÙNG
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              EMAIL
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SỐ ĐIỆN THOẠI
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              VAI TRÒ
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TRẠNG THÁI
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              THAO TÁC
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mr-3">
                  <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover">
                </div>
                <div class="max-w-xs">
                  <div class="font-medium text-gray-900 truncate">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 truncate max-w-xs">{{ user.email }}</td>
            <td class="px-6 py-4 text-gray-600">{{ user.phone }}</td>
            <td class="px-6 py-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-purple-100 text-purple-700': user.role === 'admin',
                  'bg-blue-100 text-blue-700': user.role === 'user'
                }"
              >
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': user.status === 'active',
                  'bg-red-100 text-red-700': user.status === 'inactive'
                }"
              >
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex gap-3 items-center px-2">
                <button 
                  @click="viewUser(user)"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors shadow-sm"
                  title="Xem chi tiết"
                  type="button"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  @click="editUser(user)"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                  title="Chỉnh sửa"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="deleteUser(user)"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                  title="Xóa"
                  type="button"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-500">
        Hiển thị 1-10 trong số 50 người dùng
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="px-3 py-1 border border-gray-300 rounded-md bg-green-600 text-white">1</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveUser" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input 
                  v-model="userForm.name"
                  type="text" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="userForm.email"
                  type="email" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  v-model="userForm.phone"
                  type="tel" 
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select 
                  v-model="userForm.role"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="user">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  v-model="userForm.status"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                <div class="flex items-center gap-4">
                  <div class="flex-1">
                    <label class="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <i class="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                      <span class="text-sm text-gray-500">Chọn file hoặc kéo thả vào đây</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        class="hidden" 
                        @change="handleImageUpload"
                      />
                    </label>
                  </div>
                  <div v-if="userForm.avatar" class="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 relative">
                    <img :src="userForm.avatar" alt="Preview" class="w-full h-full object-cover">
                    <button 
                      @click="removeImage" 
                      type="button" 
                      class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                {{ editingUser ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Thông tin người dùng</h3>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-4 mb-6">
            <img :src="selectedUser?.avatar" :alt="selectedUser?.name" class="w-20 h-20 rounded-full object-cover">
            <div>
              <h4 class="text-xl font-semibold text-gray-900">{{ selectedUser?.name }}</h4>
              <p class="text-gray-600">{{ getRoleText(selectedUser?.role) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-gray-900">{{ selectedUser?.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Số điện thoại</p>
              <p class="text-gray-900">{{ selectedUser?.phone }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Ngày tham gia</p>
              <p class="text-gray-900">{{ formatDate(selectedUser?.joinDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Trạng thái</p>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-700': selectedUser?.status === 'active',
                  'bg-red-100 text-red-700': selectedUser?.status === 'inactive'
                }"
              >
                {{ getStatusText(selectedUser?.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample data
const users = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    role: 'admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A',
    joinDate: '2024-01-01'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    role: 'user',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B',
    joinDate: '2024-02-15'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0369852147',
    role: 'user',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C',
    joinDate: '2024-03-01'
  }
])

const showAddModal = ref(false)
const showViewModal = ref(false)
const editingUser = ref(null)
const selectedUser = ref(null)
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
  avatar: ''
})

const getRoleText = (role) => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên'
    case 'user':
      return 'Khách hàng'
    default:
      return role
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Hoạt động'
    case 'inactive':
      return 'Không hoạt động'
    default:
      return status
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const viewUser = (user) => {
  selectedUser.value = user
  showViewModal.value = true
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = { ...user }
  showAddModal.value = true
}

const deleteUser = (user) => {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    users.value = users.value.filter(u => u.id !== user.id)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    avatar: ''
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedUser.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userForm.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  userForm.value.avatar = ''
}

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    users.value[index] = { 
      ...users.value[index], 
      ...userForm.value 
    }
  } else {
    // Add new user
    users.value.push({
      id: users.value.length + 1,
      ...userForm.value,
      avatar: userForm.value.avatar || `https://ui-avatars.com/api/?name=${userForm.value.name.replace(' ', '+')}`,
      joinDate: new Date().toISOString().split('T')[0]
    })
  }
  closeModal()
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 200px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

/* Đảm bảo các nút thao tác luôn hiển thị */
td button {
  position: relative;
  z-index: 10;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Tăng độ nổi bật khi hover */
td button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Đảm bảo cell có đủ không gian cho nút */
td:last-child {
  min-width: 140px;
}
</style> 