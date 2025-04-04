<template>
  <div class="news-management admin-dashboard bg-gray-50 min-h-screen">
    <!-- Header -->
    <AdminHeader />
    
    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Title -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Quản lý bảng tin</h1>
          <button 
            @click="openAddModal"
            class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <i class="fas fa-plus"></i>
            Thêm bài viết mới
          </button>
        </div>
        
        <!-- Actions Bar -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div class="flex items-center gap-4 flex-grow">
            <div class="relative flex-grow max-w-md">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Tìm kiếm bài viết..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div class="flex-shrink-0">
              <select 
                v-model="categoryFilter"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="news">Tin tức</option>
                <option value="events">Sự kiện</option>
                <option value="promotions">Khuyến mãi</option>
                <option value="knowledge">Kiến thức</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- News Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BÀI VIẾT
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DANH MỤC
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NGÀY ĐĂNG
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
              <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        :src="article.image" 
                        alt="Thumbnail" 
                        class="w-full h-full object-cover"
                      >
                    </div>
                    <div class="max-w-xs">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ article.title }}</div>
                      <div class="text-sm text-gray-500 line-clamp-1">{{ article.summary }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getCategoryClass(article.category)">
                    {{ getCategoryName(article.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(article.publishDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ article.published ? 'Đã đăng' : 'Bản nháp' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex gap-3 items-center px-2">
                    <button 
                      @click="editArticle(article)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                      title="Chỉnh sửa"
                      type="button"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="togglePublish(article)"
                      class="w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-colors"
                      :class="article.published ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                      :title="article.published ? 'Ẩn bài viết' : 'Đăng bài viết'"
                      type="button"
                    >
                      <i :class="article.published ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <button 
                      @click="confirmDelete(article.id)"
                      class="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                      title="Xóa"
                      type="button"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredArticles.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                  Không tìm thấy bài viết nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6">
          <div class="text-sm text-gray-500">
            Hiển thị {{ filteredArticles.length }} trên tổng số {{ articles.length }} bài viết
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
        
        <!-- Add/Edit Article Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEditMode ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới' }}
              </h3>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveArticle">
                <div class="grid gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      v-model="articleForm.title"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục <span class="text-red-500">*</span></label>
                      <select 
                        v-model="articleForm.category"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="news">Tin tức</option>
                        <option value="events">Sự kiện</option>
                        <option value="promotions">Khuyến mãi</option>
                        <option value="knowledge">Kiến thức</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select 
                        v-model="articleForm.published"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option :value="true">Đăng ngay</option>
                        <option :value="false">Lưu nháp</option>
                      </select>
                    </div>
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
                      <div v-if="articleForm.image" class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img :src="articleForm.image" alt="Preview" class="w-full h-full object-cover">
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
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                    <textarea 
                      v-model="articleForm.summary"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nội dung <span class="text-red-500">*</span></label>
                    <textarea 
                      v-model="articleForm.content"
                      rows="10"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    ></textarea>
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
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-exclamation-triangle text-xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
              <p class="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
            </div>
            <div class="flex justify-center gap-3">
              <button 
                @click="showDeleteConfirm = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                @click="deleteArticle"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

// Sample data - replace with API calls in production
const articles = ref([
  {
    id: 1,
    title: 'Sâm Ngọc Linh đạt chứng nhận quốc tế về chất lượng',
    summary: 'Sâm Ngọc Linh Việt Nam vừa đạt chứng nhận về chất lượng từ tổ chức quốc tế, đánh dấu một bước tiến quan trọng.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    category: 'news',
    image: samTuoiImage,
    publishDate: new Date(2023, 11, 15),
    published: true
  },
  {
    id: 2,
    title: 'Hội thảo Sâm Ngọc Linh và phát triển bền vững',
    summary: 'Hội thảo khoa học về phát triển bền vững cây Sâm Ngọc Linh sẽ được tổ chức vào tháng 5 tới.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    category: 'events',
    image: samTuoiImage,
    publishDate: new Date(2023, 10, 25),
    published: true
  },
  {
    id: 3,
    title: 'Khuyến mãi đặc biệt nhân dịp Tết Nguyên Đán',
    summary: 'Chương trình khuyến mãi lớn nhất trong năm với nhiều ưu đãi hấp dẫn dành cho khách hàng.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    category: 'promotions',
    image: samTuoiImage,
    publishDate: new Date(2023, 11, 30),
    published: true
  },
  {
    id: 4,
    title: 'Cách phân biệt Sâm Ngọc Linh thật và giả',
    summary: 'Hướng dẫn chi tiết giúp người tiêu dùng có thể nhận biết Sâm Ngọc Linh thật và giả trên thị trường.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    category: 'knowledge',
    image: samTuoiImage,
    publishDate: new Date(2023, 9, 10),
    published: false
  }
])

// Search and filter
const searchQuery = ref('')
const categoryFilter = ref('all')

const filteredArticles = computed(() => {
  let result = articles.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    )
  }
  
  // Apply category filter
  if (categoryFilter.value !== 'all') {
    result = result.filter(article => article.category === categoryFilter.value)
  }
  
  return result
})

// Modal state and form
const isModalOpen = ref(false)
const isEditMode = ref(false)
const articleForm = ref({
  id: null,
  title: '',
  summary: '',
  content: '',
  category: 'news',
  image: '',
  publishDate: new Date(),
  published: true
})

// Delete confirmation
const showDeleteConfirm = ref(false)
const articleToDeleteId = ref(null)

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Get category name
const getCategoryName = (category) => {
  const categories = {
    news: 'Tin tức',
    events: 'Sự kiện',
    promotions: 'Khuyến mãi',
    knowledge: 'Kiến thức'
  }
  return categories[category] || category
}

// Get category class
const getCategoryClass = (category) => {
  const classes = {
    news: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    promotions: 'bg-orange-100 text-orange-800',
    knowledge: 'bg-indigo-100 text-indigo-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

// Open modal for adding new article
const openAddModal = () => {
  isEditMode.value = false
  articleForm.value = {
    id: null,
    title: '',
    summary: '',
    content: '',
    category: 'news',
    image: '',
    publishDate: new Date(),
    published: true
  }
  isModalOpen.value = true
}

// Open modal for editing article
const editArticle = (article) => {
  isEditMode.value = true
  articleForm.value = { ...article }
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
}

// Toggle publish status
const togglePublish = (article) => {
  const index = articles.value.findIndex(a => a.id === article.id)
  if (index !== -1) {
    articles.value[index].published = !articles.value[index].published
  }
}

// Save article (add or update)
const saveArticle = () => {
  if (isEditMode.value) {
    // Update existing article
    const index = articles.value.findIndex(a => a.id === articleForm.value.id)
    if (index !== -1) {
      articles.value[index] = { ...articleForm.value }
    }
  } else {
    // Add new article
    const newId = Math.max(0, ...articles.value.map(a => a.id)) + 1
    articles.value.push({
      ...articleForm.value,
      id: newId,
      publishDate: new Date()
    })
  }
  
  closeModal()
}

// Confirm delete
const confirmDelete = (id) => {
  articleToDeleteId.value = id
  showDeleteConfirm.value = true
}

// Delete article
const deleteArticle = () => {
  articles.value = articles.value.filter(a => a.id !== articleToDeleteId.value)
  showDeleteConfirm.value = false
}

// Thêm các hàm xử lý file trong <script setup>
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      articleForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  articleForm.value.image = ''
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