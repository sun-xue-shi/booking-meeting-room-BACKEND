-- 创建server表
CREATE TABLE `server` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `package_option` int NOT NULL COMMENT '套餐选项: 0-特色套餐, 1-素人启航套餐, 2-IP成长套餐, 3-IP变现套餐',
  `service_option` int DEFAULT NULL COMMENT '服务选项: 0-内容策划, 1-流量推广, 2-账号运营, 3-商业变现 (为保持向后兼容性)',
  `service_options_string` varchar(255) DEFAULT NULL COMMENT '服务选项字符串格式: 例如 "1,2"',
  `description` text NOT NULL COMMENT '具体需求描述',
  `contact_name` varchar(50) NOT NULL COMMENT '联系人姓名',
  `contact_info` varchar(100) NOT NULL COMMENT '联系方式',
  `user_id` int DEFAULT NULL COMMENT '关联的用户ID',
  `progress` int NOT NULL DEFAULT '0' COMMENT '服务进度: 0-已提交需求, 1-已对接运营团队, 2-孵化中, 3-服务完成',
  `rating` int DEFAULT NULL COMMENT '评价星级: 1-5星',
  `review_content` text COMMENT '评价内容',
  `reviewed_at` datetime DEFAULT NULL COMMENT '评价时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_server_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='运营服务需求表';

-- 创建服务选项关联表
CREATE TABLE `server_service_options` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `server_id` int NOT NULL COMMENT '服务ID',
  `service_option` int NOT NULL COMMENT '服务选项: 0-内容策划, 1-流量推广, 2-账号运营, 3-商业变现',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_server_service_options_server` FOREIGN KEY (`server_id`) REFERENCES `server` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务选项关联表';