# Banking Console App

Simple console-based banking app using JDBC and Maven.

## Prerequisites
- Java 17+
- Maven 3.8+ (or newer)
- MySQL server

## Database setup
1) Create DB and user (example):
```sql
CREATE DATABASE banking_db;
CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'user123';
GRANT ALL ON banking_db.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
```
2) Create the `accounts` table:
```sql
USE banking_db;
CREATE TABLE accounts (
  account_number INT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0
);
```

## Configure connection
The app reads connection info from environment variables. Export them in the same shell you run Maven:
```bash
export DB_URL="jdbc:mysql://localhost:3306/banking_db"
export DB_USERNAME="bank_user"
export DB_PASSWORD="user123"
```
`.env` files are not auto-loaded; `set -a; source .env; set +a` will export them if you prefer.

## Build and run
Compile and run the console app:
```bash
mvn clean compile exec:java
```
If dependencies were cached with errors, refresh with `-U`.

## Tests
Run unit tests (in-memory stubs, no DB required):
```bash
mvn test
```

## Notes
- Main class: `Banking.BankingApp`.
- Warnings about `sun.misc.Unsafe` come from Maven’s own dependencies and do not affect the app.***
