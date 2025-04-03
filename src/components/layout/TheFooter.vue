<template>
  <footer class="footer bg-green-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="footer-section">
          <h3 class="text-xl font-bold mb-4">Về chúng tôi</h3>
          <p class="mb-4">Sâm Ngọc Linh - Chuyên cung cấp các sản phẩm sâm Ngọc Linh chất lượng cao, được trồng và chăm sóc theo tiêu chuẩn nghiêm ngặt.</p>
          <div class="social-links flex space-x-4">
            <a href="#" class="hover:text-green-400"><i class="fab fa-facebook"></i></a>
            <a href="#" class="hover:text-green-400"><i class="fab fa-youtube"></i></a>
            <a href="#" class="hover:text-green-400"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="text-xl font-bold mb-4">Liên hệ</h3>
          <ul class="space-y-2">
            <li><i class="fas fa-map-marker-alt mr-2"></i> Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
            <li><i class="fas fa-phone mr-2"></i> Điện thoại: (84) 123-456-789</li>
            <li><i class="fas fa-envelope mr-2"></i> Email: contact@samngoclinh.com</li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="text-xl font-bold mb-4">Đăng ký nhận tin</h3>
          <form @submit.prevent="subscribeNewsletter" class="space-y-4">
            <input 
              type="email" 
              v-model="email"
              placeholder="Nhập email của bạn"
              class="w-full px-4 py-2 rounded text-gray-800"
            >
            <button 
              type="submit"
              class="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-green-700 text-center">
        <p>&copy; {{ new Date().getFullYear() }} Sâm Ngọc Linh. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const subscribeNewsletter = () => {
  // TODO: Implement newsletter subscription
  console.log('Subscribe:', email.value)
  email.value = ''
}
</script>

<style lang="scss" scoped>
.footer {
  .social-links {
    a {
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }
  }
}
</style> 