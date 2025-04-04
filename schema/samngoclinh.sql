-- Schema for Sâm Ngọc Linh Web
-- Create database
CREATE DATABASE IF NOT EXISTS samngoclinh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE samngoclinh;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    image VARCHAR(255),
    category_id INT,
    stock INT NOT NULL DEFAULT 0,
    sold INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product_images table for multiple images per product
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    duration VARCHAR(100),
    icon VARCHAR(100),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create news table
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT,
    content LONGTEXT,
    image VARCHAR(255),
    author_id INT,
    category VARCHAR(50) NOT NULL DEFAULT 'news',
    published BOOLEAN DEFAULT TRUE,
    publish_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'processing', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('cod', 'bank', 'card') NOT NULL DEFAULT 'cod',
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for categories
INSERT INTO categories (name, slug, description, parent_id, status) VALUES
('Sâm tươi', 'sam-tuoi', 'Các sản phẩm sâm Ngọc Linh tươi', NULL, 'active'),
('Cao sâm', 'cao-sam', 'Các sản phẩm cao sâm Ngọc Linh', NULL, 'active'),
('Rượu sâm', 'ruou-sam', 'Các loại rượu ngâm sâm Ngọc Linh', NULL, 'active');

-- Insert sample data for users
INSERT INTO users (name, email, password, phone, role, status) VALUES
('Admin', 'admin@example.com', '$2y$10$zR2PmfGX6CqTF8Lx1JrZ.OYP7Z0FX2E4i5jGcdY0VhJ9zMd8LtqSO', '0123456789', 'admin', 'active'),
('Quản lý Sâm Ngọc Linh', 'samngoclinh@gmail.com', '$2y$10$TfC52O46pVZVVjmj/Q.H7.aRRZQ7jeTVLh5OcxXkELGvJRZpXnvxa', '0987654321', 'admin', 'active'),
('Nguyễn Văn A', 'nguyenvana@example.com', '$2y$10$MQcYUTxgiBxUxZIK9XB2NuLUMPNFPJXs1uOQwA/L6QHAcfqsf1W6m', '0123456789', 'user', 'active'),
('Trần Thị B', 'tranthib@example.com', '$2y$10$MQcYUTxgiBxUxZIK9XB2NuLUMPNFPJXs1uOQwA/L6QHAcfqsf1W6m', '0987654321', 'user', 'active'),
('Lê Văn C', 'levanc@example.com', '$2y$10$MQcYUTxgiBxUxZIK9XB2NuLUMPNFPJXs1uOQwA/L6QHAcfqsf1W6m', '0369852147', 'user', 'inactive');

-- Insert sample data for products
INSERT INTO products (name, slug, description, price, original_price, image, category_id, stock, sold, rating, status) VALUES
('Sâm Ngọc Linh Tươi 10 Năm Tuổi', 'sam-ngoc-linh-tuoi-10-nam-tuoi', 'Sâm Ngọc Linh tươi cao cấp có tuổi đời 10 năm, thu hoạch từ vùng núi Ngọc Linh.', 15000000, 18000000, 'images/products/sam-tuoi.png', 1, 50, 124, 5.0, 'active'),
('Cao Sâm Ngọc Linh', 'cao-sam-ngoc-linh', 'Cao sâm Ngọc Linh được chiết xuất từ sâm tươi loại 1, giữ nguyên dưỡng chất.', 8000000, 10000000, 'images/products/sam-tuoi.png', 2, 100, 89, 4.0, 'active'),
('Rượu Sâm Ngọc Linh', 'ruou-sam-ngoc-linh', 'Rượu sâm Ngọc Linh được ngâm từ sâm tươi 7 năm tuổi, có hương vị đặc trưng.', 5000000, 6000000, 'images/products/sam-tuoi.png', 3, 0, 156, 5.0, 'active'),
('Trà Sâm Ngọc Linh', 'tra-sam-ngoc-linh', 'Trà sâm Ngọc Linh được chế biến từ lá và thân sâm, thơm ngon bổ dưỡng.', 1200000, 1500000, 'images/products/sam-tuoi.png', 2, 0, 230, 4.0, 'active'),
('Sâm Ngọc Linh Khô Loại 1', 'sam-ngoc-linh-kho-loai-1', 'Sâm Ngọc Linh khô loại 1, được sấy theo công nghệ hiện đại giữ nguyên dưỡng chất.', 12000000, 13500000, 'images/products/sam-tuoi.png', 1, 15, 78, 5.0, 'active'),
('Viên Đông Trùng Hạ Thảo Sâm Ngọc Linh', 'vien-dong-trung-ha-thao-sam-ngoc-linh', 'Viên đông trùng hạ thảo kết hợp với sâm Ngọc Linh, tăng cường sức khỏe.', 4500000, NULL, 'images/products/sam-tuoi.png', 2, 0, 95, 4.0, 'active');

