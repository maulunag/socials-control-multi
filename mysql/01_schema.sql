-- 01_schema.sql
-- Database schema for Socials Control Multi

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NULL,
    role ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS company_metricool_settings (
    company_id INT PRIMARY KEY,
    metricool_user_id VARCHAR(50) DEFAULT NULL,
    metricool_token VARCHAR(255) DEFAULT NULL,
    facebook_active BOOLEAN DEFAULT false,
    instagram_active BOOLEAN DEFAULT false,
    linkedin_active BOOLEAN DEFAULT false,
    gmb_active BOOLEAN DEFAULT false,
    twitter_active BOOLEAN DEFAULT false,
    youtube_active BOOLEAN DEFAULT false,
    tiktok_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default superadmin (Password is: admin123)
-- Hash generated from password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO users (company_id, role, name, email, password_hash) 
VALUES (NULL, 'SUPERADMIN', 'System Superadmin', 'superadmin@tampateks.com', '$2y$10$rEPqkAQApm1siRFF35gMgup/l7FKZipJxl8GUoJWy0ogj6M1E54mC')
ON DUPLICATE KEY UPDATE email=email;
