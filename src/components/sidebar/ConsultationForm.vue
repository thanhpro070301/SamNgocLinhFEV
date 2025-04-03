<template>
  <div class="consultation-form bg-green-600 rounded-lg p-6 text-white mb-6">
    <h3 class="text-xl font-semibold mb-4">TƯ VẤN</h3>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <input 
            type="text" 
            v-model="formData.fullName" 
            placeholder="Họ tên" 
            class="w-full px-4 py-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
        </div>
        <div>
          <input 
            type="tel" 
            v-model="formData.phone" 
            placeholder="SĐT" 
            class="w-full px-4 py-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
        </div>
        <div>
          <input 
            type="text" 
            v-model="formData.address" 
            placeholder="Địa chỉ" 
            class="w-full px-4 py-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
        </div>
        <div>
          <textarea 
            v-model="formData.message" 
            placeholder="Nội dung" 
            rows="3"
            class="w-full px-4 py-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          ></textarea>
        </div>
        <div class="flex gap-2">
          <button 
            type="submit"
            class="flex-1 bg-yellow-500 text-white px-6 py-2 rounded font-medium hover:bg-yellow-600 transition-colors"
          >
            GỬI
          </button>
          <button 
            type="reset"
            @click="resetForm"
            class="flex-1 bg-gray-500 text-white px-6 py-2 rounded font-medium hover:bg-gray-600 transition-colors"
          >
            HỦY
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  fullName: '',
  phone: '',
  address: '',
  message: ''
})

const handleSubmit = () => {
  // TODO: Implement form submission logic
  console.log('Form submitted:', formData.value)
  // Reset form after submission
  resetForm()
}

const resetForm = () => {
  formData.value = {
    fullName: '',
    phone: '',
    address: '',
    message: ''
  }
}
</script> 