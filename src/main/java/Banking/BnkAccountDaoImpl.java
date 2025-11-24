package Banking;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class BnkAccountDaoImpl implements AccountDAO {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Account> accountRowMapper = (rs, rowNum) ->
            new Account(
                    rs.getInt("account_number"),
                    rs.getString("customer_name"),
                    rs.getDouble("balance")
            );

    public BnkAccountDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void createAccount(Account account) {
        jdbcTemplate.update(
                "INSERT INTO accounts (account_number, customer_name, balance) VALUES (?, ?, ?)",
                account.getAccountNumber(),
                account.getCustomerName(),
                account.getBalance()
        );
    }

    @Override
    public void updateBalance(int accountNumber, double newBalance) {
        int updated = jdbcTemplate.update(
                "UPDATE accounts SET balance = ? WHERE account_number = ?",
                newBalance,
                accountNumber
        );
        if (updated == 0) {
            throw new AccountNotFoundException("Account not found: " + accountNumber);
        }
    }

    @Override
    public double getBalance(int accountNumber) {
        return getAccount(accountNumber).getBalance();
    }

    @Override
    public Account getAccount(int accountNumber) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT account_number, customer_name, balance FROM accounts WHERE account_number = ?",
                    accountRowMapper,
                    accountNumber
            );
        } catch (EmptyResultDataAccessException e) {
            throw new AccountNotFoundException("Account not found: " + accountNumber);
        }
    }
}

