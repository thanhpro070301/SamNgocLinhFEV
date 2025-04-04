<template>
  <div class="categories-management admin-dashboard bg-gray-50 min-h-screen">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
          <button 
            @click="openAddModal"
            class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <i class="fas fa-plus"></i>
            Thêm danh mục mới
          </button>
        </div>
        
        <!-- Actions Bar -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div class="flex items-center gap-4 flex-grow">
            <div class="relative flex-grow max-w-md">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Tìm kiếm danh mục..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div class="flex-shrink-0">
              <select 
                v-model="statusFilter"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Categories Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TÊN DANH MỤC
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLUG
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DANH MỤC CHA
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SỐ SẢN PHẨM
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TRẠNG THÁI
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in filteredCategories" :key="category.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                      <i class="fas fa-folder"></i>
                    </div>
                    <div class="font-medium text-gray-900">{{ category.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ category.slug }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getParentCategoryName(category.parent_id) || '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ category.productCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex px-2 py-1 text-xs font-medium rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`">
                    {{ category.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-3 items-center px-2">
                    <button 
                      @click="editCategory(category)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                      title="Chỉnh sửa"
                      type="button"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleCategoryStatus(category)"
                      class="w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-colors"
                      :class="category.status === 'active' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                      :title="category.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'"
                      type="button"
                    >
                      <i :class="category.status === 'active' ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                    </button>
                    <button 
                      @click="confirmDelete(category.id)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                      title="Xóa"
                      type="button"
                      :disabled="category.productCount > 0"
                      :class="{ 'opacity-50 cursor-not-allowed': category.productCount > 0 }"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCategories.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-500">
            Hiển thị {{ filteredCategories.length }} trên tổng số {{ categories.length }} danh mục
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
        
        <!-- Add/Edit Category Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}
              </h3>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveCategory">
                <div class="grid gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="categoryForm.name"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      @input="generateSlug"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Slug <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="categoryForm.slug"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                    <p class="text-xs text-gray-500 mt-1">Slug được sử dụng trong URL, chỉ bao gồm chữ thường, số và dấu gạch ngang.</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                    <select 
                      v-model="categoryForm.parent_id"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option :value="null">Không có</option>
                      <option 
                        v-for="category in categories.filter(c => c.id !== (isEditMode ? categoryForm.id : null))" 
                        :key="category.id" 
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea 
                      v-model="categoryForm.description"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select 
                      v-model="categoryForm.status"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end gap-3">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                  >
                    {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <i class="fas fa-exclamation-triangle text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
              <p class="text-gray-500">Bạn có chắc chắn muốn xóa danh mục này? Thao tác này không thể hoàn tác.</p>
            </div>
            <div class="mt-6 flex justify-center gap-3">
              <button 
                type="button"
                @click="isDeleteModalOpen = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                type="button"
                @click="deleteCategory"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

// Sample data - replace with API calls in production
const categories = ref([
  {
    id: 1,
    name: 'Sâm tươi',
    slug: 'sam-tuoi',
    description: 'Các sản phẩm sâm Ngọc Linh tươi',
    parent_id: null,
    status: 'active',
    productCount: 10
  },
  {
    id: 2,
    name: 'Cao sâm',
    slug: 'cao-sam',
    description: 'Các sản phẩm cao sâm Ngọc Linh',
    parent_id: null,
    status: 'active',
    productCount: 5
  },
  {
    id: 3,
    name: 'Rượu sâm',
    slug: 'ruou-sam',
    description: 'Các loại rượu ngâm sâm Ngọc Linh',
    parent_id: null,
    status: 'active',
    productCount: 3
  },
  {
    id: 4,
    name: 'Sâm tươi 10 năm',
    slug: 'sam-tuoi-10-nam',
    description: 'Sâm tươi có tuổi đời 10 năm',
    parent_id: 1,
    status: 'active',
    productCount: 2
  },
  {
    id: 5,
    name: 'Sâm tươi 15 năm',
    slug: 'sam-tuoi-15-nam',
    description: 'Sâm tươi có tuổi đời 15 năm',
    parent_id: 1,
    status: 'active',
    productCount: 3
  },
  {
    id: 6,
    name: 'Trà sâm',
    slug: 'tra-sam',
    description: 'Các sản phẩm trà sâm Ngọc Linh',
    parent_id: 2,
    status: 'inactive',
    productCount: 0
  }
])

// Search and filter
const searchQuery = ref('')
const statusFilter = ref('all')

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const isDeleteModalOpen = ref(false)
const deleteId = ref(null)

// Category form
const categoryForm = ref({
  id: null,
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  status: 'active'
})

// Filtered categories based on search query and status filter
const filteredCategories = computed(() => {
  let result = [...categories.value]
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(category => 
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    )
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(category => category.status === statusFilter.value)
  }
  
  return result
})

// Get parent category name
const getParentCategoryName = (parentId) => {
  if (!parentId) return null
  const parent = categories.value.find(c => c.id === parentId)
  return parent ? parent.name : null
}

// Open modal for adding a new category
const openAddModal = () => {
  categoryForm.value = {
    id: null,
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    status: 'active'
  }
  isEditMode.value = false
  isModalOpen.value = true
}

// Open modal for editing a category
const editCategory = (category) => {
  categoryForm.value = { ...category }
  isEditMode.value = true
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
}

// Generate slug from name
const generateSlug = () => {
  if (!categoryForm.value.name) return
  
  // Only generate slug automatically if it's a new category or slug hasn't been manually edited
  if (!isEditMode.value || categoryForm.value.slug === '') {
    categoryForm.value.slug = categoryForm.value.name
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
      .replace(/[đĐ]/g, 'd') // Replace Vietnamese đ/Đ
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .trim()
  }
}

// Save category (create or update)
const saveCategory = () => {
  if (isEditMode.value) {
    // Update existing category
    const index = categories.value.findIndex(c => c.id === categoryForm.value.id)
    if (index !== -1) {
      categories.value[index] = { ...categoryForm.value }
    }
  } else {
    // Create new category
    const newId = Math.max(0, ...categories.value.map(c => c.id)) + 1
    categories.value.push({
      ...categoryForm.value,
      id: newId,
      productCount: 0
    })
  }
  
  // Close modal
  closeModal()
  
  // Show success message (in a real app, you would use a toast or alert)
  alert(isEditMode.value ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục mới thành công!')
}

// Toggle category status
const toggleCategoryStatus = (category) => {
  const index = categories.value.findIndex(c => c.id === category.id)
  if (index !== -1) {
    categories.value[index].status = category.status === 'active' ? 'inactive' : 'active'
  }
}

// Open confirmation modal for deleting a category
const confirmDelete = (id) => {
  const category = categories.value.find(c => c.id === id)
  
  // Prevent deletion if category has products
  if (category && category.productCount > 0) {
    alert('Không thể xóa danh mục đang có sản phẩm. Vui lòng di chuyển hoặc xóa sản phẩm trước.')
    return
  }
  
  // Prevent deletion if category has children
  const hasChildren = categories.value.some(c => c.parent_id === id)
  if (hasChildren) {
    alert('Không thể xóa danh mục đang có danh mục con. Vui lòng xóa danh mục con trước.')
    return
  }
  
  deleteId.value = id
  isDeleteModalOpen.value = true
}

// Delete category
const deleteCategory = () => {
  const index = categories.value.findIndex(c => c.id === deleteId.value)
  if (index !== -1) {
    categories.value.splice(index, 1)
  }
  
  // Close modal
  isDeleteModalOpen.value = false
  deleteId.value = null
  
  // Show success message
  alert('Xóa danh mục thành công!')
}
</script>

<style scoped>
/* Add custom styles here if needed */
</style> 