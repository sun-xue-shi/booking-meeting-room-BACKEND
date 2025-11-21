-- 创建服务选项关联表
CREATE TABLE `server_service_options` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `server_id` int NOT NULL COMMENT '服务ID',
  `service_option` int NOT NULL COMMENT '服务选项: 0-内容策划, 1-流量推广, 2-账号运营, 3-商业变现',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_server_service_options_server` FOREIGN KEY (`server_id`) REFERENCES `server` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务选项关联表';