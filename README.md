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

## How to run locally
- Backend: set DB env vars, ensure MySQL + `accounts` table, then `mvn spring-boot:run`.
- Frontend (Next.js): `cd banking-frontend && npm run dev` (uses port 3000, calls backend at 8080).

## Screenshots

- Login Page : 
![Login or create account](docs/screenshots/login.png)

- Dashboard: 
![Dashboard with actions](docs/screenshots/Dashboard.png)


## API quick curl checks
- Create: `curl -X POST http://localhost:8080/api/accounts -H "Content-Type: application/json" -d '{"accountNumber":1,"customerName":"Alice","balance":100}'`
- Deposit: `curl -X POST http://localhost:8080/api/accounts/1/deposit -H "Content-Type: application/json" -d '{"amount":50}'`
- Withdraw: `curl -X POST http://localhost:8080/api/accounts/1/withdraw -H "Content-Type: application/json" -d '{"amount":20}'`
- View: `curl http://localhost:8080/api/accounts/1`



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
