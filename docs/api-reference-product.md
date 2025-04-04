# API Reference: Products Management

This document outlines the API endpoints for managing products in the Sâm Ngọc Linh application.

## Product Endpoints

### List All Products

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `page`: Page number (starting from 0, default: 0)
- `size`: Number of items per page (default: 10)
- `keyword`: Optional search term to filter products by name

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
      "status": "ACTIVE",
      "createdAt": "2023-01-01T12:00:00"
    },
    // ... more products
  ],
  "pageable": {
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 10,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 100,
  "totalPages": 10,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 10,
  "first": true,
  "empty": false
}
```

### Get a Single Product

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
  "status": "ACTIVE",
  "createdAt": "2023-01-01T12:00:00"
}
```

### Create a New Product (Admin only)

**Endpoint:** `POST /api/products`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Request Body:**
```json
{
  "name": "Sâm Ngọc Linh 20 năm tuổi",
  "slug": "sam-ngoc-linh-20-nam-tuoi",
  "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum, 20 năm tuổi",
  "price": 2000000,
  "originalPrice": 2500000,
  "image": "/uploads/sam-ngoc-linh-20-nam.jpg",
  "categoryId": 1,
  "stock": 5
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Sâm Ngọc Linh 20 năm tuổi",
  "slug": "sam-ngoc-linh-20-nam-tuoi",
  "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum, 20 năm tuổi",
  "price": 2000000,
  "originalPrice": 2500000,
  "image": "/uploads/sam-ngoc-linh-20-nam.jpg",
  "categoryId": 1,
  "categoryName": "Sâm tươi",
  "stock": 5,
  "sold": 0,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T12:00:00"
}
```

### Update a Product (Admin only)

**Endpoint:** `PUT /api/products/{id}`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Request Body:**
```json
{
  "name": "Sâm Ngọc Linh 20 năm tuổi - Loại đặc biệt",
  "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum, 20 năm tuổi, loại đặc biệt",
  "price": 2500000,
  "image": "/uploads/sam-ngoc-linh-20-nam-special.jpg",
  "categoryId": 1
}
```

**Response (200):**
```json
{
  "id": 2,
  "name": "Sâm Ngọc Linh 20 năm tuổi - Loại đặc biệt",
  "slug": "sam-ngoc-linh-20-nam-tuoi",
  "description": "Sâm Ngọc Linh chất lượng cao từ Kon Tum, 20 năm tuổi, loại đặc biệt",
  "price": 2500000,
  "originalPrice": 2500000,
  "image": "/uploads/sam-ngoc-linh-20-nam-special.jpg",
  "categoryId": 1,
  "categoryName": "Sâm tươi",
  "stock": 5,
  "sold": 0,
  "status": "ACTIVE",
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-01-02T10:00:00"
}
```

### Delete a Product (Admin only)

**Endpoint:** `DELETE /api/products/{id}`

**Headers:**
- `Authorization`: `Bearer {token_string}`

**Response (204):** *No content*

### Search Products

**Endpoint:** `GET /api/products/search`

**Request Parameters:**
- `keyword`: Search term
- `page`: Page number (default: 0)
- `size`: Items per page (default: 10)

**Response (200):** *Same format as list all products*

### Get Best-Selling Products

**Endpoint:** `GET /api/products/best-selling`

**Response (200):**
```json
[
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
    "createdAt": "2023-01-01T12:00:00"
  },
  // ... more products
]
```

### Get New Arrivals

**Endpoint:** `GET /api/products/new-arrivals`

**Response (200):** *Same format as best-selling products*

## Implementation Notes

### Product Status Values
- `ACTIVE`: Product is available for purchase
- `INACTIVE`: Product is not currently available

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "timestamp": "2023-01-01T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid product data"
}
```

**401 Unauthorized:**
```json
{
  "timestamp": "2023-01-01T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**403 Forbidden:**
```json
{
  "timestamp": "2023-01-01T12:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "timestamp": "2023-01-01T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product with ID 999 not found"
}
``` 