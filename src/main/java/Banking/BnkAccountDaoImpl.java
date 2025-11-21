package Banking;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BnkAccountDaoImpl implements AccountDAO {
    private static final String JDBC_URL = System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/banking_db");
    private static final String USERNAME = System.getenv().getOrDefault("DB_USERNAME", "bank_user");
    private static final String PASSWORD = System.getenv().getOrDefault("DB_PASSWORD", "user123");

    @Override
    public void createAccount(Account account) {
        try (Connection connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD)) {
            String sql = "INSERT INTO accounts (account_number, customer_name, balance) VALUES (?, ?, ?)";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setInt(1, account.getAccountNumber());
                statement.setString(2, account.getCustomerName());
                statement.setDouble(3, account.getBalance());
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle the exception appropriately in a real application
        }
    }

    @Override
    public void updateBalance(int accountNumber, double newBalance) {
        try (Connection connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD)) {
            String sql = "UPDATE accounts SET balance = ? WHERE account_number = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setDouble(1, newBalance);
                statement.setInt(2, accountNumber);
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle the exception appropriately in a real application
        }
    }

    @Override
    public double getBalance(int accountNumber) {
        double balance = 0.0;
        try (Connection connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD)) {
            String sql = "SELECT balance FROM accounts WHERE account_number = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setInt(1, accountNumber);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        balance = resultSet.getDouble("balance");
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle the exception appropriately in a real application
        }
        return balance;
    }
}

