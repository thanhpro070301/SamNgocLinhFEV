<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-500 text-sm font-medium">Tổng sản phẩm</h3>
          <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <i class="fas fa-box"></i>
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-800">128</p>
        <p class="text-sm text-green-600 mt-2">
          <i class="fas fa-arrow-up"></i>
          <span class="ml-1">12% so với tháng trước</span>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-500 text-sm font-medium">Người dùng mới</h3>
          <span class="p-2 bg-green-50 text-green-600 rounded-lg">
            <i class="fas fa-users"></i>
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-800">54</p>
        <p class="text-sm text-green-600 mt-2">
          <i class="fas fa-arrow-up"></i>
          <span class="ml-1">8% so với tháng trước</span>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-500 text-sm font-medium">Đơn hàng mới</h3>
          <span class="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <i class="fas fa-shopping-cart"></i>
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-800">25</p>
        <p class="text-sm text-red-600 mt-2">
          <i class="fas fa-arrow-down"></i>
          <span class="ml-1">5% so với tháng trước</span>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-500 text-sm font-medium">Doanh thu</h3>
          <span class="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
            <i class="fas fa-dollar-sign"></i>
          </span>
        </div>
        <p class="text-2xl font-bold text-gray-800">52.5M</p>
        <p class="text-sm text-green-600 mt-2">
          <i class="fas fa-arrow-up"></i>
          <span class="ml-1">15% so với tháng trước</span>
        </p>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <i class="fas fa-box"></i>
          </span>
          <div>
            <p class="text-gray-800">Thêm sản phẩm mới: Sâm Ngọc Linh 10 năm tuổi</p>
            <p class="text-sm text-gray-500">2 giờ trước</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="p-2 bg-green-50 text-green-600 rounded-lg">
            <i class="fas fa-user"></i>
          </span>
          <div>
            <p class="text-gray-800">Người dùng mới đăng ký: Nguyễn Văn A</p>
            <p class="text-sm text-gray-500">4 giờ trước</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <i class="fas fa-shopping-cart"></i>
          </span>
          <div>
            <p class="text-gray-800">Đơn hàng mới #1234 từ Trần Thị B</p>
            <p class="text-sm text-gray-500">5 giờ trước</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here
</script> 