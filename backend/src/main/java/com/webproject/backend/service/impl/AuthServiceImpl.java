package com.webproject.backend.service.impl;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.model.RegisterRequest;
import com.webproject.backend.service.serviceInterface.AuthService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

  @Autowired private JdbcTemplate jdbcTemplate;

  @Override
  public LoginResponse login(LoginRequest request) {
    String sql = "SELECT id, firstName, lastName FROM customers WHERE email = ? AND password = ?";

    try {
      List<Map<String, Object>> users =
          jdbcTemplate.queryForList(sql, request.getUseremail(), request.getPassword());

      if (users.isEmpty()) {
        return new LoginResponse("FAIL", "Invalid email or password", null, null);
      } else {
        Map<String, Object> user = users.get(0);

        String userId = String.valueOf(user.get("id"));
        String firstName = (String) user.get("firstName");
        String lastName = (String) user.get("lastName");
        String fullName = firstName + " " + lastName;

        return new LoginResponse("SUCCESS", "Login successful", userId, fullName);
      }
    } catch (Exception e) {
      System.err.println("Database Error during login: " + e.getMessage());
      return new LoginResponse("FAIL", "A server error occurred", null, null);
    }
  }

  @Override
  public void logout() {}

  @Override
  public LoginResponse me() {
    return null;
  }

  @Override
  public LoginResponse register(RegisterRequest request) {
    try {
      String checkEmailSql = "SELECT COUNT(*) FROM customers WHERE email = ?";
      Integer count = jdbcTemplate.queryForObject(checkEmailSql, Integer.class, request.getEmail());

      if (count != null && count > 0) {
        return new LoginResponse("FAIL", "Email already exists", null, null);
      }

      java.sql.Date expirationDate = java.sql.Date.valueOf(request.getExpiration());
      java.sql.Date today = new java.sql.Date(System.currentTimeMillis());

      if (expirationDate.before(today)) {
        return new LoginResponse("FAIL", "Credit card is expired", null, null);
      }

      String checkCardSql = "SELECT COUNT(*) FROM creditcards WHERE id = ?";
      Integer cardExists =
          jdbcTemplate.queryForObject(checkCardSql, Integer.class, request.getCcId());

      if (cardExists == null || cardExists == 0) {
        String insertCardSql =
            """
          INSERT INTO creditcards (id, firstName, lastName, expiration)
          VALUES (?, ?, ?, ?)
        """;

        jdbcTemplate.update(
            insertCardSql,
            request.getCcId(),
            request.getFirstName(),
            request.getLastName(),
            expirationDate);
      }

      String insertCustomerSql =
          """
        INSERT INTO customers (firstName, lastName, ccId, address, email, password)
        VALUES (?, ?, ?, ?, ?, ?)
      """;

      jdbcTemplate.update(
          insertCustomerSql,
          request.getFirstName(),
          request.getLastName(),
          request.getCcId(),
          request.getAddress(),
          request.getEmail(),
          request.getPassword());

      return new LoginResponse("SUCCESS", "Registered successfully", null, null);

    } catch (Exception e) {
      System.err.println("Error during registration: " + e.getMessage());
      return new LoginResponse("FAIL", "Server error", null, null);
    }
  }
}
