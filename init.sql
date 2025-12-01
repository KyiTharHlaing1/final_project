-- Create database
CREATE DATABASE IF NOT EXISTS users_db;
USE users_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  city VARCHAR(100) NOT NULL
);

-- Seed data
INSERT INTO users (name, email, city) VALUES
('Kyithar', 'kyithar@example.com', 'Bangkok'),
('Alice', 'alice@example.com', 'Chiang Mai'),
('Bob', 'bob@example.com', 'Phuket');
