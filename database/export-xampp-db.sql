-- Export script for XAMPP database migration to Railway
-- Run this in phpMyAdmin or MySQL Workbench with your XAMPP database

-- 1. Export your existing database structure and data
SHOW DATABASES;
USE portfolio_db;

-- Show all tables in your current database
SHOW TABLES;

-- Export table structures
SHOW CREATE TABLE projects;
SHOW CREATE TABLE messages;  
SHOW CREATE TABLE resumes;

-- Export data
SELECT * FROM projects;
SELECT * FROM messages;
SELECT * FROM resumes;

-- Generate INSERT statements
-- You can use phpMyAdmin's Export feature:
-- 1. Go to phpMyAdmin
-- 2. Select your portfolio_db database
-- 3. Click "Export" tab
-- 4. Choose "SQL" format
-- 5. Select "Structure and data"
-- 6. Click "Go" to download the .sql file