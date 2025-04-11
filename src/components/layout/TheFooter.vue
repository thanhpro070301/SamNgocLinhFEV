<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Thông tin công ty -->
        <div>
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-full overflow-hidden mr-2">
              <img src="@/assets/images/logo-sam.png" alt="Sâm Ngọc Linh" class="w-full h-full object-cover">
            </div>
            <span class="text-xl font-semibold text-white">Sâm Ngọc Linh</span>
          </div>
          <p class="company-desc">
            Chuyên cung cấp các sản phẩm sâm Ngọc Linh chất lượng cao, được trồng và chăm sóc theo tiêu chuẩn nghiêm ngặt.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        
        <!-- Menu hỗ trợ khách hàng -->
        <div>
          <h3 class="footer-heading">Hỗ trợ khách hàng</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/faq" class="footer-link">
                Câu hỏi thường gặp
              </router-link>
            </li>
            <li>
              <router-link to="/shipping" class="footer-link">
                Chính sách vận chuyển
              </router-link>
            </li>
            <li>
              <router-link to="/returns" class="footer-link">
                Chính sách đổi trả
              </router-link>
            </li>
            <li>
              <router-link to="/payment" class="footer-link">
                Phương thức thanh toán
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Liên kết hữu ích -->
        <div>
          <h3 class="footer-heading">Liên kết hữu ích</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/about" class="footer-link">
                Giới thiệu
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="footer-link">
                Sản phẩm
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="footer-link">
                Tin tức
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="footer-link">
                Liên hệ
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Thông tin liên hệ -->
        <div>
          <h3 class="footer-heading">Liên hệ</h3>
          <ul class="footer-links">
            <li class="contact-item">
              <i class="fas fa-map-marker-alt mt-1 mr-2 text-gray-400"></i>
              <span class="text-gray-400">
                118 Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng
              </span>
            </li>
            <li class="contact-item">
              <i class="fas fa-phone-alt mr-2 text-gray-400"></i>
              <span class="text-gray-400">
                <a href="tel:+84912345678" class="contact-link">
                  0912 345 678
                </a>
              </span>
            </li>
            <li class="contact-item">
              <i class="fas fa-envelope mr-2 text-gray-400"></i>
              <span class="text-gray-400">
                <a href="mailto:info@samngoclinh.com" class="contact-link">
                  info@samngoclinh.com
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Phần chân trang -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            &copy; {{ currentYear }} Sâm Ngọc Linh. Tất cả các quyền được bảo lưu.
          </p>
          <div class="legal-links">
            <router-link to="/privacy" class="legal-link">
              Chính sách bảo mật
            </router-link>
            <router-link to="/terms" class="legal-link">
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
  background-color: #1f2937; // gray-900
  color: $white;
  padding-top: $spacing-xl;
  padding-bottom: $spacing-md;
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
  color: #9ca3af; // gray-400
  margin-bottom: $spacing-md;
}

.social-links {
  display: flex;
  gap: $spacing-md;
}

.social-link {
  color: #9ca3af; // gray-400
  transition: color 0.3s;
  
  &:hover {
    color: $white;
  }
}

.footer-heading {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-md;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.footer-link {
  color: #9ca3af; // gray-400
  transition: color 0.3s;
  
  &:hover {
    color: $white;
  }
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-sm;
}

.contact-link {
  color: #9ca3af; // gray-400
  transition: color 0.3s;
  
  &:hover {
    color: $white;
  }
}

.footer-bottom {
  border-top: 1px solid #374151; // gray-800
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  
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
  transition: color 0.3s;
  
  &:hover {
    color: $white;
  }
}
</style> 