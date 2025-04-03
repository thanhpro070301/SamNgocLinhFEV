<template>
  <div class="services-list bg-white rounded-lg p-6 mb-6 shadow-sm">
    <h3 class="text-xl font-semibold mb-4 text-green-700">DỊCH VỤ</h3>
    <ul class="space-y-3">
      <li v-for="service in services" :key="service.id" class="flex items-start">
        <span class="text-orange-500 mr-2">•</span>
        <router-link 
          :to="service.link" 
          class="text-gray-700 hover:text-green-600 transition-colors"
        >
          {{ service.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
const services = [
  {
    id: 1,
    name: 'Du lịch trải nghiệm',
    link: '/services/tourism'
  },
  {
    id: 2,
    name: 'Chăm sóc, bảo vệ Sâm',
    link: '/services/care'
  },
  {
    id: 3,
    name: 'Xây dựng trang trại',
    link: '/services/farm'
  },
  {
    id: 4,
    name: 'Hướng dẫn chế biến đặc sản địa phương',
    link: '/services/cooking'
  }
]
</script> 