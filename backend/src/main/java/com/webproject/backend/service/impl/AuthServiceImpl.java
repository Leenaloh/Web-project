package com.webproject.backend.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public LoginResponse login(LoginRequest request) {
        String sql = "SELECT id, firstName, lastName FROM customers WHERE email = ? AND password = ?";

        try {
            List<Map<String, Object>> users = jdbcTemplate.queryForList(
                sql, 
                request.getUseremail(), 
                request.getPassword()
            );

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
    public void logout() {
    }

    @Override
    public LoginResponse me() {
        return null; 
    }
}