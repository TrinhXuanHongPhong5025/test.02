-- Create Database
CREATE DATABASE IF NOT EXISTS crown_co;
USE crown_co;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO categories (name, description) VALUES 
('Đồng hồ', 'Các loại đồng hồ xa xỉ'),
('Túi xách', 'Túi xách hàng hiệu'),
('Trang sức', 'Trang sức cao cấp');

INSERT INTO products (name, description, price, stock, image, category_id) VALUES
('Đồng hồ Thụy Sĩ', 'Chế tác chuẩn mực; tinh tế đến từng chi tiết.', 9900000000, 10, 'https://thegioiso247.vn/wp-content/uploads/2023/06/z4159530161456_801bf60c14de9cae800c890739911223.jpg', 1),
('Túi xách cao cấp', 'Da thật nhập khẩu, chế tác thủ công, thiết kế độc quyền.', 1500000000, 5, 'https://mediaelly.sgp1.digitaloceanspaces.com/uploads/2021/03/31225451/tong-quan-thuong-hieu-tui-xach-gucci.12.jpg', 2),
('Nhẫn kim cương', 'Độ tinh khiết cao, mài giũa hoàn hảo.', 12000000000, 3, 'https://www.lamoredesign.com/cdn/shop/products/ovalchampagnediamondringrosegoldhaloengagementringlamoredesignjewelry-9.jpg?v=1651861134&width=2800', 3);
