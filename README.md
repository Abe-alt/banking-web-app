# Banking App (Spring Boot)

RESTful API plus optional console runner for basic banking operations using Spring Boot, JDBC, and MySQL.

## Prerequisites
- Java 17+
- Maven 3.8+
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
Export env vars before running:
```bash
export DB_URL="jdbc:mysql://localhost:3306/banking_db"
export DB_USERNAME="bank_user"
export DB_PASSWORD="user123"
```
`.env` files are not auto-loaded; `set -a; source .env; set +a` will export them if you prefer.

## Run the REST API
Start the Spring Boot service on port 8080:
```bash
mvn spring-boot:run
```
Base URL: `http://localhost:8080/api`
- `POST /accounts` — `{ "accountNumber": 1, "customerName": "Alice", "balance": 100.0 }`
- `POST /accounts/{accountNumber}/deposit` — `{ "amount": 50 }`
- `POST /accounts/{accountNumber}/withdraw` — `{ "amount": 20 }`
- `PUT /accounts/{accountNumber}/balance` — `{ "amount": 999 }`
- `GET /accounts/{accountNumber}` — returns the account (with balance)

## Optional CLI
Run the interactive console (non-web):
```bash
mvn -DskipTests exec:java -Dexec.mainClass=Banking.BankingApp
```

## Tests
Run unit tests (in-memory stub, no DB required):
```bash
mvn test
```

## Notes
- REST main class: `Banking.BankingApplication`.
- CLI main class: `Banking.BankingApp`.
- If you hit Maven download permission issues, clear/fix your local `~/.m2` permissions.
