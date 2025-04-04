<template>
  <div class="about">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Về chúng tôi</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="about-content">
          <p class="mb-4">
            Sâm Ngọc Linh là một trong những loại dược liệu quý hiếm bậc nhất của Việt Nam, được trồng và phát triển tại vùng núi Ngọc Linh, tỉnh Kon Tum và Quảng Nam.
          </p>
          <p class="mb-4">
            Chúng tôi tự hào là đơn vị tiên phong trong việc nghiên cứu, phát triển và cung cấp các sản phẩm từ Sâm Ngọc Linh với chất lượng cao nhất đến tay người tiêu dùng.
          </p>
          <p class="mb-4">
            Với hơn 10 năm kinh nghiệm trong lĩnh vực, chúng tôi cam kết mang đến những sản phẩm chất lượng, được kiểm định nghiêm ngặt và đảm bảo nguồn gốc xuất xứ rõ ràng.
          </p>
        </div>
        <div class="about-image">
          <img :src="samTuoiImage" alt="Sâm Ngọc Linh" class="rounded-lg shadow-xl">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const samTuoiImage = '/assets/images/products/sam-tuoi.png'
</script> 