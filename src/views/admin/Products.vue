<template>
  <div class="products-admin-page min-h-screen bg-gray-50">
    <AdminHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <button 
          @click="openAddProductModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Thêm sản phẩm
        </button>
      </div>
      
      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                @keyup.enter="applySearch"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            </div>
            
          <!-- Category filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select 
                v-model="selectedCategory" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              @change="applySearch"
              >
                <option value="">Tất cả danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
                </option>
              </select>
            </div>
            
          <!-- Status filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select 
              v-model="statusFilter" 
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              @change="applySearch"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Không bán</option>
            </select>
          </div>
          
          <!-- Stock filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
            <select
              v-model="stockFilter"
              @change="applySearch"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả sản phẩm</option>
              <option value="in-stock">Còn hàng</option>
              <option value="out-of-stock">Hết hàng</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end mt-4">
            <button 
            @click="resetFilters" 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
            >
            <i class="fas fa-redo-alt mr-2"></i> Đặt lại bộ lọc
            </button>
          </div>
        </div>
        
      <!-- Error message -->
      <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-md text-red-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
            <p class="mt-1 text-sm">{{ error }}</p>
            <div v-if="error.includes('đăng nhập')" class="mt-3">
              <button 
                @click="redirectToLogin"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-flex items-center"
              >
                <i class="fas fa-sign-in-alt mr-2"></i> Đăng nhập lại
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center my-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>
      
      <!-- Products Table -->
      <div v-else-if="products.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :class="[
                'transition-colors', 
                product.stock <= 0 
                  ? 'hover:bg-red-50 bg-red-50/30' 
                  : 'hover:bg-gray-50'
              ]"
            >
              <!-- Product Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                  <div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    <img 
                      :src="product.image || '/assets/images/products/sam-tuoi.png'" 
                      :alt="product.name"
                      class="h-full w-full object-cover object-center"
                      @error="$event.target.src = '/assets/images/products/sam-tuoi.png'"
                    >
                      </div>
                  <div class="ml-4 max-w-xs">
                    <div class="text-sm font-semibold text-gray-900 line-clamp-1">
                      {{ product.name }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ product.slug }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">
                  <span class="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                    {{ categories.find(c => c.id === product.categoryId)?.name || 'Chưa phân loại' }}
                  </span>
                </div>
                  </td>
                  
                  <!-- Price -->
                  <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <div class="text-sm font-medium" :class="{'text-green-600': product.stock > 0, 'text-gray-500': product.stock <= 0}">
                    {{ formatPrice(product.price) }}
                  </div>
                  <div v-if="product.originalPrice && product.originalPrice > product.price" class="text-xs text-gray-500 line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </div>
                    </div>
                  </td>
                  
                  <!-- Stock -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model.number="product.stock" 
                      min="0"
                      @change="quickUpdateStock(product)"
                      :disabled="isUpdating[product.id]"
                      class="w-20 px-3 py-1.5 border rounded-md text-center focus:ring-blue-500 focus:outline-none"
                      :class="{
                        'bg-red-50 border-red-300 text-red-700 focus:border-red-500': product.stock <= 0,
                        'bg-yellow-50 border-yellow-300 text-yellow-700 focus:border-yellow-500': product.stock > 0 && product.stock <= 5,
                        'bg-green-50 border-green-300 text-green-700 focus:border-green-500': product.stock > 5
                      }"
                    >
                    <!-- Mũi tên lên xuống tùy chỉnh, nếu cần -->
                  </div>
                  <div v-if="isUpdating[product.id]" class="ml-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                  
                  <!-- Badge cải tiến cho trạng thái tồn kho -->
                  <div v-if="product.stock <= 0" class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200 shadow-sm">
                    Hết hàng
                  </div>
                  <div v-else-if="product.stock <= 5" class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                    Sắp hết ({{product.stock}})
                  </div>
                  <div v-else class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200 shadow-sm">
                    Còn hàng
                  </div>
                </div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <select 
                    v-model="product.status"
                    @change="quickUpdateStatus(product)"
                    :disabled="isUpdating[product.id]"
                    class="px-3 py-1.5 text-sm font-semibold rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="getStatusClass(product.status)"
                  >
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Không bán</option>
                  </select>
                  <div v-if="isUpdating[product.id]" class="ml-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                </div>
                  </td>
                  
                  <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex items-center justify-center space-x-3">
                      <button 
                    @click="openEditProductModal(product)"
                    :class="[
                      'p-1.5 rounded-md transition-colors', 
                      product.stock <= 0 
                        ? 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100' 
                        : 'text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100'
                    ]"
                        title="Chỉnh sửa"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                    @click="confirmDeleteProduct(product.id)"
                    class="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                        title="Xóa"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          
          <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 0"
              :class="[
                currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md'
              ]"
            >
              Trước
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages - 1"
              :class="[
                currentPage >= totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md'
              ]"
            >
              Sau
            </button>
          </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                Hiển thị <span class="font-medium">{{ currentPage * pageSize + 1 }}</span> đến 
                <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, totalItems) }}</span> của 
                <span class="font-medium">{{ totalItems }}</span> sản phẩm
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                  @click="prevPage"
                  :disabled="currentPage === 0"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                <!-- Page numbers -->
                <template v-for="i in totalPages" :key="i">
                  <button
                    v-if="Math.abs(i - 1 - currentPage) < 2 || i === 1 || i === totalPages"
                    @click="goToPage(i - 1)"
                    :class="[
                      currentPage === i - 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                  >
                    {{ i }}
                  </button>
                  <span
                    v-else-if="i === 2 || i === totalPages - 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages - 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      
      <!-- Empty state -->
      <div v-else-if="!isLoading && products.length === 0" class="bg-white rounded-lg shadow-md py-12 px-6 text-center">
        <div class="flex flex-col items-center max-w-md mx-auto">
          <div class="bg-gray-100 p-5 rounded-full">
            <i class="fas fa-box-open text-gray-400 text-5xl"></i>
      </div>
          <h3 class="text-xl font-medium text-gray-900 mt-5">Không có sản phẩm nào</h3>
          <p class="text-gray-500 mt-2 mb-6">
            Bạn chưa có sản phẩm nào trong hệ thống. Hãy thêm sản phẩm đầu tiên để bắt đầu quản lý cửa hàng của bạn!
          </p>
          <button 
            @click="openAddProductModal"
            class="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-plus mr-2"></i> Thêm sản phẩm mới
          </button>
        </div>
      </div>

      <!-- No results after filtering -->
      <div v-else-if="!isLoading && filteredProducts.length === 0" class="bg-white rounded-lg shadow-md py-12 px-6 text-center">
        <div class="flex flex-col items-center max-w-md mx-auto">
          <div class="bg-yellow-50 p-5 rounded-full">
            <i class="fas fa-search text-yellow-400 text-5xl"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mt-5">Không tìm thấy sản phẩm</h3>
          <p class="text-gray-500 mt-2 mb-6">
            Không có sản phẩm nào phù hợp với bộ lọc đã chọn. Vui lòng thử lại với bộ lọc khác.
          </p>
          <button 
            @click="resetFilters"
            class="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <i class="fas fa-redo-alt mr-2"></i> Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
                </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Product Name -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span class="text-red-500">*</span></label>
                    <input
                type="text" 
                      v-model="productForm.name"
                @input="updateSlug"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên sản phẩm"
                required
              >
            </div>
            
            <!-- Product Slug -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Slug <span class="text-red-500">*</span>
                <span class="text-gray-500 text-xs font-normal">(Dùng cho URL)</span>
              </label>
              <input
                      type="text"
                v-model="productForm.slug"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ten-san-pham"
                      required
                    >
                  </div>
                  
                  <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục <span class="text-red-500">*</span></label>
                    <select
                v-model="productForm.categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
            <!-- Product Status -->
                    <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                v-model="productForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Đang bán</option>
                <option value="INACTIVE">Không bán</option>
              </select>
            </div>
            
            <!-- Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) <span class="text-red-500">*</span></label>
                      <input
                        type="number"
                v-model.number="productForm.price"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập giá bán"
                        min="0"
                        required
                      >
                    </div>
            
            <!-- Original Price -->
                    <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Giá gốc (VNĐ)
                <span class="text-gray-500 text-xs font-normal">(để hiển thị giá khuyến mãi)</span>
              </label>
                      <input
                        type="number"
                v-model.number="productForm.originalPrice"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập giá gốc"
                        min="0"
                      >
                  </div>
                  
            <!-- Stock -->
                    <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho <span class="text-red-500">*</span></label>
                      <input
                        type="number"
                v-model.number="productForm.stock"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số lượng tồn kho"
                        min="0"
                        required
                      >
                    </div>
            
            <!-- Image URL -->
                    <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
              <input 
                type="text" 
                v-model="productForm.image"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập đường dẫn hình ảnh"
              >
                  </div>
                  
                  <!-- Description -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                    <textarea
                      v-model="productForm.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mô tả sản phẩm"
                    ></textarea>
            </div>
          </div>
                  </div>
                  
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button 
            type="button"
            @click="saveProduct"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </button>
                  </div>
              </div>
            </div>

    <!-- Confirm Delete Dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
        <!-- Confirm dialog -->
        <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Xác nhận xóa sản phẩm
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể khôi phục.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="handleDeleteConfirm" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Xóa sản phẩm
            </button>
            <button 
              @click="showDeleteConfirm = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import api from '@/api'
