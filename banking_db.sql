Create database banking_db;

USE banking_db;

CREATE TABLE accounts (
  account_number INT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0
);

select * from accounts; 

desc accounts;

-- create a new user and grant privileges

CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'user123';
SELECT User, Host FROM mysql.user;
GRANT ALL PRIVILEGES ON banking_db.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'bank_user'@'localhost';
