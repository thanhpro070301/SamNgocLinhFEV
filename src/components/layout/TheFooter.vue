<template>
  <footer class="footer relative overflow-hidden">
    <!-- Decorative elements for glassmorphism effect -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-green-600 opacity-10 filter blur-3xl"></div>
      <div class="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-green-400 opacity-10 filter blur-3xl"></div>
      <div class="absolute bottom-1/3 left-1/2 w-72 h-72 rounded-full bg-green-200 opacity-20 filter blur-3xl"></div>
    </div>
    
    <div class="container relative z-10">
      <div class="footer-grid bg-white/10 backdrop-blur-md rounded-t-xl shadow-lg border border-white/10 p-8">
        <!-- Thông tin công ty -->
        <div>
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden mr-2 shadow-glass border border-white/30">
              <img src="@/assets/images/logo-sam.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
            <span class="text-xl font-semibold text-white">Sâm Ngọc Linh</span>
          </div>
          <p class="company-desc">
            Chuyên cung cấp các sản phẩm sâm Ngọc Linh chất lượng cao, được trồng và chăm sóc theo tiêu chuẩn nghiêm ngặt.
          </p>
          <div class="social-links">
            <a href="#" class="social-link bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        
        <!-- Menu hỗ trợ khách hàng -->
        <div>
          <h3 class="footer-heading">Hỗ trợ khách hàng</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/faq" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Câu hỏi thường gặp
              </router-link>
            </li>
            <li>
              <router-link to="/shipping" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Chính sách vận chuyển
              </router-link>
            </li>
            <li>
              <router-link to="/returns" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Chính sách đổi trả
              </router-link>
            </li>
            <li>
              <router-link to="/payment" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Phương thức thanh toán
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Liên kết hữu ích -->
        <div>
          <h3 class="footer-heading">Liên kết hữu ích</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/about" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Giới thiệu
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Sản phẩm
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Tin tức
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="footer-link hover:text-green-300 transition-colors duration-300">
                <i class="fas fa-angle-right mr-2 text-green-400/70"></i> Liên hệ
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Thông tin liên hệ -->
        <div>
          <h3 class="footer-heading">Liên hệ</h3>
          <ul class="footer-links">
            <li class="contact-item bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-3 transition-all duration-300 hover:bg-white/10">
              <i class="fas fa-map-marker-alt mt-1 mr-2 text-green-400"></i>
              <span class="text-gray-300">
                118 Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng
              </span>
            </li>
            <li class="contact-item bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-3 transition-all duration-300 hover:bg-white/10">
              <i class="fas fa-phone-alt mr-2 text-green-400"></i>
              <span class="text-gray-300">
                <a href="tel:+84912345678" class="contact-link hover:text-green-300">
                  0912 345 678
                </a>
              </span>
            </li>
            <li class="contact-item bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-3 transition-all duration-300 hover:bg-white/10">
              <i class="fas fa-envelope mr-2 text-green-400"></i>
              <span class="text-gray-300">
                <a href="mailto:info@samngoclinh.com" class="contact-link hover:text-green-300">
                  info@samngoclinh.com
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Phần chân trang -->
      <div class="footer-bottom bg-black/40 backdrop-blur-lg border-t border-white/5">
        <div class="footer-bottom-content py-4">
          <p class="copyright">
            &copy; {{ currentYear }} Sâm Ngọc Linh. Tất cả các quyền được bảo lưu.
          </p>
          <div class="legal-links">
            <router-link to="/privacy" class="legal-link hover:text-green-300 transition-colors duration-300">
              Chính sách bảo mật
            </router-link>
            <router-link to="/terms" class="legal-link hover:text-green-300 transition-colors duration-300">
              Điều khoản sử dụng
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Lấy năm hiện tại cho copyright
const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.footer {
  background: linear-gradient(to bottom, #1a2533, #111827); // dark gradient
  color: $white;
  padding-top: $spacing-xl;
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/assets/images/bg-pattern.png');
    background-size: 300px;
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
  }
}

.shadow-glass {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $spacing-md;
  
  @media (min-width: $breakpoint-sm) {
    padding: 0 $spacing-lg;
  }
  
  @media (min-width: $breakpoint-lg) {
    padding: 0 $spacing-xl;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;
  
  @media (min-width: $breakpoint-md) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.company-desc {
  color: #d1d5db; // gray-300
  margin-bottom: $spacing-md;
}

.social-links {
  display: flex;
  gap: $spacing-md;
}

.footer-heading {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-md;
  color: white;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 40px;
    background: linear-gradient(to right, rgba(74, 222, 128, 0.6), rgba(74, 222, 128, 0.1));
    border-radius: 2px;
  }
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.footer-link {
  color: #d1d5db; // gray-300
}

.contact-item {
  display: flex;
  align-items: flex-start;
}

.contact-link {
  color: #d1d5db; // gray-300
}

.footer-bottom {
  margin-top: 0;
  padding-top: 0;
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  
  @media (min-width: $breakpoint-md) {
    flex-direction: row;
  }
}

.copyright {
  color: #9ca3af; // gray-400
  font-size: 0.875rem;
  margin-bottom: $spacing-md;
  
  @media (min-width: $breakpoint-md) {
    margin-bottom: 0;
  }
}

.legal-links {
  display: flex;
  gap: $spacing-md;
}

.legal-link {
  color: #9ca3af; // gray-400
  font-size: 0.875rem;
}
</style> 