-- Insert sample data for services
INSERT INTO services (name, description, price, duration, icon, status) VALUES
('Tham quan vườn sâm', 'Tham quan vườn trồng sâm Ngọc Linh với hướng dẫn viên chuyên nghiệp.', 500000, '2 giờ', 'fas fa-seedling', 'active'),
('Trải nghiệm thu hoạch sâm', 'Trải nghiệm thu hoạch sâm Ngọc Linh tại vùng núi Ngọc Linh.', 2000000, '1 ngày', 'fas fa-hiking', 'active'),
('Tư vấn sử dụng sâm', 'Dịch vụ tư vấn cách sử dụng sâm Ngọc Linh phù hợp với từng đối tượng.', 200000, '1 giờ', 'fas fa-user-md', 'active'),
('Đóng gói quà tặng cao cấp', 'Dịch vụ đóng gói sản phẩm sâm Ngọc Linh thành quà tặng cao cấp.', 300000, '30 phút', 'fas fa-gift', 'active'),
('Giao hàng tận nơi', 'Dịch vụ giao hàng tận nơi với bảo quản đặc biệt cho sâm tươi.', 100000, 'Trong ngày', 'fas fa-shipping-fast', 'active');

-- Insert sample data for news
INSERT INTO news (title, slug, summary, content, image, author_id, category, published, publish_date) VALUES
('Sâm Ngọc Linh - Báu vật của núi rừng Việt Nam', 'sam-ngoc-linh-bau-vat-cua-nui-rung-viet-nam', 'Tìm hiểu về lịch sử và giá trị của Sâm Ngọc Linh - loài dược liệu quý hiếm bậc nhất Việt Nam.', '<p>Nội dung chi tiết về lịch sử Sâm Ngọc Linh...</p>', 'images/products/sam-tuoi.png', 1, 'knowledge', TRUE, '2023-05-15 08:00:00'),
('Công dụng tuyệt vời của Sâm Ngọc Linh đối với sức khỏe', 'cong-dung-tuyet-voi-cua-sam-ngoc-linh-doi-voi-suc-khoe', 'Khám phá những lợi ích sức khỏe và các công dụng chữa bệnh của Sâm Ngọc Linh.', '<p>Nội dung chi tiết về công dụng của Sâm Ngọc Linh...</p>', 'images/products/sam-tuoi.png', 1, 'knowledge', TRUE, '2023-06-02 10:00:00'),
('Cách phân biệt Sâm Ngọc Linh thật và giả', 'cach-phan-biet-sam-ngoc-linh-that-va-gia', 'Hướng dẫn chi tiết giúp bạn nhận biết Sâm Ngọc Linh thật và tránh mua phải hàng giả, hàng kém chất lượng.', '<p>Nội dung chi tiết về cách phân biệt Sâm Ngọc Linh thật và giả...</p>', 'images/products/sam-tuoi.png', 2, 'tips', TRUE, '2023-06-18 15:30:00'),
('Thông báo khai trương cửa hàng mới tại Hà Nội', 'thong-bao-khai-truong-cua-hang-moi-tai-ha-noi', 'Chúng tôi vui mừng thông báo khai trương cửa hàng mới tại Hà Nội vào ngày 15/7/2023.', '<p>Nội dung chi tiết về sự kiện khai trương...</p>', 'images/products/sam-tuoi.png', 1, 'news', TRUE, '2023-07-10 09:00:00');

-- Insert sample data for orders
INSERT INTO orders (user_id, total_amount, shipping_fee, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address, shipping_email, notes, created_at) VALUES
(3, 15000000, 0, 'completed', 'bank', 'completed', 'Nguyễn Văn A', '0123456789', 'Số 1, Đường ABC, Quận 1, TP HCM', 'nguyenvana@example.com', NULL, '2023-09-12 10:15:00'),
(4, 9200000, 0, 'shipping', 'cod', 'pending', 'Trần Thị B', '0987654321', 'Số 2, Đường XYZ, Quận Cầu Giấy, Hà Nội', 'tranthib@example.com', 'Gọi trước khi giao hàng', '2023-09-11 14:30:00'),
(NULL, 5000000, 30000, 'processing', 'bank', 'completed', 'Lê Văn C', '0369852147', 'Số 3, Đường DEF, Quận Hải Châu, Đà Nẵng', 'levanc@example.com', NULL, '2023-09-10 09:45:00'),
(3, 12000000, 0, 'cancelled', 'card', 'failed', 'Nguyễn Văn A', '0123456789', 'Số 1, Đường ABC, Quận 1, TP HCM', 'nguyenvana@example.com', 'Hủy theo yêu cầu của khách hàng', '2023-09-09 16:20:00');