import notificationService from '@/utils/notificationService'

// State
const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const error = ref(null)

// Pagination
const currentPage = ref(0)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

// Search filters
const searchTerm = ref('')
const selectedCategory = ref('')
const stockFilter = ref('all')
const statusFilter = ref('')

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentProductId = ref(null)

// Product form
const productForm = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: 0,
  image: '',
  categoryId: null,
  stock: 0,
  status: 'ACTIVE'
})

// State for quick updates
const isUpdating = ref({})

// Computed properties
const filteredProducts = computed(() => {
  let result = products.value

  // Filter by search term
    if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(search) || 
      (product.description && product.description.toLowerCase().includes(search))
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    result = result.filter(product => String(product.categoryId) === String(selectedCategory.value))
  }

  // Filter by stock
  if (stockFilter.value === 'in-stock') {
    result = result.filter(product => product.stock > 0)
  } else if (stockFilter.value === 'out-of-stock') {
    result = result.filter(product => product.stock <= 0)
  }

  // Filter by status
  if (statusFilter.value) {
    result = result.filter(product => product.status === statusFilter.value)
  }

  return result
})

// Convert string to slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Auto-generate slug when name changes
function updateSlug() {
  if (!isEditMode.value || (isEditMode.value && !productForm.slug)) {
    productForm.slug = slugify(productForm.name)
  }
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(price)
}

