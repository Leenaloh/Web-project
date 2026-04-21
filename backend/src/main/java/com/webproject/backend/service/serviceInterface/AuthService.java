package com.webproject.backend.service.serviceInterface;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.model.RegisterRequest;

public interface AuthService {
  LoginResponse login(LoginRequest request);

  LoginResponse register(RegisterRequest request);

  void logout();

  LoginResponse me();
}
