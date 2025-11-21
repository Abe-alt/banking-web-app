package Banking;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TransactionControllerTest {

    private InMemoryAccountDao accountDAO;
    private CapturingTransactionView view;
    private TransactionController controller;

    @BeforeEach
    void setUp() {
        accountDAO = new InMemoryAccountDao();
        view = new CapturingTransactionView();
        controller = new TransactionController(accountDAO, view);
    }

    @Test
    void depositIncreasesBalance() {
        controller.createAccount(new Account(1, "Alice", 100.0));

        controller.makeDeposit(1, 50.0);

        assertEquals(150.0, accountDAO.getBalance(1));
    }

    @Test
    void withdrawalDecreasesBalanceWhenSufficient() {
        controller.createAccount(new Account(2, "Bob", 200.0));

        controller.makeWithdrawal(2, 75.0);

        assertEquals(125.0, accountDAO.getBalance(2));
    }

    @Test
    void withdrawalFailsWhenInsufficient() {
        controller.createAccount(new Account(3, "Carol", 50.0));

        controller.makeWithdrawal(3, 60.0);

        // Balance unchanged
        assertEquals(50.0, accountDAO.getBalance(3));
    }

    @Test
    void updateBalanceSetsExactValue() {
        controller.createAccount(new Account(4, "Dan", 10.0));

        controller.updateBalance(4, 999.0);

        assertEquals(999.0, accountDAO.getBalance(4));
    }

    // Simple in-memory DAO for tests
    private static class InMemoryAccountDao implements AccountDAO {
        private final Map<Integer, Account> store = new HashMap<>();

        @Override
        public void createAccount(Account account) {
            store.put(account.getAccountNumber(), account);
        }

        @Override
        public void updateBalance(int accountNumber, double newBalance) {
            Account acc = store.get(accountNumber);
            if (acc == null) {
                throw new IllegalArgumentException("Account not found: " + accountNumber);
            }
            acc.setBalance(newBalance);
        }

        @Override
        public double getBalance(int accountNumber) {
            Account acc = store.get(accountNumber);
            if (acc == null) {
                throw new IllegalArgumentException("Account not found: " + accountNumber);
            }
            return acc.getBalance();
        }
    }

    // Captures messages instead of printing. Extend later to assert messages.
    private static class CapturingTransactionView extends TransactionView {
        private String lastMessage;

        @Override
        public void displayMessage(String message) {
            this.lastMessage = message;
        }

        public String getLastMessage() {
            return lastMessage;
        }
    }
}
