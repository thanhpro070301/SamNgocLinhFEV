<template>
  <div class="news-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Container to limit width to 80% -->
      <div class="mx-auto w-[80%]">
        <!-- Search and Filter -->
        <div class="search-filter mb-12" data-aos="fade-up">
          <div class="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1">
                <div class="relative">
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Tìm kiếm bài viết..." 
                    class="w-full py-3 px-4 pl-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  >
                  <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              
              <!-- Category Filter -->
              <div class="md:w-56">
                <select 
                  v-model="selectedCategory" 
                  class="w-full py-3 px-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 appearance-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="news">Tin tức</option>
                  <option value="events">Sự kiện</option>
                  <option value="promotions">Khuyến mãi</option>
                  <option value="knowledge">Kiến thức</option>
                  <option value="tips">Mẹo hay</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Articles Grid -->
        <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(article, index) in filteredArticles" 
            :key="article.id"
            class="article-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="clay-card h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/30 shadow-xl transition-all duration-500">
              <div class="relative">
                <!-- Article Image -->
                <div class="article-image h-56 overflow-hidden">
                  <img 
                    :src="article.image" 
                    :alt="article.title" 
                    class="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                  >
                </div>
                
                <!-- Category Tag -->
                <div class="absolute top-4 left-4">
                  <span class="category-tag text-xs font-medium py-1 px-3 rounded-full" :class="getCategoryClass(article.category)">
                    {{ getCategoryName(article.category) }}
                  </span>
                </div>
              </div>
              
              <div class="p-6">
                <!-- Article Meta -->
                <div class="article-meta flex items-center text-sm text-gray-500 mb-3">
                  <span class="article-date flex items-center">
                    <i class="far fa-calendar-alt mr-2"></i>
                    {{ formatDate(article.date) }}
                  </span>
                  <span class="mx-2">•</span>
                  <span class="article-author flex items-center">
                    <i class="far fa-user mr-2"></i>
                    {{ article.author }}
                  </span>
                </div>
                
                <!-- Article Title -->
                <h3 class="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                  {{ article.title }}
                </h3>
                
                <!-- Article Excerpt -->
                <p class="text-gray-600 mb-6 line-clamp-3">
                  {{ article.excerpt }}
                </p>
                
                <!-- Read More Link -->
                <div class="mt-auto">
                  <router-link 
                    :to="`/blog/${article.id}`"
                    class="read-more-btn flex items-center font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    Đọc tiếp
                    <i class="fas fa-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div v-else class="text-center py-12" data-aos="fade-up">
          <div class="text-5xl mb-4 text-gray-300">
            <i class="far fa-newspaper"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Không tìm thấy bài viết</h3>
          <p class="text-gray-500 mb-6">Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          <button @click="resetFilters" class="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Xóa bộ lọc
          </button>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredArticles.length > 0" class="pagination flex justify-center mt-12" data-aos="fade-up">
          <div class="flex space-x-2">
            <button 
              class="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-green-50 transition-colors"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="goToPage(page)"
              class="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors"
              :class="currentPage === page ? 
                'bg-green-600 border-green-600 text-white' : 
                'border-gray-200 text-gray-700 hover:bg-green-50'"
            >
              {{ page }}
            </button>
            
            <button 
              class="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-green-50 transition-colors"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AuroraBackground from '@/components/AuroraBackground.vue';

