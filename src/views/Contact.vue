<template>
  <div class="contact-page min-h-screen relative">
    <!-- Aurora Background -->
    <AuroraBackground />
    
    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Page Header -->
      <section class="page-header py-20 relative">
        <div class="container mx-auto px-4">
          <div class="text-center" data-aos="fade-up">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <span class="block text-gray-800 dark:text-white">Liên Hệ</span>
              <span class="text-gradient bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Kết Nối Với Chúng Tôi
              </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-8">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc
            </p>
          </div>
        </div>
      </section>
      
      <!-- Contact Info and Form Section -->
      <section class="contact-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="glass-container p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Contact Info -->
              <div class="contact-info" data-aos="fade-right">
                <h2 class="text-3xl font-bold mb-8 text-gray-800">Thông Tin Liên Hệ</h2>
                
                <div class="space-y-8">
                  <div class="contact-item flex items-start">
                    <div class="contact-icon w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                      <i class="fas fa-map-marker-alt text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 mb-2">Địa Chỉ</h3>
                      <p>123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  
                  <div class="contact-item flex items-start">
                    <div class="contact-icon w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                      <i class="fas fa-phone-alt text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 mb-2">Điện Thoại</h3>
                      <p>
                        <a href="tel:+84901234567" class="hover:text-green-600 transition-colors">+84 90 123 4567</a>
                      </p>
                      <p>
                        <a href="tel:+84901234568" class="hover:text-green-600 transition-colors">+84 90 123 4568</a>
                      </p>
                    </div>
                  </div>
                  
                  <div class="contact-item flex items-start">
                    <div class="contact-icon w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                      <i class="fas fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                      <p>
                        <a href="mailto:info@samngoclinh.com" class="hover:text-green-600 transition-colors">info@samngoclinh.com</a>
                      </p>
                      <p>
                        <a href="mailto:support@samngoclinh.com" class="hover:text-green-600 transition-colors">support@samngoclinh.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div class="contact-item flex items-start">
                    <div class="contact-icon w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                      <i class="fas fa-clock text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 mb-2">Giờ Làm Việc</h3>
                      <p>Thứ Hai - Thứ Sáu: 8:00 - 17:30</p>
                      <p>Thứ Bảy: 8:00 - 12:00</p>
                      <p>Chủ Nhật: Nghỉ</p>
                    </div>
                  </div>
                </div>
                
                <!-- Social Media Links -->
                <div class="social-links mt-10">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">Kết nối với chúng tôi</h3>
                  <div class="flex space-x-4">
                    <a href="#" class="neu-social-btn" aria-label="Facebook">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="neu-social-btn" aria-label="Instagram">
                      <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" class="neu-social-btn" aria-label="Twitter">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="neu-social-btn" aria-label="YouTube">
                      <i class="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <!-- Contact Form with Neumorphism -->
              <div class="contact-form" data-aos="fade-left" data-aos-delay="200">
                <h2 class="text-3xl font-bold mb-8 text-gray-800">Gửi Tin Nhắn</h2>
                
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-6">
                    <!-- Name Input -->
                    <div class="form-group">
                      <label for="name" class="block text-gray-700 mb-2 font-medium">Họ và tên</label>
                      <div class="neu-input-container">
                        <input 
                          type="text" 
                          id="name" 
                          v-model="form.name" 
                          class="neu-input w-full"
                          placeholder="Nhập họ và tên của bạn"
                          required
                        >
                      </div>
                    </div>
                    
                    <!-- Email Input -->
                    <div class="form-group">
                      <label for="email" class="block text-gray-700 mb-2 font-medium">Email</label>
                      <div class="neu-input-container">
                        <input 
                          type="email" 
                          id="email" 
                          v-model="form.email" 
                          class="neu-input w-full"
                          placeholder="Nhập địa chỉ email của bạn"
                          required
                        >
                      </div>
                    </div>
                    
                    <!-- Phone Input -->
                    <div class="form-group">
                      <label for="phone" class="block text-gray-700 mb-2 font-medium">Số điện thoại</label>
                      <div class="neu-input-container">
                        <input 
                          type="tel" 
                          id="phone" 
                          v-model="form.phone" 
                          class="neu-input w-full"
                          placeholder="Nhập số điện thoại của bạn"
                        >
                      </div>
                    </div>
                    
                    <!-- Subject Input -->
                    <div class="form-group">
                      <label for="subject" class="block text-gray-700 mb-2 font-medium">Tiêu đề</label>
                      <div class="neu-input-container">
                        <input 
                          type="text" 
                          id="subject" 
                          v-model="form.subject" 
                          class="neu-input w-full"
                          placeholder="Nhập tiêu đề tin nhắn"
                          required
                        >
                      </div>
                    </div>
                    
                    <!-- Message Textarea -->
                    <div class="form-group">
                      <label for="message" class="block text-gray-700 mb-2 font-medium">Nội dung tin nhắn</label>
                      <div class="neu-textarea-container">
                        <textarea 
                          id="message" 
                          v-model="form.message" 
                          class="neu-textarea w-full" 
                          rows="5"
                          placeholder="Nhập nội dung tin nhắn của bạn"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Submit Button -->
                    <div class="form-group">
                      <NeuButton 
                        type="submit"
                        variant="primary" 
                        size="lg"
                        :fullWidth="true"
                        :disabled="isSubmitting"
                      >
                        <template #icon-left v-if="!isSubmitting">
                          <i class="fas fa-paper-plane"></i>
                        </template>
                        <template #icon-left v-else>
                          <i class="fas fa-spinner fa-spin"></i>
                        </template>
                        {{ isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
                      </NeuButton>
                    </div>
                  </div>
                </form>
                
                <!-- Success Message -->
                <div v-if="showSuccess" class="mt-6 p-4 bg-green-100 border border-green-200 rounded-xl text-green-700 text-center">
                  <div class="flex items-center justify-center mb-2">
                    <i class="fas fa-check-circle text-2xl mr-2"></i>
                    <span class="font-medium">Tin nhắn đã được gửi thành công!</span>
                  </div>
                  <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Map Section -->
      <section class="map-section py-16 relative z-10">
        <div class="container mx-auto px-4">
          <div class="clay-container bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-xl" data-aos="fade-up">
            <div class="aspect-[16/9] overflow-hidden rounded-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197897!2d106.70232171535454!3d10.777868992320659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a4d74676!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1625647796175!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                class="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuroraBackground from '@/components/AuroraBackground.vue';
import NeuButton from '@/components/NeuButton.vue';

// Form state
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Form submitted successfully
    showSuccess.value = true;
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.text-gradient {
  -webkit-background-clip: text;
  background-clip: text;
}

.glass-container {
  position: relative;
  overflow: hidden;
}

/* Glass-like decoration elements */
.glass-container::before,
.glass-container::after {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(59, 130, 246, 0.15));
  filter: blur(40px);
  z-index: -1;
}

.glass-container::before {
  top: -100px;
  left: -100px;
}

.glass-container::after {
  bottom: -100px;
  right: -100px;
  background: linear-gradient(45deg, rgba(134, 239, 172, 0.15), rgba(220, 252, 231, 0.15));
}

/* Neumorphic Social Buttons */
.neu-social-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f0fdf4;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.1),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
}

.neu-social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    6px 6px 10px rgba(0, 0, 0, 0.1),
    -6px -6px 10px rgba(255, 255, 255, 0.8);
  color: white;
  background: #16a34a;
}

/* Neumorphic Input Styles */
.neu-input-container,
.neu-textarea-container {
  position: relative;
  border-radius: 1rem;
  background: #f0fdf4;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8);
}

.neu-input,
.neu-textarea {
  width: 100%;
  background: transparent;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  color: #333;
  outline: none;
  border-radius: 1rem;
}

.neu-input::placeholder,
.neu-textarea::placeholder {
  color: #9ca3af;
}

.clay-container {
  position: relative;
  overflow: hidden;
}
</style> 