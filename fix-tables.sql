-- 修复users表的字段默认值问题
ALTER TABLE users 
CHANGE username username varchar(50) NOT NULL COMMENT '用户名' DEFAULT '',
CHANGE password password varchar(50) NOT NULL COMMENT '密码' DEFAULT '',
CHANGE head_pic head_pic varchar(100) DEFAULT '',
ADD COLUMN score int NOT NULL DEFAULT 0 COMMENT 'IP评分';

-- 检查并修复其他表的类似问题
SHOW TABLES;