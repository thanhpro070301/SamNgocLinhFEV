<template>
  <div class="blog-detail-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Dark Mode Toggle -->
      <div class="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>
      
      <template v-if="article">
        <!-- Article Header -->
        <section class="article-header py-20 relative">
          <div class="container mx-auto px-4 w-[80%]">
            <div class="max-w-4xl mx-auto">
              <!-- Back Button -->
              <button 
                @click="goBack" 
                class="inline-flex items-center mb-8 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                data-aos="fade-right"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Quay lại tin tức
              </button>
              
              <!-- Title and Meta -->
              <div class="text-left" data-aos="fade-up">
                <div class="mb-6">
                  <span 
                    class="inline-block py-1 px-3 rounded-full text-sm font-medium mb-4" 
                    :class="getCategoryClass(article.categoryId)"
                  >
                    {{ getCategoryName(article.categoryId) }}
                  </span>
                  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">
                    {{ article.title }}
                  </h1>
                </div>
                
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                  <span class="flex items-center">
                    <i class="far fa-calendar-alt mr-2"></i>
                    {{ formatDate(article.date) }}
                  </span>
                  <span class="mx-4">|</span>
                  <span class="flex items-center">
                    <i class="far fa-clock mr-2"></i>
                    {{ article.readTime || '5 phút đọc' }}
                  </span>
                </div>
              </div>
              
              <!-- Featured Image -->
              <div 
                class="featured-image mb-10 overflow-hidden rounded-3xl shadow-xl" 
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <img 
                  :src="article.image" 
                  :alt="article.title" 
                  class="w-full h-auto object-cover aspect-[16/9]"
                >
              </div>
            </div>
          </div>
        </section>
        
        <!-- Article Content -->
        <section class="article-content py-10 relative z-10">
          <div class="container mx-auto px-4 w-[80%]">
            <div class="max-w-3xl mx-auto">
              <div 
                class="prose prose-lg dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-green-600 dark:prose-a:text-green-400 max-w-none"
                data-aos="fade-up"
              >
                <div v-html="articleContent"></div>
              </div>
              
              <!-- Tags -->
              <div class="mt-12 flex flex-wrap gap-2" data-aos="fade-up">
                <span 
                  v-for="(tag, index) in article.tags" 
                  :key="index"
                  class="py-1.5 px-4 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  #{{ tag }}
                </span>
              </div>
              
              <!-- Author Info -->
              <div 
                class="author-box mt-12 p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg flex flex-col md:flex-row gap-6 items-center"
                data-aos="fade-up"
              >
                <div class="author-avatar w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    :src="article.author?.avatar || '/images/default-avatar.jpg'" 
                    :alt="article.author?.name || 'Tác giả'"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div class="text-center md:text-left">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {{ article.author?.name || 'Quản trị viên' }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ article.author?.bio || 'Chuyên gia về Sâm Ngọc Linh và các sản phẩm từ dược liệu quý hiếm.' }}
                  </p>
                  <div class="flex justify-center md:justify-start space-x-4">
                    <a href="#" class="text-gray-500 hover:text-green-600 dark:hover:text-green-400">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-green-600 dark:hover:text-green-400">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-green-600 dark:hover:text-green-400">
                      <i class="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Related Articles -->
        <section class="related-articles py-16 relative z-10">
          <div class="container mx-auto px-4 w-[80%]">
            <div class="max-w-5xl mx-auto">
              <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white" data-aos="fade-up">
                Bài Viết Liên Quan
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                  v-for="(relatedArticle, index) in relatedArticles" 
                  :key="index"
                  class="article-card"
                  data-aos="fade-up"
                  :data-aos-delay="index * 100"
                >
                  <div class="clay-card h-full bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30 shadow-xl transition-all duration-500">
                    <div class="relative">
                      <!-- Article Image -->
                      <div class="article-image h-56 overflow-hidden">
                        <img 
                          :src="relatedArticle.image" 
                          :alt="relatedArticle.title" 
                          class="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                        >
                      </div>
                      
                      <!-- Category Tag -->
                      <div class="absolute top-4 left-4">
                        <span class="category-tag text-xs font-medium py-1 px-3 rounded-full" :class="getCategoryClass(relatedArticle.categoryId)">
                          {{ getCategoryName(relatedArticle.categoryId) }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="p-6">
                      <!-- Article Meta -->
                      <div class="article-meta flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span class="article-date flex items-center">
                          <i class="far fa-calendar-alt mr-2"></i>
                          {{ formatDate(relatedArticle.date) }}
                        </span>
                      </div>
                      
                      <!-- Article Title -->
                      <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white line-clamp-2">
                        {{ relatedArticle.title }}
                      </h3>
                      
                      <!-- Article Excerpt -->
                      <p class="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                        {{ relatedArticle.excerpt }}
                      </p>
                      
                      <!-- Read More Link -->
                      <div class="mt-auto">
                        <button 
                          @click="readArticle(relatedArticle)"
                          class="read-more-btn flex items-center font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                          Đọc tiếp
                          <i class="fas fa-arrow-right ml-2 transition-transform duration-300 transform group-hover:translate-x-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
      
      <!-- Loading State -->
      <template v-else-if="isLoading">
        <div class="flex justify-center items-center py-32">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-green-100 dark:border-green-900/50 rounded-full"></div>
            <div class="absolute top-0 left-0 w-20 h-20 border-4 border-green-500 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </template>
      
      <!-- Article Not Found -->
      <template v-else>
        <div class="flex flex-col items-center justify-center py-32">
          <div class="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-newspaper text-gray-400 dark:text-gray-600 text-3xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Không tìm thấy bài viết</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
            Bài viết này có thể đã bị xóa hoặc đường dẫn không chính xác
          </p>
          <NeuButton 
            @click="navigateTo('/news')" 
            variant="primary"
          >
            <template #icon-left>
              <i class="fas fa-arrow-left"></i>
            </template>
            Quay lại trang tin tức
          </NeuButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';

const route = useRoute();
const router = useRouter();

// State
const article = ref(null);
const isLoading = ref(true);
const relatedArticles = ref([]);

// Mock article content
const articleContent = computed(() => {
  if (!article.value) return '';
  
  return `
    <p>
      ${article.value.excerpt}
    </p>
    <p>
      Sâm Ngọc Linh (Panax vietnamensis) được phát hiện vào năm 1973 tại vùng núi Ngọc Linh, nằm giữa hai tỉnh Kon Tum và Quảng Nam. Đây là loài sâm quý hiếm được đánh giá cao về mặt dược lý, ngang hàng với Sâm Hàn Quốc và Sâm Mỹ.
    </p>
    <h2>Giá trị dược liệu của Sâm Ngọc Linh</h2>
    <p>
      Nghiên cứu khoa học đã chứng minh Sâm Ngọc Linh chứa đến 52 loại saponin khác nhau, cao hơn nhiều so với các loại sâm khác trên thế giới. Đặc biệt, hàm lượng saponin MR2 trong Sâm Ngọc Linh cao gấp 20 lần so với Sâm Hàn Quốc.
    </p>
    <p>
      Các nghiên cứu lâm sàng đã chứng minh Sâm Ngọc Linh có nhiều tác dụng tốt cho sức khỏe như:
    </p>
    <ul>
      <li>Tăng cường hệ miễn dịch</li>
      <li>Chống oxy hóa mạnh mẽ</li>
      <li>Cải thiện trí nhớ và khả năng tập trung</li>
      <li>Giảm stress và mệt mỏi</li>
      <li>Hỗ trợ điều trị tiểu đường</li>
      <li>Tăng cường sinh lý nam nữ</li>
    </ul>
    <h2>Bảo tồn và phát triển</h2>
    <p>
      Hiện nay, Sâm Ngọc Linh đã được đưa vào danh mục bảo tồn quốc gia. Nỗ lực nhân giống và phát triển vùng trồng đang được triển khai tại các tỉnh Tây Nguyên nhằm bảo tồn nguồn gen quý giá này.
    </p>
    <blockquote>
      <p>"Sâm Ngọc Linh không chỉ là tài sản quốc gia mà còn là niềm tự hào của y học cổ truyền Việt Nam, có tiềm năng phát triển thành ngành kinh tế mũi nhọn trong tương lai."</p>
    </blockquote>
    <p>
      Với giá trị cao về mặt kinh tế và y học, Sâm Ngọc Linh đang được quan tâm đầu tư nghiên cứu và phát triển để trở thành thương hiệu dược liệu nổi tiếng của Việt Nam trên thị trường quốc tế.
    </p>
  `;
});

// Categories
const categories = [
  { id: 'all', name: 'Tất cả', icon: 'fas fa-border-all' },
  { id: 'news', name: 'Tin tức', icon: 'fas fa-newspaper' },
  { id: 'product', name: 'Sản phẩm', icon: 'fas fa-leaf' },
  { id: 'health', name: 'Sức khỏe', icon: 'fas fa-heartbeat' },
  { id: 'event', name: 'Sự kiện', icon: 'fas fa-calendar-day' }
];

// Mock data for articles
const mockArticles = [
  {
    id: 1,
    title: 'Sâm Ngọc Linh - Quốc bảo của Việt Nam được công nhận',
    excerpt: 'Sâm Ngọc Linh vừa được Bộ Y tế công nhận là dược liệu quý hiếm có giá trị cao trong y học cổ truyền và hiện đại.',
    content: '',
    image: '/images/news/news-1.jpg',
    date: '2023-07-15',
    categoryId: 'news',
    featured: true,
    tags: ['Sâm Ngọc Linh', 'Dược liệu', 'Y học'],
    author: {
      name: 'Nguyễn Văn A',
      avatar: '/images/authors/author-1.jpg',
      bio: 'Chuyên gia nghiên cứu dược liệu quý hiếm'
    },
    readTime: '5 phút đọc'
  },
  {
    id: 2,
    title: 'Nghiên cứu mới về tác dụng của Sâm Ngọc Linh đối với hệ miễn dịch',
    excerpt: 'Các nhà khoa học vừa công bố kết quả nghiên cứu về tác dụng tăng cường miễn dịch của Sâm Ngọc Linh.',
    content: '',
    image: '/images/news/news-2.jpg',
    date: '2023-08-10',
    categoryId: 'health',
    tags: ['Miễn dịch', 'Nghiên cứu', 'Sức khỏe'],
    author: {
      name: 'TS. Lê Thị B',
      avatar: '/images/authors/author-2.jpg',
      bio: 'Tiến sĩ Y học, chuyên gia nghiên cứu Đông y'
    },
    readTime: '7 phút đọc'
  },
  {
    id: 3,
    title: 'Ra mắt dòng sản phẩm mới từ Sâm Ngọc Linh',
    excerpt: 'Chúng tôi vừa cho ra mắt dòng sản phẩm cao cấp từ Sâm Ngọc Linh 10 năm tuổi với nhiều cải tiến.',
    content: '',
    image: '/images/news/news-3.jpg',
    date: '2023-09-05',
    categoryId: 'product',
    tags: ['Sản phẩm mới', 'Sâm cao cấp', 'Ra mắt'],
    author: {
      name: 'Trần Văn C',
      avatar: '/images/authors/author-3.jpg',
      bio: 'Giám đốc phát triển sản phẩm'
    },
    readTime: '4 phút đọc'
  }
];

// Methods
const fetchArticle = async () => {
  isLoading.value = true;
  
  try {
    const articleId = parseInt(route.params.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find article by ID
    const foundArticle = mockArticles.find(a => a.id === articleId);
    article.value = foundArticle;
    
    // Get related articles (excluding current one)
    if (foundArticle) {
      relatedArticles.value = mockArticles
        .filter(a => a.id !== articleId)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching article:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
};

const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};

const getCategoryClass = (categoryId) => {
  switch (categoryId) {
    case 'news':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
    case 'product':
      return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
    case 'health':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
    case 'event':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const readArticle = (article) => {
  router.push({ 
    path: `/blog/${article.id}`,
    query: { title: article.title.toLowerCase().replace(/\s+/g, '-') } 
  });
};

const goBack = () => {
  router.push('/news');
};

const navigateTo = (path) => {
  router.push(path);
};

// Lifecycle
onMounted(async () => {
  await fetchArticle();
  
  // Initialize AOS if available
  if (window.AOS) {
    window.AOS.refresh();
  }
});
</script>

<style scoped>
.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

.clay-card {
  transform: translateZ(0);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, box-shadow;
}

.article-card:hover .clay-card {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.1),
    0 10px 15px -5px rgba(0, 0, 0, 0.05);
}

:global(.dark) .article-card:hover .clay-card {
  box-shadow: 
    0 20px 30px -15px rgba(0, 0, 0, 0.5),
    0 10px 15px -5px rgba(0, 0, 0, 0.2);
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

/* Prose styles for dark mode */
:global(.dark) .prose {
  color: #e5e7eb;
}

:global(.dark) .prose blockquote {
  border-color: #4ade80;
  color: #e5e7eb;
}

:global(.dark) .prose h1,
:global(.dark) .prose h2,
:global(.dark) .prose h3,
:global(.dark) .prose h4,
:global(.dark) .prose h5,
:global(.dark) .prose h6 {
  color: #f3f4f6;
}

:global(.dark) .prose strong {
  color: #f3f4f6;
}

:global(.dark) .prose ul > li::before {
  background-color: #6b7280;
}

/* Animation for the related articles */
.article-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style> 