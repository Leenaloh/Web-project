package com.webproject.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class AuthController {

  @Autowired private AuthService authService;

  /**
   * Login endpoint.
   *
   * @param request LoginRequest containing username and password
   * @return LoginResponse containing user information if login succeeds
   */
  @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        
        LoginResponse response = authService.login(request);
        
        if ("SUCCESS".equals(response.getStatus())) {
            HttpSession session = httpRequest.getSession();
            session.setAttribute("userId", response.getUserId());
            session.setAttribute("name", response.getName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

  /**
   * Logout endpoint.
   *
   * <p>Terminates the current authenticated session.
   *
   * @return Returns HTTP 200 OK
   */
  @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        authService.logout();
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }

  /**
   * Get current logged-in user info (session check).
   *
   * @return LoginResponse indicating whether user is logged in
   */
  @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null && session.getAttribute("userId") != null) {
            String userId = (String) session.getAttribute("userId");
            String name = (String) session.getAttribute("name");
            return ResponseEntity.ok(new LoginResponse("SUCCESS", "Authenticated", userId, name));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("FAIL", "Not logged in", null, null));
        }
    }
}
