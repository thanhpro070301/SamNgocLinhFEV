<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      <nav class="p-4">
        <router-link 
          to="/admin" 
          class="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 mb-1"
          exact
        >
          <i class="fas fa-home"></i>
          Dashboard
        </router-link>
        <router-link 
          to="/admin/products" 
          class="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 mb-1"
        >
          <i class="fas fa-box"></i>
          Quản lý sản phẩm
        </router-link>
        <router-link 
          to="/admin/services" 
          class="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 mb-1"
        >
          <i class="fas fa-concierge-bell"></i>
          Quản lý dịch vụ
        </router-link>
        <router-link 
          to="/admin/news" 
          class="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 mb-1"
        >
          <i class="fas fa-newspaper"></i>
          Quản lý bảng tin
        </router-link>
        <router-link 
          to="/admin/users" 
          class="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 mb-1"
        >
          <i class="fas fa-users"></i>
          Quản lý người dùng
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 p-8">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Welcome back, Admin</h2>
          <p class="text-gray-600">Here's what's happening with your store today.</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-gray-600 hover:text-gray-800">
            <i class="fas fa-bell"></i>
          </button>
          <div class="flex items-center gap-2">
            <img 
              src="https://ui-avatars.com/api/?name=Admin" 
              alt="Admin" 
              class="w-8 h-8 rounded-full"
            >
            <span class="text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </header>

      <!-- Router View for nested routes -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Component logic can be added here
</script>

<style scoped>
.router-link-active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.router-link-exact-active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
</style> 