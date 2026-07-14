-- Table for storing AI API configurations per company
CREATE TABLE `companies_api_ia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_company` int(11) NOT NULL,
  `gemini_api_key` varchar(255) DEFAULT NULL,
  `openai_api_key` varchar(255) DEFAULT NULL COMMENT 'For future use if needed',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_company_ia` (`id_company`),
  CONSTRAINT `fk_company_ia` FOREIGN KEY (`id_company`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
