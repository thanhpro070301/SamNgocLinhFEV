# Tài liệu API của SamNgocLinhPJ

## Mục lục
- [Xác thực](#xác-thực)
- [API Người dùng](#api-người-dùng)
- [API Phiên đăng nhập](#api-phiên-đăng-nhập)
- [API Sản phẩm](#api-sản-phẩm)
- [API Danh mục](#api-danh-mục)
- [API Đơn hàng](#api-đơn-hàng)
- [API Tin tức](#api-tin-tức)

## Xác thực

### Đăng ký tài khoản

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "email@example.com",
  "password": "matkhau123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "email@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T12:00:00"
}
```

### Gửi OTP xác thực email

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
"email@example.com"
```

**Response (200):**
```
Mã OTP đã được gửi đến email của bạn!
```

### Xác thực OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Request Parameters:**
- `email`: Email đăng ký
- `otp`: Mã OTP nhận được

**Response (200):**
```
Xác thực OTP thành công!
```

### Đăng nhập

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "email@example.com",
  "password": "matkhau123"
}
```

**Response (200):**
```
{token_string}
```

Lưu ý: Token này cần được đính kèm trong header `Authorization` dưới dạng `Bearer {token_string}` cho các API yêu cầu xác thực.

### Đăng xuất

**Endpoint:** `POST /api/auth/logout`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (204):** *Không có nội dung*

## API Người dùng

### Lấy danh sách người dùng

**Endpoint:** `GET /api/users`

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "email@example.com",
    "role": "USER",
    "createdAt": "2023-01-01T12:00:00"
  }
]
```

### Lấy thông tin người dùng theo ID

**Endpoint:** `GET /api/users/{id}`

**Response (200):**
```json
{
  "id": 1,
  "email": "email@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T12:00:00"
}
```

### Cập nhật thông tin người dùng

**Endpoint:** `PUT /api/users/{id}`

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "email@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận XYZ",
  "role": "USER",
  "createdAt": "2023-01-01T12:00:00"
}
```

## API Phiên đăng nhập

### Lấy danh sách phiên đăng nhập

**Endpoint:** `GET /api/account/sessions`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (200):**
```json
[
  {
    "id": 1,
    "deviceType": "Desktop",
    "platform": "Windows",
    "browser": "Chrome",
    "ipAddress": "127.0.0.1",
    "lastActivity": "2023-01-01T12:30:00",
    "isCurrentSession": true,
    "isRememberMe": false
  }
]
```

### Đăng xuất khỏi một phiên

**Endpoint:** `DELETE /api/account/sessions/{sessionId}`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (204):** *Không có nội dung*

### Đăng xuất khỏi các thiết bị khác

**Endpoint:** `DELETE /api/account/sessions/other-devices`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (204):** *Không có nội dung*

### Đăng xuất khỏi tất cả thiết bị

**Endpoint:** `DELETE /api/account/sessions/all`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (204):** *Không có nội dung*

## API Sản phẩm

### Lấy danh sách sản phẩm

**Endpoint:** `GET /api/products`

**Request Parameters (tùy chọn):**
- `page`: Số trang (mặc định: 0)
- `size`: Kích thước trang (mặc định: 10)
- `sort`: Trường sắp xếp (mặc định: id)
- `direction`: Hướng sắp xếp (asc hoặc desc, mặc định: asc)
- `category`: ID danh mục

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Sâm Ngọc Linh 10 năm tuổi",
      "slug": "sam-ngoc-linh-10-nam-tuoi",
      "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum",
      "price": 1000000,
      "originalPrice": 1200000,
      "image": "/uploads/sam-ngoc-linh-1.jpg",
      "categoryId": 1,
      "categoryName": "Sâm tươi",
      "stock": 10,
      "sold": 5,
      "rating": 4.5,
      "status": "ACTIVE",
      "createdAt": "2023-01-01T12:00:00",
      "images": [
        "/uploads/sam-ngoc-linh-1.jpg",
        "/uploads/sam-ngoc-linh-2.jpg"
      ]
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "unpaged": false,
    "paged": true
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

### Lấy sản phẩm theo ID

**Endpoint:** `GET /api/products/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Sâm Ngọc Linh 10 năm tuổi",
  "slug": "sam-ngoc-linh-10-nam-tuoi",
  "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum",
  "price": 1000000,
  "originalPrice": 1200000,
  "image": "/uploads/sam-ngoc-linh-1.jpg",
  "categoryId": 1,
  "categoryName": "Sâm tươi",
  "stock": 10,
  "sold": 5,
  "rating": 4.5,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T12:00:00",
  "images": [
    "/uploads/sam-ngoc-linh-1.jpg",
    "/uploads/sam-ngoc-linh-2.jpg"
  ]
}
```

## API Danh mục

### Lấy danh sách danh mục

**Endpoint:** `GET /api/categories`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Sâm tươi",
    "slug": "sam-tuoi",
    "description": "Sâm Ngọc Linh tươi nguyên củ",
    "image": "/uploads/category-sam-tuoi.jpg"
  }
]
```

### Lấy danh mục theo ID

**Endpoint:** `GET /api/categories/{id}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Sâm tươi",
  "slug": "sam-tuoi",
  "description": "Sâm Ngọc Linh tươi nguyên củ",
  "image": "/uploads/category-sam-tuoi.jpg"
}
```

### Lấy sản phẩm theo danh mục

**Endpoint:** `GET /api/categories/{id}/products`

**Request Parameters (tùy chọn):**
- `page`: Số trang (mặc định: 0)
- `size`: Kích thước trang (mặc định: 10)

**Response (200):** *Tương tự như lấy danh sách sản phẩm*

## API Đơn hàng

### Lấy tất cả đơn hàng (chỉ dành cho admin)

**Endpoint:** `GET /api/orders`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "totalAmount": 150000,
    "shippingFee": 30000,
    "status": "PENDING",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "shippingName": "Nguyễn Văn A",
    "shippingPhone": "0123456789",
    "shippingAddress": "123 Đường ABC, Quận XYZ",
    "shippingEmail": "email@example.com",
    "notes": "Giao hàng giờ hành chính",
    "createdAt": "2023-01-01T12:00:00",
    "updatedAt": "2023-01-01T12:00:00"
  }
]
```

### Lấy đơn hàng theo ID

**Endpoint:** `GET /api/orders/{id}`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 150000,
  "shippingFee": 30000,
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
}
```

### Lấy đơn hàng của người dùng hiện tại

**Endpoint:** `GET /api/orders/my-orders`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "totalAmount": 150000,
    "shippingFee": 30000,
    "status": "PENDING",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "shippingName": "Nguyễn Văn A",
    "shippingPhone": "0123456789",
    "shippingAddress": "123 Đường ABC, Quận XYZ",
    "shippingEmail": "email@example.com",
    "notes": "Giao hàng giờ hành chính",
    "createdAt": "2023-01-01T12:00:00",
    "updatedAt": "2023-01-01T12:00:00"
  }
]
```

### Tạo đơn hàng mới

**Endpoint:** `POST /api/orders`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Request Body:**
```json
{
  "shippingFee": 30000,
  "paymentMethod": "COD",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "products": {
    "1": 2,
    "2": 1
  }
}
```

Trong đó `products` là một map với key là product ID và value là số lượng sản phẩm.

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 150000,
  "shippingFee": 30000,
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
}
```

