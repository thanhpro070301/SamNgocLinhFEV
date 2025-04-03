<template>
  <div class="services">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Dịch vụ</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="service in services" :key="service.id" class="service-card bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="service.image" :alt="service.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-4">{{ service.title }}</h3>
            <p class="text-gray-600 mb-4">{{ service.description }}</p>
            <ul class="space-y-2">
              <li v-for="feature in service.features" :key="feature" class="flex items-start">
                <i class="fas fa-check-circle text-green-600 mt-1 mr-2"></i>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <button 
              @click="contactUs(service)"
              class="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const router = useRouter()

const services = ref([
  {
    id: 1,
    title: 'Tư vấn sản phẩm',
    description: 'Đội ngũ chuyên gia của chúng tôi sẽ tư vấn cho bạn lựa chọn sản phẩm Sâm Ngọc Linh phù hợp nhất với nhu cầu sức khỏe.',
    icon: 'far fa-comments',
    image: samTuoiImage,
    features: [
      'Tư vấn miễn phí',
      'Đội ngũ chuyên nghiệp',
      'Hỗ trợ 24/7',
      'Giải đáp mọi thắc mắc'
    ]
  },
  {
    id: 2,
    title: 'Giao hàng toàn quốc',
    description: 'Chúng tôi cung cấp dịch vụ giao hàng đến tận nhà trên toàn quốc với đội ngũ nhân viên chuyên nghiệp.',
    icon: 'fas fa-truck',
    image: samTuoiImage,
    features: [
      'Giao hàng tận nơi',
      'Đóng gói cẩn thận',
      'Theo dõi đơn hàng',
      'Bảo quản sản phẩm tốt'
    ]
  }
])

const contactUs = (service) => {
  router.push({
    name: 'Contact',
    query: { service: service.title }
  })
}
</script>

<style lang="scss" scoped>
.service-card {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}
</style> 