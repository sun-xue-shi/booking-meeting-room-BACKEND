-- Fix users table column default values
ALTER TABLE users 
CHANGE username username varchar(50) NOT NULL DEFAULT '',
CHANGE password password varchar(50) NOT NULL DEFAULT '',
CHANGE head_pic head_pic varchar(100) DEFAULT '',
ADD COLUMN score int NOT NULL DEFAULT 0;