// Status display
function getStatusDisplay(product) {
  if (product.status === 'ACTIVE') {
    return { text: 'Đang bán', class: 'bg-green-100 text-green-800' }
  }
  return { text: 'Không bán', class: 'bg-gray-100 text-gray-800' }
}

// Hàm lấy tên danh mục theo id
function getCategoryName(categoryId) {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : 'Chưa phân loại'
}

// Hàm xác định trạng thái sản phẩm
function getProductStatus(product) {
  // Nếu trạng thái không hợp lệ hoặc là OUT_OF_STOCK, chuyển về INACTIVE
  if (!product.status || product.status === 'OUT_OF_STOCK' || !['ACTIVE', 'INACTIVE'].includes(product.status)) {
    return 'INACTIVE';
  }
  return product.status;
}

// API calls
async function fetchCategories() {
  try {
    console.log('Đang tải danh mục sản phẩm...')
    
    try {
      // Thử gọi API danh mục
      const response = await api.category.getCategories()
      if (response.data && response.data.length > 0) {
        console.log('Đã tải danh mục từ API:', response.data)
        categories.value = response.data
  } else {
        console.log('API trả về danh mục rỗng')
        categories.value = []
      }
    } catch (apiError) {
      console.error('Lỗi khi tải danh mục từ API:', apiError)
      categories.value = []
    }
  } catch (error) {
    console.error('Lỗi chung khi tải danh mục:', error)
    categories.value = []
  }
}