### Cập nhật trạng thái đơn hàng (chỉ dành cho admin)

**Endpoint:** `PUT /api/orders/{id}/status`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Request Parameters:**
- `status`: Trạng thái đơn hàng (PENDING, PROCESSING, SHIPPING, COMPLETED, CANCELLED)

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 150000,
  "shippingFee": 30000,
  "status": "PROCESSING",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:30:00"
}
```

### Cập nhật trạng thái thanh toán (chỉ dành cho admin)

**Endpoint:** `PUT /api/orders/{id}/payment`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Request Parameters:**
- `paymentStatus`: Trạng thái thanh toán (PENDING, COMPLETED, FAILED)

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 150000,
  "shippingFee": 30000,
  "status": "PROCESSING",
  "paymentMethod": "COD",
  "paymentStatus": "COMPLETED",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:45:00"
}
```

### Hủy đơn hàng

**Endpoint:** `POST /api/orders/{id}/cancel`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 150000,
  "shippingFee": 30000,
  "status": "CANCELLED",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "shippingName": "Nguyễn Văn A",
  "shippingPhone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận XYZ",
  "shippingEmail": "email@example.com",
  "notes": "Giao hàng giờ hành chính",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T13:00:00"
}
```

### Kiểm tra trạng thái đơn hàng (endpoint công khai)

**Endpoint:** `GET /api/orders/public/{id}`

**Response (200):**
```json
{
  "id": 1,
  "status": "PROCESSING",
  "paymentStatus": "PENDING",
  "createdAt": "2023-01-01T12:00:00"
}
```

## API Tin tức

### Lấy danh sách tin tức

**Endpoint:** `GET /api/news`

**Request Parameters (tùy chọn):**
- `page`: Số trang (mặc định: 0)
- `size`: Kích thước trang (mặc định: 10)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Những lợi ích của Sâm Ngọc Linh",
      "slug": "nhung-loi-ich-cua-sam-ngoc-linh",
      "summary": "Tóm tắt về lợi ích của Sâm Ngọc Linh",
      "content": "<p>Nội dung chi tiết về lợi ích của Sâm Ngọc Linh</p>",
      "image": "/uploads/news-sam-ngoc-linh.jpg",
      "category": "news",
      "published": true,
      "createdAt": "2023-01-01T12:00:00",
      "updatedAt": "2023-01-01T12:00:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "unpaged": false,
    "paged": true
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 1,
  "first": true,
  "empty": false
}
```

### Lấy tin tức theo ID

**Endpoint:** `GET /api/news/{id}`

**Response (200):**
```json
{
  "id": 1,
  "title": "Những lợi ích của Sâm Ngọc Linh",
  "slug": "nhung-loi-ich-cua-sam-ngoc-linh",
  "summary": "Tóm tắt về lợi ích của Sâm Ngọc Linh",
  "content": "<p>Nội dung chi tiết về lợi ích của Sâm Ngọc Linh</p>",
  "image": "/uploads/news-sam-ngoc-linh.jpg",
  "category": "news",
  "published": true,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-01T12:00:00"
}
```

## Mã lỗi và giải thích

- `200 OK`: Yêu cầu thành công
- `201 Created`: Tạo mới tài nguyên thành công
- `204 No Content`: Xử lý thành công nhưng không có nội dung trả về
- `400 Bad Request`: Yêu cầu không hợp lệ
- `401 Unauthorized`: Không có quyền truy cập
- `403 Forbidden`: Không đủ quyền để thực hiện hành động
- `404 Not Found`: Không tìm thấy tài nguyên
- `500 Internal Server Error`: Lỗi máy chủ 