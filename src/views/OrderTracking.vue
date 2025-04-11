<template>
  <div class="order-tracking-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Page Header -->
      <section class="page-header py-20 relative">
        <div class="container mx-auto px-4">
          <div class="text-center" data-aos="fade-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="block text-gray-800">Tra Cứu Đơn Hàng</span>
              <span class="text-gradient bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Theo Dõi Trạng Thái
              </span>
            </h1>
            <p class="text-gray-600 max-w-3xl mx-auto text-lg mb-8">
              Kiểm tra trạng thái đơn hàng của bạn một cách nhanh chóng và dễ dàng
            </p>
          </div>
        </div>
      </section>
      
      <!-- Tracking Form Section -->
      <section class="tracking-form-section py-12 relative z-10">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <div class="clay-container bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/30 shadow-xl" data-aos="fade-up">
              <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                Nhập Thông Tin Đơn Hàng
              </h2>
              
              <form @submit.prevent="trackOrder">
                <div class="space-y-6">
                  <!-- Order ID Input -->
                  <div class="form-group">
                    <label for="orderId" class="block text-gray-700 mb-2 font-medium">Mã đơn hàng</label>
                    <div class="neu-input-container">
                      <input 
                        type="text" 
                        id="orderId" 
                        v-model="trackingForm.orderId" 
                        class="neu-input w-full"
                        placeholder="Nhập mã đơn hàng của bạn"
                        required
                      >
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                      <i class="fas fa-info-circle mr-1"></i>
                      Mã đơn hàng có trong email xác nhận đơn hàng của bạn
                    </p>
                  </div>
                  
                  <!-- Email Input (optional) -->
                  <div class="form-group">
                    <div class="flex justify-between items-center mb-2">
                      <label for="email" class="block font-medium">Email (tùy chọn)</label>
                      <span class="text-sm">Tùy chọn</span>
                    </div>
                    <div class="neu-input-container">
                      <input 
                        type="email" 
                        id="email" 
                        v-model="trackingForm.email" 
                        class="neu-input w-full"
                        placeholder="Email đặt hàng của bạn"
                      >
                    </div>
                  </div>
                  
                  <!-- Phone Input (optional) -->
                  <div class="form-group">
                    <div class="flex justify-between items-center mb-2">
                      <label for="phone" class="block font-medium">Số điện thoại (tùy chọn)</label>
                      <span class="text-sm">Tùy chọn</span>
                    </div>
                    <div class="neu-input-container">
                      <input 
                        type="tel" 
                        id="phone" 
                        v-model="trackingForm.phone" 
                        class="neu-input w-full"
                        placeholder="Số điện thoại đặt hàng của bạn"
                      >
                    </div>
                  </div>
                  
                  <!-- Submit Button -->
                  <div class="form-group pt-4">
                    <NeuButton 
                      type="submit"
                      variant="primary" 
                      size="lg"
                      :fullWidth="true"
                      :disabled="isLoading"
                    >
                      <template #icon-left v-if="!isLoading">
                        <i class="fas fa-search"></i>
                      </template>
                      <template #icon-left v-else>
                        <i class="fas fa-spinner fa-spin"></i>
                      </template>
                      {{ isLoading ? 'Đang tra cứu...' : 'Tra Cứu Đơn Hàng' }}
                    </NeuButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Order Result Section -->
      <section v-if="orderInfo" class="order-result-section py-12 relative z-10">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="glass-container p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl" data-aos="fade-up">
              <h2 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800 flex items-center">
                <span class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <i class="fas fa-box"></i>
                </span>
                Chi Tiết Đơn Hàng
              </h2>
              
              <!-- Order Summary -->
              <div class="order-summary mb-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <!-- Order ID -->
                  <div class="order-detail-card p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                    <div class="text-sm text-gray-500 mb-1">Mã đơn hàng</div>
                    <div class="text-lg font-semibold text-gray-800">#{{ orderInfo.orderId }}</div>
                  </div>
                  
                  <!-- Order Date -->
                  <div class="order-detail-card p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                    <div class="text-sm text-gray-500 mb-1">Ngày đặt hàng</div>
                    <div class="text-lg font-semibold text-gray-800">{{ formatDate(orderInfo.orderDate) }}</div>
                  </div>
                  
                  <!-- Order Status -->
                  <div class="order-detail-card p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                    <div class="text-sm text-gray-500 mb-1">Trạng thái</div>
                    <div class="text-lg font-semibold flex items-center">
                      <span :class="getStatusColor(orderInfo.status)">
                        {{ getStatusText(orderInfo.status) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Order Total -->
                  <div class="order-detail-card p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                    <div class="text-sm text-gray-500 mb-1">Tổng tiền</div>
                    <div class="text-lg font-semibold text-gray-800">{{ formatCurrency(orderInfo.total) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Order Status Timeline -->
              <div class="order-timeline mb-10">
                <h3 class="text-xl font-bold mb-6 text-gray-800">Tiến Trình Đơn Hàng</h3>
                <div class="timeline-container pl-8 relative">
                  <!-- Timeline Track -->
                  <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-green-200"></div>
                  
                  <!-- Timeline Steps -->
                  <div v-for="(step, index) in orderInfo.timeline" :key="index" class="timeline-step pb-8 relative">
                    <!-- Status Marker -->
                    <div 
                      class="absolute left-[-28px] w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      :class="[
                        step.completed ? 'bg-green-500 border-green-200' : 'bg-white border-gray-300'
                      ]"
                    >
                      <i 
                        v-if="step.completed" 
                        class="fas fa-check text-xs text-white"
                      ></i>
                    </div>
                    
                    <!-- Status Content -->
                    <div 
                      class="timeline-content"
                      :class="{ 'opacity-50': !step.completed }"
                    >
                      <div class="flex items-start">
                        <div>
                          <h4 class="text-base font-semibold text-gray-800 mb-1">{{ step.title }}</h4>
                          <p class="text-sm text-gray-600 mb-1">{{ step.description }}</p>
                          <div v-if="step.completed" class="text-xs text-gray-500">
                            <i class="far fa-clock mr-1"></i>{{ formatDateTime(step.timestamp) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="order-items">
                <h3 class="text-xl font-bold mb-6 text-gray-800">Sản Phẩm Đã Đặt</h3>
                <div class="overflow-hidden rounded-xl border border-white/30">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đơn giá
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số lượng
                          </th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, itemIndex) in orderInfo.items" :key="itemIndex">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full object-cover" :src="item.image" :alt="item.name">
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                                <div class="text-sm text-gray-500">{{ item.variant }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ formatCurrency(item.price) }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ item.quantity }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 font-semibold">{{ formatCurrency(item.price * item.quantity) }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <!-- Download Invoice and Contact Support Buttons -->
              <div class="flex flex-wrap justify-center gap-6 mt-10" data-aos="fade-up">
                <NeuButton 
                  @click="downloadInvoice"
                  variant="secondary"
                >
                  <template #icon-left>
                    <i class="fas fa-file-download"></i>
                  </template>
                  Tải Hóa Đơn
                </NeuButton>
                
                <NeuButton 
                  @click="navigateTo('/contact')" 
                  variant="primary"
                >
                  <template #icon-left>
                    <i class="fas fa-headset"></i>
                  </template>
                  Hỗ Trợ Đơn Hàng
                </NeuButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Error State -->
      <section v-if="errorMessage" class="error-section py-12 relative z-10">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <div class="glass-container p-8 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl text-center" data-aos="fade-up">
              <div class="error-icon w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                <i class="fas fa-exclamation-circle text-3xl"></i>
              </div>
              <h3 class="text-xl font-bold mb-4 text-gray-800">
                {{ errorMessage }}
              </h3>
              <p class="text-gray-600 mb-6">
                Vui lòng kiểm tra lại thông tin hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
              <div class="flex justify-center">
                <NeuButton 
                  @click="resetTracking"
                  variant="secondary"
                  size="sm"
                >
                  <template #icon-left>
                    <i class="fas fa-redo-alt"></i>
                  </template>
                  Thử lại
                </NeuButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- FAQ Section -->
      <section class="faq-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12" data-aos="fade-up">
            <span class="inline-block py-1.5 px-4 rounded-full text-sm font-medium text-green-700 bg-green-100/70 backdrop-blur-sm">
              Câu hỏi thường gặp
            </span>
            <h2 class="text-3xl font-bold mt-4 mb-4 text-gray-800">Thắc Mắc Về Đơn Hàng</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Giải đáp những câu hỏi thường gặp về việc tra cứu và theo dõi đơn hàng
            </p>
          </div>
          
          <div class="max-w-3xl mx-auto space-y-6">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index" 
              class="faq-item"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
            >
              <div 
                class="faq-question p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg"
                :class="{ 'rounded-b-none': activeIndex === index }"
              >
                <button 
                  @click="toggleFaq(index)"
                  class="w-full flex justify-between items-center text-left"
                >
                  <span class="text-lg font-semibold text-gray-800">{{ faq.question }}</span>
                  <span class="flex-shrink-0 ml-2">
                    <i 
                      class="fas transition-transform duration-300" 
                      :class="activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'"
                    ></i>
                  </span>
                </button>
              </div>
              
              <div 
                v-show="activeIndex === index"
                class="faq-answer p-6 bg-white/50 backdrop-blur-sm rounded-b-2xl border-x border-b border-white/30"
              >
                <p class="text-gray-600">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';

const router = useRouter();

// Form data
const trackingForm = ref({
  orderId: '',
  email: '',
  phone: ''
});

// UI state
const isLoading = ref(false);
const orderInfo = ref(null);
const errorMessage = ref('');
const activeIndex = ref(-1); // For FAQ accordion

// Mock order data
const mockOrderData = {
  orderId: 'ORD123456',
  orderDate: '2023-12-15T10:30:00Z',
  status: 'shipped',
  total: 2450000,
  timeline: [
    {
      title: 'Đơn hàng đã đặt',
      description: 'Chúng tôi đã nhận được đơn hàng của bạn.',
      timestamp: '2023-12-15T10:30:00Z',
      completed: true
    },
    {
      title: 'Thanh toán thành công',
      description: 'Chúng tôi đã nhận được thanh toán của bạn.',
      timestamp: '2023-12-15T10:32:00Z',
      completed: true
    },
    {
      title: 'Đang xử lý',
      description: 'Đơn hàng đang được xử lý và chuẩn bị.',
      timestamp: '2023-12-15T14:20:00Z',
      completed: true
    },
    {
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đã được giao cho đơn vị vận chuyển.',
      timestamp: '2023-12-17T09:15:00Z',
      completed: true
    },
    {
      title: 'Đã giao hàng',
      description: 'Đơn hàng đã được giao thành công.',
      timestamp: null,
      completed: false
    }
  ],
  items: [
    {
      name: 'Sâm Ngọc Linh Tươi',
      variant: '5 năm tuổi',
      price: 1200000,
      quantity: 1,
      image: '/images/products/sam-tuoi.jpg'
    },
    {
      name: 'Rượu Sâm Ngọc Linh',
      variant: '500ml',
      price: 850000,
      quantity: 1,
      image: '/images/products/ruou-sam.jpg'
    },
    {
      name: 'Trà Sâm Ngọc Linh',
      variant: 'Hộp 20 gói',
      price: 400000,
      quantity: 1,
      image: '/images/products/tra-sam.jpg'
    }
  ]
};

// FAQ data
const faqs = [
  {
    question: 'Làm thế nào để tra cứu đơn hàng của tôi?',
    answer: 'Bạn có thể tra cứu đơn hàng bằng cách nhập mã đơn hàng vào form tra cứu ở trên. Mã đơn hàng được gửi trong email xác nhận đơn hàng hoặc tin nhắn SMS sau khi bạn đặt hàng thành công.'
  },
  {
    question: 'Tôi không nhớ mã đơn hàng, làm thế nào để tra cứu?',
    answer: 'Nếu bạn không nhớ mã đơn hàng, bạn có thể tra cứu bằng email hoặc số điện thoại đã sử dụng khi đặt hàng. Hoặc bạn có thể liên hệ với bộ phận Chăm sóc Khách hàng của chúng tôi để được hỗ trợ.'
  },
  {
    question: 'Đơn hàng của tôi sẽ được giao trong bao lâu?',
    answer: 'Thời gian giao hàng thông thường là 3-5 ngày làm việc đối với khu vực thành phố lớn và 5-7 ngày đối với các khu vực khác. Thời gian có thể thay đổi tùy thuộc vào địa điểm giao hàng và điều kiện thời tiết.'
  },
  {
    question: 'Làm thế nào để tôi có thể thay đổi thông tin đơn hàng?',
    answer: 'Để thay đổi thông tin đơn hàng như địa chỉ giao hàng hoặc số điện thoại, vui lòng liên hệ với chúng tôi càng sớm càng tốt qua hotline hoặc email support@samngoclinh.com. Lưu ý rằng nếu đơn hàng đã được giao cho đơn vị vận chuyển, chúng tôi có thể không thể thay đổi thông tin.'
  },
  {
    question: 'Tôi muốn hủy đơn hàng phải làm thế nào?',
    answer: 'Để hủy đơn hàng, vui lòng liên hệ với chúng tôi qua hotline hoặc email càng sớm càng tốt. Nếu đơn hàng chưa được giao cho đơn vị vận chuyển, chúng tôi có thể hủy miễn phí. Nếu đơn hàng đã được giao cho đơn vị vận chuyển, có thể phát sinh phí hủy đơn.'
  }
];

// Methods
const trackOrder = async () => {
  if (!trackingForm.value.orderId) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  orderInfo.value = null;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would check if the order exists
    // For demo purposes, we'll just return the mock data
    if (trackingForm.value.orderId === 'ORD123456') {
      orderInfo.value = mockOrderData;
    } else {
      errorMessage.value = 'Không tìm thấy thông tin đơn hàng';
    }
  } catch (error) {
    console.error('Error tracking order:', error);
    errorMessage.value = 'Đã xảy ra lỗi khi tra cứu đơn hàng';
  } finally {
    isLoading.value = false;
    
    // Scroll to result if found
    if (orderInfo.value) {
      setTimeout(() => {
        document.querySelector('.order-result-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }
};

const resetTracking = () => {
  errorMessage.value = '';
  trackingForm.value = {
    orderId: '',
    email: '',
    phone: ''
  };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Chờ xác nhận',
    'processing': 'Đang xử lý',
    'shipped': 'Đang vận chuyển',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  };
  
  return statusMap[status] || status;
};

const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'text-yellow-600',
    'processing': 'text-blue-600',
    'shipped': 'text-purple-600',
    'delivered': 'text-green-600',
    'cancelled': 'text-red-600'
  };
  
  return colorMap[status] || 'text-gray-600';
};

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? -1 : index;
};

const downloadInvoice = () => {
  // This would download the invoice in a real app
  alert('Tính năng tải hóa đơn đang được phát triển. Vui lòng quay lại sau.');
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

.clay-container,
.glass-container {
  position: relative;
  overflow: hidden;
}

/* Glass-like decoration elements */
.glass-container::before,
.glass-container::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(59, 130, 246, 0.15));
  filter: blur(40px);
  z-index: -1;
}

.glass-container::before {
  top: -100px;
  left: -100px;
}

.glass-container::after {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(220, 252, 231, 0.15));
}

/* Neumorphic Input Styles */
.neu-input-container {
  position: relative;
  border-radius: 1rem;
  background: #f0fdf4;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.neu-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  color: #333;
  outline: none;
  border-radius: 1rem;
}

.neu-input::placeholder {
  color: #9ca3af;
}

/* Order detail cards hover effect */
.order-detail-card {
  transition: all 0.3s ease;
}

.order-detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* FAQ accordion animation */
.faq-answer {
  transition: all 0.3s ease;
}
</style> 