<template>
  <div class="products py-10 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Sản phẩm Sâm Ngọc Linh</h1>
        <p class="text-gray-600">Các sản phẩm chất lượng cao từ Sâm Ngọc Linh</p>
      </div>
      
      <!-- Product filters -->
      <div class="filters mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Tìm kiếm sản phẩm..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
          <select 
            v-model="selectedCategory"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tất cả danh mục</option>
            <option value="sam-tuoi">Sâm tươi</option>
            <option value="cao-sam">Cao sâm</option>
            <option value="ruou-sam">Rượu sâm</option>
          </select>
          <select 
            v-model="sortBy"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name">Tên sản phẩm</option>
          </select>
        </div>
      </div>

      <!-- Product grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
        <p class="text-gray-500">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
        <button 
          @click="resetFilters" 
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('price-asc')

// Dữ liệu sản phẩm
const products = ref([
  {
    id: 1,
    name: 'Sâm Ngọc Linh Tươi 10 Năm Tuổi',
    image: samTuoiImage,
    price: 15000000,
    originalPrice: 18000000,
    rating: 5,
    sold: 124,
    category: 'sam-tuoi',
    description: 'Sâm Ngọc Linh tươi cao cấp có tuổi đời 10 năm, thu hoạch từ vùng núi Ngọc Linh.',
    stock: 50
  },
  {
    id: 2,
    name: 'Cao Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 8000000,
    originalPrice: 10000000,
    rating: 4,
    sold: 89,
    category: 'cao-sam',
    description: 'Cao sâm Ngọc Linh được chiết xuất từ sâm tươi loại 1, giữ nguyên dưỡng chất.',
    stock: 100
  },
  {
    id: 3,
    name: 'Rượu Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 5000000,
    originalPrice: 6000000,
    rating: 5,
    sold: 156,
    category: 'ruou-sam',
    description: 'Rượu sâm Ngọc Linh được ngâm từ sâm tươi 7 năm tuổi, có hương vị đặc trưng.',
    stock: 0
  },
  {
    id: 4,
    name: 'Trà Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 1200000,
    originalPrice: 1500000,
    rating: 4,
    sold: 230,
    category: 'cao-sam',
    description: 'Trà sâm Ngọc Linh được chế biến từ lá và thân sâm, thơm ngon bổ dưỡng.',
    stock: 0
  },
  {
    id: 5,
    name: 'Sâm Ngọc Linh Khô Loại 1',
    image: samTuoiImage,
    price: 12000000,
    originalPrice: 13500000,
    rating: 5,
    sold: 78,
    category: 'sam-tuoi',
    description: 'Sâm Ngọc Linh khô loại 1, được sấy theo công nghệ hiện đại giữ nguyên dưỡng chất.',
    stock: 15
  },
  {
    id: 6,
    name: 'Viên Đông Trùng Hạ Thảo Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 4500000,
    originalPrice: null,
    rating: 4,
    sold: 95,
    category: 'cao-sam',
    description: 'Viên đông trùng hạ thảo kết hợp với sâm Ngọc Linh, tăng cường sức khỏe.',
    stock: 0
  }
])

// Lọc sản phẩm
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    )
  }

  // Lọc theo danh mục
  if (selectedCategory.value) {
    result = result.filter(product => 
      product.category === selectedCategory.value
    )
  }

  // Sắp xếp sản phẩm
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return result
})

// Xử lý thêm vào giỏ hàng
const addToCart = (product) => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product)
}

// Reset bộ lọc
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'price-asc'
}

// Khởi tạo trang
onMounted(() => {
  console.log('Products page mounted')
})
</script>

<style scoped>
/* Thêm CSS nếu cần */
</style> 