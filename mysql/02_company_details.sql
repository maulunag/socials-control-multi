-- 02_company_details.sql
-- Table used for describing the company using Markdown formatting and providing a website URL

CREATE TABLE IF NOT EXISTS company_details (
    company_id INT PRIMARY KEY,
    description LONGTEXT DEFAULT NULL,
    website_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
