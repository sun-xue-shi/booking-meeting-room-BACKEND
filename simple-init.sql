CREATE DATABASE IF NOT EXISTS `meeting_room_booking_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `meeting_room_booking_system`;

-- 创建用户表
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `head_pic` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `nick_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_frozen` tinyint NOT NULL DEFAULT '0',
  `is_admin` tinyint NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 创建会议室表
CREATE TABLE `meeting_room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT '',
  `isBooked` tinyint NOT NULL DEFAULT '0',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `equipment` varchar(50) NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 创建预订表
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '申请中',
  `note` varchar(255) NOT NULL DEFAULT '',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `roomId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `theme` varchar(255) NOT NULL DEFAULT '无',
  PRIMARY KEY (`id`),
  KEY `roomId` (`roomId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 插入测试数据
INSERT INTO `users` (`username`, `password`, `email`) VALUES ('admin', '670b14728ad9902aecba32e22fa4f6bd', 'admin@example.com');
INSERT INTO `meeting_room` (`name`, `location`, `equipment`, `capacity`) VALUES ('一号会议室', '一层西', '白板', 10);