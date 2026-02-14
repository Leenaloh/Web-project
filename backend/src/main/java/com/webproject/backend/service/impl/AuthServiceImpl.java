package com.webproject.backend.service;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final HttpSession session;

    public AuthServiceImpl(HttpSession session) {
        this.session = session;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return new LoginResponse("error", "username/password required", null, null);
        }
        // Phase 2 stub: accept any user
        session.setAttribute("user", request.getUsername());
        return new LoginResponse("success", null, request.getUsername(), request.getUsername());
    }

    @Override
    public LoginResponse logout() {
        session.invalidate();
        return new LoginResponse("success", "logged out", null, null);
    }

    @Override
    public LoginResponse me() {
        Object user = session.getAttribute("user");
        if (user == null) {
            return new LoginResponse("error", "not logged in", null, null);
        }
        return new LoginResponse("success", null, user.toString(), user.toString());
    }
}