// Sample articles data
const articles = ref([
  {
    id: 1,
    title: 'Công dụng tuyệt vời của Sâm Ngọc Linh trong việc tăng cường hệ miễn dịch',
    excerpt: 'Sâm Ngọc Linh chứa hàm lượng saponin cao giúp tăng cường hệ miễn dịch, chống lại các tác nhân gây bệnh và cải thiện sức khỏe tổng thể.',
    content: '<p>Sâm Ngọc Linh được mệnh danh là "quốc bảo" của Việt Nam với những công dụng tuyệt vời đối với sức khỏe. Trong đó, khả năng tăng cường hệ miễn dịch là một trong những tác dụng nổi bật nhất.</p><p>Nghiên cứu khoa học đã chứng minh rằng Sâm Ngọc Linh chứa hàm lượng saponin cao, đặc biệt là các ginsenoside quý hiếm không có trong các loại nhân sâm khác. Các hợp chất này có khả năng kích thích sản xuất tế bào lympho T, tăng cường khả năng đề kháng của cơ thể.</p><p>Sử dụng Sâm Ngọc Linh đều đặn giúp cơ thể chống lại các tác nhân gây bệnh, giảm nguy cơ mắc các bệnh nhiễm trùng và cải thiện khả năng phục hồi sau ốm đau.</p>',
    image: '/images/blog/blog-1.jpg',
    author: 'TS. Nguyễn Văn A',
    date: '2023-06-15',
    category: 'knowledge',
    tags: ['sâm ngọc linh', 'miễn dịch', 'sức khỏe']
  },
  {
    id: 2,
    title: 'Phương pháp nhận biết Sâm Ngọc Linh thật và giả',
    excerpt: 'Hướng dẫn chi tiết về cách phân biệt Sâm Ngọc Linh chính hãng và sản phẩm giả mạo thông qua màu sắc, hình dáng và hương vị.',
    content: '<p>Với giá trị cao, Sâm Ngọc Linh thường xuyên bị làm giả. Bài viết này sẽ hướng dẫn bạn cách nhận biết sâm thật.</p>',
    image: '/images/blog/blog-2.jpg',
    author: 'ThS. Lê Thị B',
    date: '2023-07-20',
    category: 'tips',
    tags: ['sâm ngọc linh', 'phân biệt', 'hàng giả']
  },
  {
    id: 3,
    title: 'Khai trương chi nhánh mới tại Thành phố Hồ Chí Minh',
    excerpt: 'Chúng tôi vui mừng thông báo về việc khai trương chi nhánh mới tại Quận 1, TP.HCM với nhiều ưu đãi hấp dẫn cho khách hàng.',
    content: '<p>Sự kiện khai trương sẽ diễn ra vào ngày 15/08/2023 với nhiều hoạt động thú vị.</p>',
    image: '/images/blog/blog-3.jpg',
    author: 'Ban quản trị',
    date: '2023-08-01',
    category: 'news',
    tags: ['khai trương', 'chi nhánh mới', 'sự kiện']
  },
  {
    id: 4,
    title: 'Quy trình trồng và thu hoạch Sâm Ngọc Linh',
    excerpt: 'Tìm hiểu về quy trình trồng và thu hoạch Sâm Ngọc Linh từ những người nông dân tại Quảng Nam và Kon Tum.',
    content: '<p>Quy trình trồng Sâm Ngọc Linh đòi hỏi sự kiên nhẫn và kỹ thuật đặc biệt.</p>',
    image: '/images/blog/blog-4.jpg',
    author: 'KS. Phạm Văn C',
    date: '2023-08-15',
    category: 'knowledge',
    tags: ['quy trình', 'trồng sâm', 'thu hoạch']
  },
  {
    id: 5,
    title: 'Chương trình khuyến mãi đặc biệt nhân dịp Trung Thu',
    excerpt: 'Ưu đãi lớn nhân dịp Tết Trung Thu với nhiều quà tặng và giảm giá hấp dẫn cho tất cả sản phẩm từ Sâm Ngọc Linh.',
    content: '<p>Chương trình khuyến mãi sẽ diễn ra từ ngày 15/09 đến 25/09/2023.</p>',
    image: '/images/blog/blog-5.jpg',
    author: 'Ban marketing',
    date: '2023-09-05',
    category: 'promotions',
    tags: ['khuyến mãi', 'trung thu', 'ưu đãi']
  },
  {
    id: 6,
    title: 'Hội thảo về tác dụng của Sâm Ngọc Linh trong y học hiện đại',
    excerpt: 'Thông tin về hội thảo khoa học về Sâm Ngọc Linh và ứng dụng trong y học hiện đại, với sự tham gia của các chuyên gia hàng đầu.',
    content: '<p>Hội thảo sẽ diễn ra tại Hà Nội vào ngày 25/09/2023.</p>',
    image: '/images/blog/blog-6.jpg',
    author: 'Ban tổ chức',
    date: '2023-09-12',
    category: 'events',
    tags: ['hội thảo', 'y học', 'nghiên cứu']
  }
]);

// Search and filter
const searchQuery = ref('');
const selectedCategory = ref('all');
const currentPage = ref(1);
const itemsPerPage = 6;

// Computed properties
const filteredArticles = computed(() => {
  let filtered = articles.value;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value);
  }
  
  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage);
});

const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredArticles.value.slice(startIndex, endIndex);
});

// Methods
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getCategoryName = (category) => {
  const categories = {
    news: 'Tin tức',
    events: 'Sự kiện',
    promotions: 'Khuyến mãi',
    knowledge: 'Kiến thức',
    tips: 'Mẹo hay'
  };
  return categories[category] || 'Chung';
};

const getCategoryClass = (category) => {
  const classes = {
    news: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    promotions: 'bg-orange-100 text-orange-800',
    knowledge: 'bg-indigo-100 text-indigo-800',
    tips: 'bg-green-100 text-green-800'
  };
  return classes[category] || 'bg-gray-100 text-gray-800';
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  currentPage.value = 1;
};

const goToPage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Initialize AOS on mount
if (typeof window !== 'undefined' && window.AOS) {
  window.AOS.refresh();
}
</script>

<style scoped>
.news-page {
  overflow-x: hidden;
}

.clay-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.clay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-image {
  position: relative;
}

.article-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  z-index: 1;
}
</style> 