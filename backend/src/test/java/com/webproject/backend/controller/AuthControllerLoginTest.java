package com.webproject.backend.controller;

import static org.hamcrest.Matchers.notNullValue;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webproject.backend.model.LoginResponse;
import com.webproject.backend.service.serviceInterface.AuthService;

@WebMvcTest(AuthController.class)
class AuthControllerLoginTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private AuthService authService;

  // TC1: Successful login SHOULD create session attributes 
  @Test
  void login_success_shouldCreateSession() throws Exception {
    Mockito.when(authService.login(any()))
    .thenReturn(new LoginResponse("SUCCESS", "Login successful", "1", "Test User"));

    String body = "{\"useremail\":\"test@ksu.edu.sa\",\"password\":\"1234\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(request().sessionAttribute("userId", notNullValue()))
        .andExpect(request().sessionAttribute("name", notNullValue()));
  }

  // TC2: Empty JSON SHOULD be 400 
  @Test
  void login_emptyJson_shouldReturn400() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isBadRequest());
  }

  // TC3: Missing password SHOULD be 400 
  @Test
  void login_missingPassword_shouldReturn400() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());
  }

  // TC4: Wrong credentials SHOULD return 401 
  @Test
  void login_wrongCredentials_shouldReturn401() throws Exception {
    Mockito.when(authService.login(any())).thenReturn(new LoginResponse());

    String body = "{\"useremail\":\"test@ksu.edu.sa\",\"password\":\"WRONG\"}";

    mockMvc
        .perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isUnauthorized());
  }
}
