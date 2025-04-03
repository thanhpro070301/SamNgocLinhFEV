<template>
  <div class="news-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <Sidebar class="order-2 md:order-1" />
        
        <!-- Main Content -->
        <main class="flex-1 order-1 md:order-2">
          <h1 class="text-3xl font-bold mb-6 text-gray-800">Tin tức & Sự kiện</h1>
          
          <!-- News List -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div class="grid grid-cols-12 gap-4 p-4 bg-gray-100 text-gray-600 font-medium border-b">
              <div class="col-span-6 pl-4">BÀI VIẾT</div>
              <div class="col-span-2 text-center">DANH MỤC</div>
              <div class="col-span-4 text-center">NGÀY ĐĂNG</div>
            </div>
            
            <div class="divide-y">
              <div v-for="article in articles" :key="article.id" class="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                <div class="col-span-6">
                  <div class="flex items-start gap-3">
                    <div class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img :src="article.image" alt="Thumbnail" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-800 mb-1">{{ article.title }}</h3>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ article.summary }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-span-2 flex items-center justify-center">
                  <span class="px-3 py-1 text-xs font-medium rounded-full" :class="getCategoryClass(article.category)">
                    {{ getCategoryName(article.category) }}
                  </span>
                </div>
                <div class="col-span-4 flex items-center justify-center">
                  <span class="text-gray-600">{{ formatDate(article.publishDate) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="flex justify-center mt-8">
            <div class="flex gap-2">
              <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="px-3 py-1 border border-gray-300 rounded-md bg-green-600 text-white text-sm">1</button>
              <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">2</button>
              <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">3</button>
              <button class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

// Sample articles data
const articles = ref([
  {
    id: 1,
    title: 'Sâm Ngọc Linh - Báu vật của núi rừng Việt Nam',
    summary: 'Tìm hiểu về lịch sử và giá trị của Sâm Ngọc Linh - loài dược liệu quý hiếm bậc nhất Việt Nam.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.',
    image: samTuoiImage,
    category: 'knowledge',
    publishDate: '2023-05-15',
    author: 'Nguyễn Văn A'
  },
  {
    id: 2,
    title: 'Công dụng tuyệt vời của Sâm Ngọc Linh đối với sức khỏe',
    summary: 'Khám phá những lợi ích sức khỏe và các công dụng chữa bệnh của Sâm Ngọc Linh.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.',
    image: samTuoiImage,
    category: 'knowledge',
    publishDate: '2023-06-02',
    author: 'Trần Thị B'
  },
  {
    id: 3,
    title: 'Cách phân biệt Sâm Ngọc Linh thật và giả',
    summary: 'Hướng dẫn chi tiết giúp bạn nhận biết Sâm Ngọc Linh thật và tránh mua phải hàng giả, hàng kém chất lượng.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.',
    image: samTuoiImage,
    category: 'tips',
    publishDate: '2023-06-18',
    author: 'Lê Văn C'
  },
  {
    id: 4,
    title: 'Thông báo khai trương cửa hàng mới tại Hà Nội',
    summary: 'Chúng tôi vui mừng thông báo khai trương cửa hàng mới tại Hà Nội vào ngày 15/7/2023.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc.',
    image: samTuoiImage,
    category: 'news',
    publishDate: '2023-07-10',
    author: 'Admin'
  }
])

// Format date as DD/MM/YYYY
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
    knowledge: 'Kiến thức',
    tips: 'Tips'
  }
  return categories[category] || category
}

// Get category class
const getCategoryClass = (category) => {
  const classes = {
    news: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    promotions: 'bg-orange-100 text-orange-800',
    knowledge: 'bg-indigo-100 text-indigo-800',
    tips: 'bg-green-100 text-green-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 