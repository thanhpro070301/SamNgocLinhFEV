<template>
  <div class="products">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Sản phẩm</h1>
      
      <!-- Product filters -->
      <div class="filters mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Tìm kiếm sản phẩm..."
            class="px-4 py-2 border rounded"
          >
          <select 
            v-model="selectedCategory"
            class="px-4 py-2 border rounded"
          >
            <option value="">Tất cả danh mục</option>
            <option value="sam-tuoi">Sâm tươi</option>
            <option value="cao-sam">Cao sâm</option>
            <option value="ruou-sam">Rượu sâm</option>
          </select>
          <select 
            v-model="sortBy"
            class="px-4 py-2 border rounded"
          >
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name">Tên sản phẩm</option>
          </select>
        </div>
      </div>

      <!-- Product grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('price-asc')

const products = ref([
  {
    id: 1,
    name: 'Sâm Ngọc Linh Tươi 10 Năm Tuổi',
    image: samTuoiImage,
    price: 15000000,
    originalPrice: 18000000,
    rating: 5,
    sold: 124,
    category: 'sam-tuoi'
  },
  {
    id: 2,
    name: 'Cao Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 8000000,
    rating: 4,
    sold: 89,
    category: 'cao-sam'
  },
  {
    id: 3,
    name: 'Rượu Sâm Ngọc Linh',
    image: samTuoiImage,
    price: 5000000,
    originalPrice: 6000000,
    rating: 5,
    sold: 156,
    category: 'ruou-sam'
  }
])

const filteredProducts = computed(() => {
  let result = [...products.value]

  // Apply search filter
  if (searchQuery.value) {
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(product => 
      product.category === selectedCategory.value
    )
  }

  // Apply sorting
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

const addToCart = (product) => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product)
}
</script> 