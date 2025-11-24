package Banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Scanner;

/**
 * Optional CLI runner that boots Spring (without the web server) and uses the same service layer.
 */
public class BankingApp {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BankingApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);

        try (ConfigurableApplicationContext context = app.run(args);
             Scanner scanner = new Scanner(System.in)) {

            TransactionService service = context.getBean(TransactionService.class);

            int choice;
            do {
                System.out.println("1. Create Account\n2. Make Deposit\n3. Make Withdrawal\n4. Update Balance\n5. View Balance\n6. Exit");
                System.out.print("Enter your choice: ");
                choice = scanner.nextInt();

                try {
                    switch (choice) {
                        case 1 -> {
                            System.out.print("Enter account number: ");
                            int accountNumber = scanner.nextInt();
                            System.out.print("Enter customer name: ");
                            scanner.nextLine(); // consume newline
                            String customerName = scanner.nextLine();
                            System.out.print("Enter initial balance: ");
                            double initialBalance = scanner.nextDouble();
                            Account newAccount = new Account(accountNumber, customerName, initialBalance);
                            service.createAccount(newAccount);
                            System.out.println("Account created: " + newAccount);
                        }
                        case 2 -> {
                            System.out.print("Enter account number: ");
                            int accountNumber = scanner.nextInt();
                            System.out.print("Enter deposit amount: ");
                            double amount = scanner.nextDouble();
                            Account updated = service.deposit(accountNumber, amount);
                            System.out.println("Deposit successful. New balance: $" + updated.getBalance());
                        }
                        case 3 -> {
                            System.out.print("Enter account number: ");
                            int accountNumber = scanner.nextInt();
                            System.out.print("Enter withdrawal amount: ");
                            double amount = scanner.nextDouble();
                            Account updated = service.withdraw(accountNumber, amount);
                            System.out.println("Withdrawal successful. New balance: $" + updated.getBalance());
                        }
                        case 4 -> {
                            System.out.print("Enter account number: ");
                            int accountNumber = scanner.nextInt();
                            System.out.print("Enter new balance: ");
                            double newBalance = scanner.nextDouble();
                            Account updated = service.updateBalance(accountNumber, newBalance);
                            System.out.println("Balance updated. New balance: $" + updated.getBalance());
                        }
                        case 5 -> {
                            System.out.print("Enter account number: ");
                            int accountNumber = scanner.nextInt();
                            Account account = service.viewAccount(accountNumber);
                            System.out.println("Current balance: $" + account.getBalance());
                        }
                        case 6 -> System.out.println("Exiting the application. Goodbye!");
                        default -> System.out.println("Invalid choice. Please try again.");
                    }
                } catch (AccountNotFoundException | IllegalArgumentException ex) {
                    System.out.println("Error: " + ex.getMessage());
                }
            } while (choice != 6);
        }
    }
}
