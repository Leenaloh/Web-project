package com.webproject.backend.controller;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Login endpoint.
     *
     * @param request LoginRequest containing username and password
     * @return LoginResponse containing user information if login succeeds
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint.
     *
     * Terminates the current authenticated session.
     * @return Returns HTTP 200 OK
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }


    /**
     * Get current logged-in user info (session check).
     *
     * @return LoginResponse indicating whether user is logged in
     */
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me() {
        LoginResponse response = authService.me();
        return ResponseEntity.ok(response);
    }
}
