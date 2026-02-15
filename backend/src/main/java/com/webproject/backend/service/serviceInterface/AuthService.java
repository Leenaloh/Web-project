package com.webproject.backend.service.serviceInterface;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void logout();
    LoginResponse me();
}
