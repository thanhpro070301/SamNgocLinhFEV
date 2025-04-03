<template>
  <div class="contact">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Liên hệ</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contact Form -->
        <div class="contact-form">
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block mb-2">Họ và tên</label>
              <input 
                type="text" 
                v-model="form.name"
                required
                class="w-full px-4 py-2 border rounded"
              >
            </div>
            
            <div>
              <label class="block mb-2">Email</label>
              <input 
                type="email" 
                v-model="form.email"
                required
                class="w-full px-4 py-2 border rounded"
              >
            </div>
            
            <div>
              <label class="block mb-2">Số điện thoại</label>
              <input 
                type="tel" 
                v-model="form.phone"
                required
                class="w-full px-4 py-2 border rounded"
              >
            </div>
            
            <div>
              <label class="block mb-2">Nội dung</label>
              <textarea 
                v-model="form.message"
                required
                rows="4"
                class="w-full px-4 py-2 border rounded"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="contact-info space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
            <ul class="space-y-3">
              <li>
                <i class="fas fa-map-marker-alt mr-2 text-green-600"></i>
                123 Đường ABC, Quận XYZ, TP.HCM
              </li>
              <li>
                <i class="fas fa-phone mr-2 text-green-600"></i>
                (84) 123-456-789
              </li>
              <li>
                <i class="fas fa-envelope mr-2 text-green-600"></i>
                contact@samngoclinh.com
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-4">Giờ làm việc</h3>
            <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            <p>Thứ 7: 8:00 - 12:00</p>
            <p>Chủ nhật: Nghỉ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const submitForm = () => {
  // TODO: Implement form submission
  console.log('Form submitted:', form)
  // Reset form
  form.name = ''
  form.email = ''
  form.phone = ''
  form.message = ''
}
</script> 