-- Insert sample data for order_items
INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES
(1, 1, 'Sâm Ngọc Linh Tươi 10 Năm Tuổi', 15000000, 1),
(2, 2, 'Cao Sâm Ngọc Linh', 8000000, 1),
(2, 4, 'Trà Sâm Ngọc Linh', 1200000, 1),
(3, 3, 'Rượu Sâm Ngọc Linh', 5000000, 1),
(4, 5, 'Sâm Ngọc Linh Khô Loại 1', 12000000, 1);

-- Insert sample data for reviews
INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at) VALUES
(1, 3, 5, 'Sản phẩm chất lượng, đúng như mô tả. Sẽ ủng hộ shop dài dài.', 'approved', '2023-09-15 08:30:00'),
(2, 4, 4, 'Sản phẩm tốt, giao hàng nhanh. Nhưng giá hơi cao.', 'approved', '2023-09-14 13:45:00'),
(3, 3, 5, 'Rượu sâm ngon, hương vị đặc trưng, sẽ mua lại.', 'approved', '2023-09-13 10:20:00'),
(4, 4, 4, 'Trà thơm, dễ uống, có tác dụng tốt.', 'approved', '2023-09-12 16:15:00'),
(5, 3, 5, 'Sâm khô chất lượng, đóng gói cẩn thận.', 'approved', '2023-09-11 09:30:00');

-- Create user_sessions table for managing user login sessions
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_id VARCHAR(36) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(100),
    platform VARCHAR(100),
    browser VARCHAR(100),
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_remember_me BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create index for faster session lookup
CREATE INDEX idx_user_sessions_token ON user_sessions(token_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Insert sample data for user_sessions
INSERT INTO user_sessions (user_id, token_id, ip_address, user_agent, device_type, platform, browser, last_activity, expires_at, created_at, is_remember_me) VALUES
(1, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Desktop', 'Windows', 'Chrome', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), TRUE),
(1, '38a52be4-9352-453e-af97-5c3b448652b8', '192.168.1.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', 'Mobile', 'iOS', 'Safari', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), FALSE),
(2, '7d793789-f3ab-45c9-8c0c-b1c0e1ac83fd', '10.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 'Desktop', 'MacOS', 'Chrome', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE);

-- Create trigger to update product rating when a new review is approved
DELIMITER //
CREATE TRIGGER update_product_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE products p
        SET p.rating = (
            SELECT AVG(r.rating)
            FROM reviews r
            WHERE r.product_id = p.id
            AND r.status = 'approved'
        )
        WHERE p.id = NEW.product_id;
    END IF;
END //
DELIMITER ;

-- Create trigger to update product rating when a review status is updated
DELIMITER //
CREATE TRIGGER update_product_rating_on_status_change AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        UPDATE products p
        SET p.rating = (
            SELECT AVG(r.rating)
            FROM reviews r
            WHERE r.product_id = p.id
            AND r.status = 'approved'
        )
        WHERE p.id = NEW.product_id;
    END IF;
END //
DELIMITER ;

-- Create stored procedures for session management

-- Procedure to clean expired sessions
DELIMITER //
CREATE PROCEDURE cleanup_expired_sessions()
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < NOW();
END //
DELIMITER ;

-- Procedure to get user's active sessions
DELIMITER //
CREATE PROCEDURE get_user_sessions(IN p_user_id INT)
BEGIN
    SELECT * 
    FROM user_sessions
    WHERE user_id = p_user_id
    AND expires_at > NOW()
    ORDER BY last_activity DESC;
END //
DELIMITER ;

-- Procedure to logout from specific session
DELIMITER //
CREATE PROCEDURE logout_session(IN p_token_id VARCHAR(36))
BEGIN
    DELETE FROM user_sessions
    WHERE token_id = p_token_id;
END //
DELIMITER ;

-- Procedure to logout from all sessions except current
DELIMITER //
CREATE PROCEDURE logout_other_sessions(IN p_user_id INT, IN p_current_token VARCHAR(36))
BEGIN
    DELETE FROM user_sessions
    WHERE user_id = p_user_id
    AND token_id != p_current_token;
END //
DELIMITER ;

-- Procedure to update session activity
DELIMITER //
CREATE PROCEDURE update_session_activity(IN p_token_id VARCHAR(36))
BEGIN
    UPDATE user_sessions
    SET last_activity = NOW()
    WHERE token_id = p_token_id
    AND expires_at > NOW();
END //
DELIMITER ;

-- Procedure to get user info by token
DELIMITER //
CREATE PROCEDURE get_user_by_token(IN p_token_id VARCHAR(36))
BEGIN
    SELECT u.* 
    FROM users u
    JOIN user_sessions s ON u.id = s.user_id
    WHERE s.token_id = p_token_id
    AND s.expires_at > NOW();
END //
DELIMITER ; 