<template>
  <div class="product-detail py-8">
    <!-- Notification -->
    <div 
      v-if="showNotificationFlag" 
      class="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md transition-opacity duration-300"
      :class="{ 'opacity-100': showNotificationFlag, 'opacity-0': !showNotificationFlag }"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ notification }}</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <!-- Product Images -->
          <div class="product-images">
            <div class="main-image bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img :src="product?.image" :alt="product?.name" class="w-full h-96 object-contain">
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ product?.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center mb-4">
              <div class="flex">
                <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"></i>
              </div>
              <span class="text-sm text-gray-500 ml-2">({{ product?.sold || 0 }} đánh giá)</span>
            </div>
            
            <!-- Price -->
            <div class="flex items-end mb-6">
              <span class="text-3xl font-bold text-green-600">{{ formatPrice(product?.price) }}</span>
              <span v-if="product?.originalPrice" class="text-xl text-gray-500 line-through ml-3">
                {{ formatPrice(product?.originalPrice) }}
              </span>
              <span v-if="hasDiscount" class="ml-4 px-2 py-1 bg-red-500 text-white text-sm font-medium rounded">
                -{{ discountPercent }}%
              </span>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
              <p class="text-gray-600">{{ product?.description || 'Sâm Ngọc Linh là một trong những loại thảo dược quý hiếm bậc nhất của Việt Nam, được thu hái tại vùng núi Ngọc Linh. Với hàm lượng saponin phong phú, sản phẩm có tác dụng bồi bổ sức khỏe, tăng cường sức đề kháng và giảm stress hiệu quả.' }}</p>
            </div>
            
            <!-- Actions -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center mb-4">
                <div class="mr-6">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <div class="flex items-center">
                    <button 
                      @click="quantity > 1 ? quantity-- : null"
                      class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l text-gray-500 hover:bg-gray-100"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      v-model="quantity" 
                      min="1" 
                      class="w-16 h-10 border-t border-b border-gray-300 text-center" 
                    />
                    <button 
                      @click="quantity++"
                      class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r text-gray-500 hover:bg-gray-100"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-green-100 text-green-700': product?.stock > 0,
                      'bg-red-100 text-red-700': product?.stock === 0
                    }"
                  >
                    {{ product?.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <button 
                  @click="addItemToCart(1)"
                  class="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-shopping-cart mr-2"></i> Thêm vào giỏ hàng
                </button>
                <button 
                  @click="addItemToCart(quantity)"
                  class="bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-400 transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-bolt mr-2"></i> Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="border-t border-gray-200 p-6">
          <div class="border-b border-gray-200 mb-6">
            <div class="flex space-x-8">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-2 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>
          
          <!-- Tab Content -->
          <div v-if="activeTab === 'details'" class="prose max-w-none">
            <h3>Công dụng Sâm Ngọc Linh</h3>
            <ul>
              <li>Tăng cường sức khỏe, bồi bổ cơ thể</li>
              <li>Hỗ trợ tăng cường hệ miễn dịch</li>
              <li>Giảm stress, mệt mỏi</li>
              <li>Hỗ trợ giấc ngủ</li>
              <li>Cải thiện tuần hoàn máu</li>
            </ul>
            
            <h3>Hướng dẫn sử dụng</h3>
            <p>Ngâm sâm trong rượu trắng với tỷ lệ 1:3 trong thời gian 3-6 tháng. Uống 1-2 ly nhỏ mỗi ngày, tốt nhất là sau bữa ăn.</p>
          </div>
          
          <div v-if="activeTab === 'specifications'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-700 mb-2">Xuất xứ</h4>
                <p>Việt Nam</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-700 mb-2">Độ tuổi</h4>
                <p>10 năm</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-700 mb-2">Loại sản phẩm</h4>
                <p>{{ getCategoryName(product?.category) }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-700 mb-2">Trọng lượng</h4>
                <p>100g</p>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <!-- Review Summary -->
            <div class="flex items-center space-x-4">
              <div class="text-center">
                <div class="text-5xl font-bold text-yellow-400">{{ product?.rating || 5 }}</div>
                <div class="text-sm text-gray-500">trên 5</div>
              </div>
              <div class="flex-1">
                <div v-for="star in 5" :key="star" class="flex items-center">
                  <span class="w-20 text-sm text-gray-600">{{ 6-star }} sao</span>
                  <div class="flex-1 h-3 bg-gray-200 rounded-full mx-3">
                    <div 
                      class="h-3 bg-yellow-400 rounded-full" 
                      :style="`width: ${star === 6-product?.rating ? '80%' : star < 6-product?.rating ? '20%' : '5%'}`">
                    </div>
                  </div>
                  <span class="text-sm text-gray-600">{{ star === 6-product?.rating ? product?.sold || 0 : Math.floor((product?.sold || 0)/10) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Reviews List -->
            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center mb-2">
                  <span class="font-medium">Nguyễn Văn A</span>
                  <span class="text-sm text-gray-500 ml-2">- 15/03/2023</span>
                </div>
                <div class="flex text-yellow-400 mb-2">
                  <i v-for="i in 5" :key="i" class="fas fa-star"></i>
                </div>
                <p class="text-gray-600">Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Sau khi sử dụng cảm thấy sức khỏe được cải thiện rõ rệt.</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center mb-2">
                  <span class="font-medium">Trần Thị B</span>
                  <span class="text-sm text-gray-500 ml-2">- 20/02/2023</span>
                </div>
                <div class="flex mb-2">
                  <i v-for="i in 4" :key="i" class="fas fa-star text-yellow-400"></i>
                  <i class="fas fa-star text-gray-300"></i>
                </div>
                <p class="text-gray-600">Chất lượng sản phẩm tốt, nhưng giao hàng hơi chậm. Sẽ tiếp tục ủng hộ shop.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'
import cart from '@/store/cart'

const route = useRoute()
const router = useRouter()
const productId = computed(() => Number(route.params.id))

// Giả lập dữ liệu sản phẩm
const sampleProducts = [
  {
    id: 1,
    name: 'Sâm Ngọc Linh Tươi 10 Năm Tuổi',
    image: samTuoiImage,
    price: 15000000,
    originalPrice: 18000000,
    rating: 5,
    sold: 124,
    stock: 50,
    category: 'sam-tuoi',
    description: 'Sâm Ngọc Linh tươi 10 năm tuổi, thu hoạch từ vùng núi Ngọc Linh, có tác dụng bồi bổ sức khỏe, tăng cường sức đề kháng, giảm mệt mỏi và stress.'
  },
  {
    id: 2,
    name: 'Cao Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 8000000,
    rating: 4,
    sold: 89,
    stock: 100,
    category: 'cao-sam',
    description: 'Cao Sâm Ngọc Linh được chiết xuất từ củ sâm tươi, giữ nguyên dưỡng chất, dễ dàng sử dụng và bảo quản.'
  },
  {
    id: 3,
    name: 'Rượu Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 5000000,
    originalPrice: 6000000,
    rating: 5,
    sold: 156,
    stock: 0,
    category: 'ruou-sam',
    description: 'Rượu Sâm Ngọc Linh được ngâm từ củ sâm tươi với rượu trắng, có hương vị đặc trưng và giữ nguyên công dụng của sâm.'
  }
]

const product = computed(() => sampleProducts.find(p => p.id === productId.value) || null)
const quantity = ref(1)
const activeTab = ref('details')

const tabs = [
  { id: 'details', name: 'Chi tiết sản phẩm' },
  { id: 'specifications', name: 'Thông số kỹ thuật' },
  { id: 'reviews', name: 'Đánh giá' }
]

const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

const hasDiscount = computed(() => {
  return product.value?.originalPrice && product.value.originalPrice > product.value.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  const discount = ((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100
  return Math.round(discount)
})

const getCategoryName = (category) => {
  const categories = {
    'sam-tuoi': 'Sâm tươi',
    'cao-sam': 'Cao sâm',
    'ruou-sam': 'Rượu sâm'
  }
  return categories[category] || category
}

// Thêm sản phẩm vào giỏ hàng
function addItemToCart(qty) {
  if (product.value) {
    cart.addToCart(product.value, qty)
    
    // Hiển thị thông báo thành công
    showNotification(`Đã thêm ${qty} ${product.value.name} vào giỏ hàng`)
    
    // Nếu là "Mua ngay", chuyển đến trang giỏ hàng
    if (qty === quantity.value) {
      router.push('/cart')
    }
  }
}

// Hiển thị thông báo
const notification = ref('')
const showNotificationFlag = ref(false)

function showNotification(message) {
  notification.value = message
  showNotificationFlag.value = true
  setTimeout(() => {
    showNotificationFlag.value = false
  }, 3000)
}
</script>

<style scoped>
.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
}
.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}
.prose li {
  margin-bottom: 0.5rem;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style> 