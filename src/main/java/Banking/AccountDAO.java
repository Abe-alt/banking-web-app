package Banking;

// Persistence contract for account CRUD/balance operations.
public interface AccountDAO {
    void createAccount(Account account);
    void updateBalance(int accountNumber, double newBalance);
    double getBalance(int accountNumber);
    Account getAccount(int accountNumber);
}

