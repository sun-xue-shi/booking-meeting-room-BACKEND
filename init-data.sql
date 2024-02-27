CREATE DATABASE  IF NOT EXISTS `meeting_room_booking_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meeting_room_booking_system`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: meeting_room_booking_system
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startTime` datetime NOT NULL COMMENT '会议开始时间',
  `endTime` datetime NOT NULL COMMENT '会议结束时间',
  `status` varchar(255) NOT NULL DEFAULT '申请中' COMMENT '审批状态(申请中，通过，驳回，解除)',
  `note` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roomId` int DEFAULT NULL COMMENT '会议室id',
  `userId` int DEFAULT NULL,
  `theme` varchar(255) NOT NULL DEFAULT '无' COMMENT '会议室主题',
  PRIMARY KEY (`id`),
  KEY `FK_769a5e375729258fd0bbfc0a456` (`roomId`),
  KEY `FK_336b3f4a235460dc93645fbf222` (`userId`),
  CONSTRAINT `FK_336b3f4a235460dc93645fbf222` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_769a5e375729258fd0bbfc0a456` FOREIGN KEY (`roomId`) REFERENCES `meeting_room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (24,'2024-01-03 00:02:00','2024-01-11 00:00:00','审批驳回','','2024-01-15 11:22:23.052272','2024-02-11 03:29:54.000000',12,14,'vue3.4'),(25,'2024-01-15 19:23:00','2024-01-15 19:23:00','审批驳回','7485\n45','2024-01-15 11:23:22.746441','2024-01-19 06:58:17.485378',12,14,'vue3.4'),(26,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','747','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.167913',12,14,'react'),(27,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','44','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.169135',12,18,'react'),(28,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','474','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.170423',13,17,'react'),(29,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','4747','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.173958',14,16,'js'),(30,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','4747','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.175267',14,14,'java'),(31,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','554','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.176403',14,15,'go'),(32,'2024-01-04 00:00:00','2024-01-17 00:00:00','申请中','55','2024-01-15 12:23:10.159089','2024-01-19 06:56:44.177586',13,15,'java'),(33,'2024-01-09 00:00:00','2024-01-10 00:00:00','申请中','2222','2024-01-18 13:23:21.122507','2024-01-19 06:56:44.178779',12,14,'java'),(34,'2024-01-09 00:00:00','2024-01-10 00:00:00','申请中','4561','2024-01-18 13:23:21.122507','2024-01-18 13:23:21.122507',13,15,'js');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_room` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '会议室id',
  `name` varchar(50) NOT NULL COMMENT '会议室名称',
  `location` varchar(50) NOT NULL COMMENT '会议室位置',
  `description` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `isBooked` tinyint NOT NULL DEFAULT '0' COMMENT '是否已预订',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `equipment` varchar(50) NOT NULL COMMENT '会议室设备',
  `capacity` int NOT NULL COMMENT '会议室容量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_room`
--