function redirectToLogin() {
  window.location.href = '/admin/login'
}

// Cập nhật hàm fetchAllProducts dựa theo API mới
async function fetchAllProducts() {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('=== Bắt đầu tải sản phẩm ===');
    
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token');
    if (!token) {
      error.value = 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
      isLoading.value = false;
      setTimeout(() => { redirectToLogin(); }, 3000);
      return;
    }
    
    // Thiết lập params - số lượng lớn để lấy tất cả sản phẩm
    const params = {
      page: 0,
      size: 10000 // Số lượng lớn để đảm bảo tải tất cả sản phẩm
    };
    
    // Chỉ thêm tham số status khi người dùng chọn lọc theo trạng thái cụ thể
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    
    console.log('Đang tải sản phẩm với params:', params);
    
    // Sử dụng axios trực tiếp
    const axios = (await import('axios')).default;
    const response = await axios.get('/products', {
      baseURL: 'http://localhost:8080/api',
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined
      }
    });
    
    console.log('API trả về:', response.data);
    
    // Kiểm tra cấu trúc và xử lý dữ liệu từ API
    if (response.data) {
      let apiProducts = [];
      
      // Kiểm tra cấu trúc phản hồi từ API
      if (response.data.content && Array.isArray(response.data.content)) {
        // Cấu trúc phổ biến: { content: [...], totalElements, totalPages }
        apiProducts = response.data.content;
        totalItems.value = response.data.totalElements || apiProducts.length;
        totalPages.value = response.data.totalPages || 1;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        // Cấu trúc thay thế: { products: [...], totalItems, totalPages }
        apiProducts = response.data.products;
        totalItems.value = response.data.totalItems || apiProducts.length;
        totalPages.value = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        // Mảng trực tiếp không có phân trang
        apiProducts = response.data;
        totalItems.value = apiProducts.length;
        totalPages.value = 1;
      }
      
      console.log(`Đã tải ${apiProducts.length} sản phẩm`);
      
      if (apiProducts.length > 0) {
        // Cập nhật danh sách sản phẩm
        products.value = apiProducts.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image || '/assets/images/products/sam-tuoi.png',
          categoryId: p.categoryId,
          categoryName: getCategoryName(p.categoryId),
          stock: p.stock || 0,
          status: p.status || 'INACTIVE',
          slug: p.slug || slugify(p.name)
        }));
        
        console.log(`Đã tải tổng cộng ${products.value.length} sản phẩm từ API`);
      } else {
        products.value = [];
        console.log('Không có sản phẩm nào được tải');
      }
    } else {
      products.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      console.log('Không có dữ liệu từ API');
    }
  } catch (err) {
    console.error('Lỗi khi tải sản phẩm:', err);
    error.value = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
    products.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    isLoading.value = false;
  }
}

// Modal functions
function openAddProductModal() {
  isEditMode.value = false
  currentProductId.value = null
  
  // Reset form
    Object.assign(productForm, {
      name: '',
    slug: '',
    description: '',
      price: 0,
    originalPrice: 0,
    image: '',
    categoryId: categories.value.length > 0 ? categories.value[0].id : null,
      stock: 0,
    status: 'ACTIVE'
  })
  
  isModalOpen.value = true
}

