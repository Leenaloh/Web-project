package com.webproject.backend.service.impl;

import com.webproject.backend.model.LoginRequest;
import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

  @Override
  public LoginResponse login(LoginRequest request) {
    return new LoginResponse();
  }

  @Override
  public void logout() {
    // later you will invalidate session here
  }

  @Override
  public LoginResponse me() {
    return new LoginResponse();
  }
}
