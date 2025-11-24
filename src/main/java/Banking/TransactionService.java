package Banking;

import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final AccountDAO accountDAO;

    public TransactionService(AccountDAO accountDAO) {
        this.accountDAO = accountDAO;
    }

    public Account createAccount(Account account) {
        if (account.getBalance() < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        accountDAO.createAccount(account);
        return account;
    }

    public Account deposit(int accountNumber, double amount) {
        validateAmount(amount);
        Account existing = accountDAO.getAccount(accountNumber);
        double newBalance = existing.getBalance() + amount;
        accountDAO.updateBalance(accountNumber, newBalance);
        existing.setBalance(newBalance);
        return existing;
    }

    public Account withdraw(int accountNumber, double amount) {
        validateAmount(amount);
        Account existing = accountDAO.getAccount(accountNumber);
        if (amount > existing.getBalance()) {
            throw new IllegalArgumentException("Insufficient funds for withdrawal");
        }
        double newBalance = existing.getBalance() - amount;
        accountDAO.updateBalance(accountNumber, newBalance);
        existing.setBalance(newBalance);
        return existing;
    }

    public Account updateBalance(int accountNumber, double newBalance) {
        Account existing = accountDAO.getAccount(accountNumber);
        accountDAO.updateBalance(accountNumber, newBalance);
        existing.setBalance(newBalance);
        return existing;
    }

    public Account viewAccount(int accountNumber) {
        return accountDAO.getAccount(accountNumber);
    }

    private void validateAmount(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
}
