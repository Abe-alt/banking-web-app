package Banking;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
// HTTP layer exposing account CRUD/transactions with basic validation responses.
public class TransactionRestController {

    private final TransactionService transactionService;

    public TransactionRestController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return transactionService.createAccount(account);
    }

    @PostMapping("/{accountNumber}/deposit")
    public Account deposit(@PathVariable int accountNumber, @RequestBody TransactionDTO dto) {
        return transactionService.deposit(accountNumber, dto.getAmount());
    }

    @PostMapping("/{accountNumber}/withdraw")
    public Account withdraw(@PathVariable int accountNumber, @RequestBody TransactionDTO dto) {
        return transactionService.withdraw(accountNumber, dto.getAmount());
    }

    @PutMapping("/{accountNumber}/balance")
    public Account updateBalance(@PathVariable int accountNumber, @RequestBody TransactionDTO dto) {
        return transactionService.updateBalance(accountNumber, dto.getAmount());
    }

    @GetMapping("/{accountNumber}")
    public Account viewAccount(@PathVariable int accountNumber) {
        return transactionService.viewAccount(accountNumber);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(AccountNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadRequest(IllegalArgumentException ex) {
        return Map.of("error", ex.getMessage());
    }
}