function openEditProductModal(product) {
  isEditMode.value = true
  currentProductId.value = product.id
  
  // Populate form with product data
  Object.assign(productForm, {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    image: product.image,
    categoryId: product.categoryId,
    stock: product.stock,
    status: product.status
  })
  
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// Save product
async function saveProduct() {
  if (!productForm.name || !productForm.price) {
    notificationService.show('Vui lòng điền đầy đủ thông tin sản phẩm', {
      title: 'Lỗi',
      type: 'error'
    })
    return
  }
  
  isLoading.value = true
  
  try {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      notificationService.show('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', {
        title: 'Lỗi xác thực',
        type: 'error'
      })
      isLoading.value = false
      // Tự động chuyển hướng đến trang đăng nhập sau 3 giây
      setTimeout(() => {
        redirectToLogin()
      }, 3000)
      return
    }
    
    // Chuyển đổi giá và stock thành số
    const productData = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      stock: Number(productForm.stock),
    }
    
    try {
      let response
      
      if (isEditMode.value) {
        console.log(`Đang cập nhật sản phẩm ID: ${currentProductId.value}`)
        
        // Sử dụng API wrapper
        response = await api.product.updateProduct(currentProductId.value, productData)
        
        console.log('Sản phẩm đã được cập nhật:', response.data)
        
        // Cập nhật sản phẩm trong danh sách
        const index = products.value.findIndex(p => p.id === response.data.id)
    if (index !== -1) {
          // Đảm bảo trạng thái hợp lệ khi cập nhật lại danh sách
          products.value[index] = {
            ...response.data,
            categoryName: getCategoryName(response.data.categoryId)
          }
        }
        
        notificationService.show('Sản phẩm đã được cập nhật thành công', {
          title: 'Thành công',
          type: 'success'
        })
  } else {
        console.log('Đang tạo sản phẩm mới')
        
        // Sử dụng API wrapper
        response = await api.product.createProduct(productData)
        
        console.log('Sản phẩm mới đã được tạo:', response.data)
        
        // Thêm sản phẩm mới vào danh sách
        products.value.unshift({
          ...response.data,
          categoryName: getCategoryName(response.data.categoryId)
        })
        
        notificationService.show('Sản phẩm mới đã được tạo thành công', {
          title: 'Thành công',
          type: 'success'
        })
      }
      
      // Đóng modal sau khi lưu
  closeModal()
      
    } catch (apiError) {
      console.error('Lỗi khi gọi API sản phẩm:', apiError)
      
      if (apiError.response) {
        if (apiError.response.status === 401 || apiError.response.status === 403) {
          notificationService.show('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', {
            title: 'Lỗi xác thực',
            type: 'error'
          })
          // Xóa token không hợp lệ
          localStorage.removeItem('admin_current_token')
          localStorage.removeItem('token')
          // Chuyển hướng đến trang đăng nhập sau 3 giây
          setTimeout(() => {
            redirectToLogin()
          }, 3000)
        } else {
          notificationService.show(`Lỗi từ máy chủ: ${apiError.response.status} - ${apiError.response.data?.message || 'Không thể lưu sản phẩm'}`, {
            title: 'Lỗi',
            type: 'error'
          })
        }
      } else {
        notificationService.show('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra kết nối mạng.', {
          title: 'Lỗi kết nối',
          type: 'error'
        })
      }
    }
  } catch (err) {
    console.error('Lỗi chung khi lưu sản phẩm:', err)
    notificationService.show('Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Delete product
const showDeleteConfirm = ref(false)
const productToDelete = ref(null)

function openDeleteConfirm(productId) {
  productToDelete.value = productId
  showDeleteConfirm.value = true
}

function handleDeleteConfirm() {
  const productId = productToDelete.value
  showDeleteConfirm.value = false
  if (productId) {
    deleteProduct(productId)
  }
}

async function deleteProduct(productId) {
  // Kiểm tra ID sản phẩm hợp lệ
  if (!productId || isNaN(parseInt(productId)) || parseInt(productId) <= 0) {
    notificationService.show('ID sản phẩm không hợp lệ, vui lòng thử lại.', {
      title: 'Lỗi dữ liệu',
      type: 'error'
    })
    return
  }
  
  try {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      notificationService.show('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', {
        title: 'Lỗi xác thực',
        type: 'error'
      })
      // Tự động chuyển hướng đến trang đăng nhập sau 3 giây
      setTimeout(() => {
        redirectToLogin()
      }, 3000)
      return
    }
    
    console.log(`Đang gửi yêu cầu xóa sản phẩm ID: ${productId}`)
    isLoading.value = true
    
    try {
      // Sử dụng API wrapper
      await api.product.deleteProduct(productId)
      
      console.log(`Đã xóa sản phẩm ID: ${productId} thành công`)
      
      // Remove from local array
      products.value = products.value.filter(p => p.id !== productId)
      
      notificationService.show('Sản phẩm đã được xóa thành công', {
        title: 'Thành công',
        type: 'success'
      })
    } catch (apiError) {
      console.error('Lỗi khi gọi API xóa sản phẩm:', apiError)
      
      if (apiError.response) {
        const status = apiError.response.status
        const errorMessage = apiError.response.data?.message || 'Không có thông tin chi tiết'
        
        // Xử lý theo mã lỗi cụ thể
        switch (status) {
          case 400:
            notificationService.show(`ID sản phẩm không hợp lệ: ${errorMessage}`, {
              title: 'Lỗi dữ liệu',
              type: 'error'
            })
            break
            
          case 401:
            notificationService.show('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', {
              title: 'Lỗi xác thực',
              type: 'error'
            })
            // Xóa token không hợp lệ
            localStorage.removeItem('admin_current_token')
            localStorage.removeItem('token')
            // Chuyển hướng đến trang đăng nhập sau 3 giây
            setTimeout(() => {
              redirectToLogin()
            }, 3000)
            break
            
          case 403:
            notificationService.show('Bạn không có quyền xóa sản phẩm. Vui lòng liên hệ quản trị viên.', {
              title: 'Lỗi phân quyền',
              type: 'error'
            })
            break
            
          case 404:
            notificationService.show(`Không tìm thấy sản phẩm với ID: ${productId}`, {
              title: 'Không tìm thấy',
              type: 'error'
            })
            // Xóa khỏi mảng local vì không tồn tại trên server
            products.value = products.value.filter(p => p.id !== productId)
            break
            
          default:
            notificationService.show(`Lỗi từ máy chủ: ${status} - ${errorMessage}`, {
              title: 'Lỗi',
              type: 'error'
            })
        }
      } else {
        notificationService.show('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra kết nối mạng.', {
          title: 'Lỗi kết nối',
          type: 'error'
        })
      }
    } finally {
      isLoading.value = false
    }
  } catch (err) {
    console.error('Lỗi chung khi xóa sản phẩm:', err)
    notificationService.show('Không thể xóa sản phẩm. Vui lòng thử lại sau.', {
      title: 'Lỗi',
      type: 'error'
    })
    isLoading.value = false
  }
}

// Pagination functions
function goToPage(page) {
  currentPage.value = page
  fetchAllProducts()
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchAllProducts()
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchAllProducts()
  }
}