LOCK TABLES `meeting_room` WRITE;
/*!40000 ALTER TABLE `meeting_room` DISABLE KEYS */;
INSERT INTO `meeting_room` VALUES (12,'一号会议室','一层西','',0,'2023-10-26 00:47:40.653006','2023-10-26 00:47:40.653006','白板',10),(13,'三号报告厅','二层东','',0,'2023-10-26 00:47:40.653006','2023-10-26 00:47:40.653006','',5),(14,'六号研讨室','三层东','',0,'2023-10-26 00:47:40.653006','2023-10-26 00:47:40.653006','白板，电视',30),(22,'575','8888','',0,'2023-10-26 10:50:30.665000','2023-10-26 10:50:30.665000','2',555),(27,'一号会议','7534','45',0,'2024-01-15 09:35:07.736301','2024-01-15 09:35:07.736301','345345',5345354);
/*!40000 ALTER TABLE `meeting_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL COMMENT '权限代码',
  `desc` varchar(100) NOT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'ccc','访问 ccc 接口'),(2,'ddd','访问 ddd 接口'),(3,'ccc','访问 ccc 接口'),(4,'ddd','访问 ddd 接口'),(5,'ccc','访问 ccc 接口'),(6,'ddd','访问 ddd 接口'),(7,'ccc','访问 ccc 接口'),(8,'ddd','访问 ddd 接口'),(9,'ccc','访问 ccc 接口'),(10,'ddd','访问 ddd 接口'),(11,'ccc','访问 ccc 接口'),(12,'ddd','访问 ddd 接口'),(13,'ccc','访问 ccc 接口'),(14,'ddd','访问 ddd 接口'),(15,'ccc','访问 ccc 接口'),(16,'ddd','访问 ddd 接口'),(17,'ccc','访问 ccc 接口'),(18,'ddd','访问 ddd 接口'),(19,'ccc','访问 ccc 接口'),(20,'ddd','访问 ddd 接口'),(21,'ccc','访问 ccc 接口'),(22,'ddd','访问 ddd 接口'),(23,'ccc','访问 ccc 接口'),(24,'ddd','访问 ddd 接口'),(25,'ccc','访问 ccc 接口'),(26,'ddd','访问 ddd 接口'),(27,'ccc','访问 ccc 接口'),(28,'ddd','访问 ddd 接口');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `rolesId` int NOT NULL,
  `permissionsId` int NOT NULL,
  PRIMARY KEY (`rolesId`,`permissionsId`),
  KEY `IDX_0cb93c5877d37e954e2aa59e52` (`rolesId`),
  KEY `IDX_d422dabc78ff74a8dab6583da0` (`permissionsId`),
  CONSTRAINT `FK_0cb93c5877d37e954e2aa59e52c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d422dabc78ff74a8dab6583da02` FOREIGN KEY (`permissionsId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(1,2),(2,1),(3,3),(3,4),(4,3),(5,5),(5,6),(6,5),(7,7),(7,8),(8,7),(9,9),(9,10),(10,9),(11,11),(11,12),(12,11),(13,13),(13,14),(14,13),(15,15),(15,16),(16,15),(17,17),(17,18),(18,17),(19,19),(19,20),(20,19),(21,21),(21,22),(22,21),(23,23),(23,24),(24,23),(25,25),(25,26),(26,25),(27,27),(27,28),(28,27);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rolename` varchar(20) NOT NULL COMMENT '角色名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'管理员'),(2,'普通用户'),(3,'管理员'),(4,'普通用户'),(5,'管理员'),(6,'普通用户'),(7,'管理员'),(8,'普通用户'),(9,'管理员'),(10,'普通用户'),(11,'管理员'),(12,'普通用户'),(13,'管理员'),(14,'普通用户'),(15,'管理员'),(16,'普通用户'),(17,'管理员'),(18,'普通用户'),(19,'管理员'),(20,'普通用户'),(21,'管理员'),(22,'普通用户'),(23,'管理员'),(24,'普通用户'),(25,'管理员'),(26,'普通用户'),(27,'管理员'),(28,'普通用户');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `usersId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`usersId`,`rolesId`),
  KEY `IDX_0d65428bf51c2ce567216427d4` (`usersId`),
  KEY `IDX_5d19ca4692b21d67f692bb837d` (`rolesId`),
  CONSTRAINT `FK_0d65428bf51c2ce567216427d46` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_5d19ca4692b21d67f692bb837df` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (14,27),(15,28);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT 'NULL' COMMENT '用户名',
  `password` varchar(50) NOT NULL DEFAULT 'NULL' COMMENT '密码',
  `head_pic` varchar(100) NOT NULL DEFAULT 'NULL' COMMENT '头像',
  `email` varchar(50) NOT NULL DEFAULT 'NULL' COMMENT '邮箱',
  `nick_name` varchar(50) NOT NULL DEFAULT 'NULL' COMMENT '昵称',
  `phone` varchar(20) NOT NULL DEFAULT 'null' COMMENT '手机号',
  `is_frozen` tinyint NOT NULL DEFAULT '0' COMMENT '是否冻结',
  `is_admin` tinyint NOT NULL DEFAULT '0' COMMENT '是否是管理员',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'zhangsan','670b14728ad9902aecba32e22fa4f6bd','uploads\\1698509988690-24703810-å±å¹æªå¾ 2023-07-16 002251.png','2595531421@qq.com','龙','null',0,0,'2023-10-12 16:10:38.623948','2023-10-28 16:19:49.000000'),(15,'lisi','e3ceb5881a0a1fdaad01296d7554868d','NULL','yy@yy.com','李四','null',0,0,'2023-10-12 16:10:38.636771','2023-10-24 09:09:05.600656'),(16,'zilong','670b14728ad9902aecba32e22fa4f6bd','uploads\\1697813122911-528263702-å±å¹æªå¾ 2023-07-16 002355.png','2595531421@qq.com','long','null',1,1,'2023-10-18 10:39:53.759981','2024-02-11 03:30:51.000000'),(17,'1111','1bbd886460827015e5d605ed44252251','NULL','2595531421@qq.com','111111111','null',0,0,'2023-10-18 11:02:06.832438','2023-10-23 14:36:20.576070'),(18,'11111','adbc91a43e988a3b5b745b8529a90b61','NULL','2595531421@qq.com','111111111111','null',1,0,'2023-10-18 12:57:39.742814','2023-10-28 17:13:06.000000'),(19,'孙子虎','d89ec52c740c99583c8334e1d265efd2','NULL','2368363071@qq.com','咕哒','null',0,0,'2023-10-20 06:57:19.576834','2023-10-28 17:12:55.940853'),(20,'2','4056bdc9e8a363e65e584d01e11321da','NULL','2595531421@qq.com','11111111111','null',1,0,'2023-10-22 10:24:44.350953','2024-01-18 11:44:45.000000'),(21,'gfgf','cd72e5f41a7b1388f349e08cdf505437','NULL','2595531421@qq.com','sfsfs','null',1,0,'2023-10-22 10:25:20.395071','2024-01-18 11:44:44.000000'),(22,'efdfd','faa5f6b4c17f2356e7ddf8d443f4dd63','NULL','2595531421@qq.com','fssfsfs','null',1,0,'2023-10-22 10:25:50.252009','2023-10-28 17:13:02.000000'),(23,'5757575757','670b14728ad9902aecba32e22fa4f6bd','NULL','2595531421@qq.com','zhangsan','null',1,0,'2023-10-22 10:26:23.016588','2023-11-07 06:52:09.000000'),(24,'gsdgdgdg','670b14728ad9902aecba32e22fa4f6bd','NULL','2595531421@qq.com','zhangsan','null',1,0,'2023-10-22 10:27:26.670958','2023-10-28 17:12:40.000000'),(25,'jshafkehwu','670b14728ad9902aecba32e22fa4f6bd','NULL','2595531421@qq.com','zhangsan','null',0,0,'2023-10-22 10:27:53.783187','2023-10-28 17:12:55.937924'),(26,'gdhchjf','670b14728ad9902aecba32e22fa4f6bd','NULL','2595531421@qq.com','zhangsan','null',1,0,'2023-10-22 10:28:17.425093','2023-10-28 17:13:10.000000'),(27,'dgf','446565946256526532','NULL','2595531421@qq.com','46','null',1,0,'2023-10-23 14:26:41.228720','2023-10-28 17:13:08.000000'),(28,'jiahao','670b14728ad9902aecba32e22fa4f6bd','NULL','3426935186@qq.com','佳豪','null',0,0,'2024-02-11 03:36:48.548860','2024-02-11 03:36:48.548860');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-27 11:14:31
