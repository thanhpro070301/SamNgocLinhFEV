<template>
  <div class="news-sidebar">
    <h3 class="text-lg font-bold mb-4">Bài viết mới nhất</h3>
    <div v-for="item in newsItems" :key="item.id" class="flex mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
      <img :src="item.image" :alt="item.title" class="w-20 h-20 object-cover rounded">
      <div class="ml-3">
        <h4 class="font-medium text-sm hover:text-green-600 transition-colors">
          <a :href="item.link">{{ item.title }}</a>
        </h4>
        <p class="text-xs text-gray-500 mt-1">{{ item.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import samTuoiImage from '@/assets/images/products/sam-tuoi.png'

const newsItems = ref([
  {
    id: 1,
    title: 'Sâm Ngọc Linh - Báu vật của núi rừng Việt Nam',
    image: samTuoiImage,
    date: '15/05/2023',
    link: '/news/1'
  },
  {
    id: 2,
    title: 'Công dụng tuyệt vời của Sâm Ngọc Linh đối với sức khỏe',
    image: samTuoiImage,
    date: '02/06/2023',
    link: '/news/2'
  },
  {
    id: 3,
    title: 'Cách phân biệt Sâm Ngọc Linh thật và giả',
    image: samTuoiImage,
    date: '18/06/2023',
    link: '/news/3'
  }
])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 