// Search and filter functions
function applySearch() {
  currentPage.value = 0
  fetchAllProducts()
}

function searchProducts() {
  applySearch()
}

function resetFilters() {
  searchTerm.value = ''
  selectedCategory.value = ''
  statusFilter.value = ''
  stockFilter.value = 'all'
  fetchAllProducts()
}

// Load data when component mounts
onMounted(async () => {
  try {
    // Tải danh mục sản phẩm
    await fetchCategories()
    
    // Tải tất cả sản phẩm, bao gồm cả ACTIVE và INACTIVE
    await fetchAllProducts()
    
    console.log('Đã khởi tạo trang sản phẩm với', products.value.length, 'sản phẩm')
  } catch (error) {
    console.error('Lỗi khi khởi tạo trang:', error)
  }
})

// Cập nhật nút xóa sản phẩm để gọi openDeleteConfirm
function confirmDeleteProduct(productId) {
  openDeleteConfirm(productId);
}

// Quick update functions
async function quickUpdateStatus(product) {
  if (isUpdating.value[product.id]) return
  
  isUpdating.value[product.id] = true
  
  try {
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      notificationService.show('Bạn cần đăng nhập lại để thực hiện thao tác này', {
        title: 'Lỗi xác thực',
        type: 'error'
      })
      return
    }
    
    // Sử dụng API wrapper (chỉ gửi trường status)
    await api.product.updateProduct(product.id, {
      status: product.status
    })
    
    console.log(`Đã cập nhật trạng thái sản phẩm ID: ${product.id} thành ${product.status}`)
    
    notificationService.show(`Đã cập nhật trạng thái thành ${getStatusDisplayText(product.status)}`, {
      title: 'Cập nhật thành công',
      type: 'success',
      duration: 2000
    })
    
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    
    // Xử lý lỗi HTTP cụ thể
    if (error.response) {
      const status = error.response.status
      
      handleApiError(status, error.response.data?.message, 'trạng thái')
      
      // Khôi phục trạng thái ban đầu
      const originalProduct = products.value.find(p => p.id === product.id)
      if (originalProduct) {
        product.status = originalProduct.status
      }
    } else {
      notificationService.show('Lỗi kết nối khi cập nhật trạng thái', {
        title: 'Lỗi',
        type: 'error'
      })
    }
  } finally {
    isUpdating.value[product.id] = false
  }
}

async function quickUpdateStock(product) {
  if (isUpdating.value[product.id]) return
  
  isUpdating.value[product.id] = true
  
  try {
    const token = localStorage.getItem('admin_current_token') || localStorage.getItem('token')
    if (!token) {
      notificationService.show('Bạn cần đăng nhập lại để thực hiện thao tác này', {
        title: 'Lỗi xác thực',
        type: 'error'
      })
      return
    }
    
    // Validate stock
    if (product.stock < 0) {
      product.stock = 0
    }
    
    // Sử dụng API wrapper (chỉ gửi trường stock)
    await api.product.updateProduct(product.id, {
      stock: product.stock
    })
    
    console.log(`Đã cập nhật số lượng sản phẩm ID: ${product.id} thành ${product.stock}`)
    
    notificationService.show(`Đã cập nhật số lượng thành ${product.stock}`, {
      title: 'Cập nhật thành công',
      type: 'success',
      duration: 2000
    })
    
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng:', error)
    
    // Xử lý lỗi HTTP cụ thể
    if (error.response) {
      const status = error.response.status
      
      handleApiError(status, error.response.data?.message, 'số lượng')
      
      // Khôi phục số lượng ban đầu
      const originalProduct = products.value.find(p => p.id === product.id)
      if (originalProduct) {
        product.stock = originalProduct.stock
      }
    } else {
      notificationService.show('Lỗi kết nối khi cập nhật số lượng', {
        title: 'Lỗi',
        type: 'error'
      })
    }
  } finally {
    isUpdating.value[product.id] = false
  }
}

// Hàm xử lý lỗi API chung
function handleApiError(status, message, fieldName) {
  switch (status) {
    case 400:
      notificationService.show(`Dữ liệu ${fieldName} không hợp lệ: ${message || 'Vui lòng kiểm tra lại'}`, {
        title: 'Lỗi dữ liệu',
        type: 'error'
      })
      break
    case 401:
      notificationService.show('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', {
        title: 'Lỗi xác thực',
        type: 'error'
      })
      localStorage.removeItem('admin_current_token')
      localStorage.removeItem('token')
      setTimeout(() => {
        redirectToLogin()
      }, 3000)
      break
    case 403:
      notificationService.show('Bạn không có quyền thực hiện thao tác này', {
        title: 'Lỗi phân quyền',
        type: 'error'
      })
      break
    case 404:
      notificationService.show(`Không tìm thấy sản phẩm cần cập nhật ${fieldName}`, {
        title: 'Không tìm thấy',
        type: 'error'
      })
      break
    default:
      notificationService.show(`Lỗi máy chủ khi cập nhật ${fieldName}: ${message || status}`, {
        title: 'Lỗi',
        type: 'error'
      })
  }
}

// Hàm lấy CSS class dựa trên trạng thái
function getStatusClass(status) {
  if (status === 'ACTIVE') {
    return 'bg-green-100 text-green-800 border-green-300 focus:ring-green-500'
  } else {
    return 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-gray-500'
  }
}

// Hàm lấy text hiển thị cho trạng thái
function getStatusDisplayText(status) {
  if (status === 'ACTIVE') {
    return 'Đang bán'
  } else {
    return 'Không bán'
  }
}

// Hàm xử lý dữ liệu sản phẩm trước khi hiển thị
function processProductData(productData) {
  // Không còn xử lý chuẩn hóa trạng thái nữa, trả về nguyên bản
  return productData;
}

const filterProducts = () => {
  // Reset to first page when filters change
  currentPage.value = 1
}

const filterByCategory = () => {
  filterProducts()
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 